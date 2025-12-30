import {
	Role,
	type RoomConnections,
	RoomConnectionsSchema,
} from "@globe-trottr/shared/types/proto/v1/messages/room_connections_pb.js";
import { create } from "@globe-trottr/shared/utils/protobuf.js";
import { roomUsersRepository, userRepository } from "../models/index.js";

type StringRole = "host" | "guest" | "unspecified";

const exhaustive = (value: never): never => {
	throw new Error(`Unhandled value: ${value}`);
};

const roleToString = (role: Role): StringRole => {
	switch (role) {
		case Role.HOST:
			return "host";
		case Role.GUEST:
			return "guest";
		case Role.UNSPECIFIED:
			return "unspecified";
		default:
			throw exhaustive(role);
	}
};

const stringToRole = (role: StringRole) => {
	switch (role) {
		case "host":
			return Role.HOST;
		case "guest":
			return Role.GUEST;
		case "unspecified":
			return Role.UNSPECIFIED;
		default:
			throw exhaustive(role);
	}
};

export const getRoomConnectionsFromEntities = async (
	roomCode: string,
): Promise<RoomConnections> => {
	const roomUsers = await roomUsersRepository
		.search()
		.where("roomCode")
		.equals(roomCode)
		.returnAll();

	// TODO: figure out how to do this in one query to avoid n+1 query
	const users = await Promise.all(
		roomUsers.map(async (roomUser) => {
			const user = await userRepository
				.search()
				.where("id")
				.equals(roomUser.userId)
				.returnFirst();

			return {
				id: user!.id,
				username: user!.username,
				role: stringToRole(roomUser.role),
			};
		}),
	);

	return create(RoomConnectionsSchema, {
		users,
	});
};
