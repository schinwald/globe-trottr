import {
	type GameStatus,
	GameStatusSchema,
} from "@globe-trottr/shared/types/proto/v1/messages/game_statuses_pb.js";
import {
	create,
	dateFromTimestamp,
	timestampFromDate,
} from "@globe-trottr/shared/utils/protobuf.js";
import { gameRepository } from "../models/index.js";

export const getGameStatusFromEntities = async (
	roomCode: string,
): Promise<GameStatus | null> => {
	const game = await gameRepository
		.search()
		.where("roomCode")
		.equals(roomCode)
		.returnFirst();

	if (!game) {
		return null;
	}

	return create(GameStatusSchema, {
		startedAt: timestampFromDate(game.startedAt),
	});
};

export const packageGameStatus = (gameStatus: GameStatus) => {
	return {
		startedAt: dateFromTimestamp(gameStatus.startedAt),
	} as const;
};
