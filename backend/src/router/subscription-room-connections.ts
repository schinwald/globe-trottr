import type { RoomConnections } from "@globe-trottr/shared/types/proto/v1/messages/room_connections_pb.js";
import { TRPCError } from "@trpc/server";
import z from "zod/v4";
import { CHANNELS, publish, subscribe } from "../utils/redis/index.js";
import { roomUsersRepository } from "../utils/redis/models/index.js";
import { getRoomConnectionsFromEntities } from "../utils/redis/utils/room-connections.js";
import { procedure } from "../utils/trpc.js";
import { requireUser } from "../utils/user.js";

export const p = procedure
	.input(z.object({ roomCode: z.string() }))
	.subscription(async function* ({ input, signal, ctx }) {
		const user = requireUser(ctx);

		const { iterator, subscriber } = await subscribe(
			CHANNELS.ROOM_CONNECTIONS(input.roomCode),
			{ signal },
		);

		try {
			await roomUsersRepository.joinRoom({
				roomCode: input.roomCode,
				userId: user.id,
			});

			const roomConnections = await getRoomConnectionsFromEntities(
				input.roomCode,
			);

			if (!roomConnections) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Room connections not found",
				});
			}

			yield roomConnections as RoomConnections;

			await publish(CHANNELS.ROOM_CONNECTIONS(input.roomCode), roomConnections);

			for await (const data of iterator) {
				yield data as RoomConnections;
			}
		} finally {
			await (async () => {
				try {
					const left = await roomUsersRepository.leaveRoom({
						roomCode: input.roomCode,
						userId: user.id,
					});
					if (!left) return;
				} catch (error) {
					console.error(error);
				}

				const roomConnections = await getRoomConnectionsFromEntities(
					input.roomCode,
				);

				if (!roomConnections) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Room connections not found",
					});
				}

				await publish(
					CHANNELS.ROOM_CONNECTIONS(input.roomCode),
					roomConnections,
				);
			})();

			await subscriber.unsubscribe();
			subscriber.disconnect();
		}
	});
