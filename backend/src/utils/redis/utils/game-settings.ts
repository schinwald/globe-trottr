import {
	type GameSettings,
	GameSettingsSchema,
} from "@globe-trottr/shared/types/proto/v1/messages/game_settings_pb.js";
import { create } from "@globe-trottr/shared/utils/protobuf.js";
import { gameRepository } from "../models/index.js";

export const getGameSettingsFromEntities = async (
	roomCode: string,
): Promise<GameSettings | null> => {
	const game = await gameRepository
		.search()
		.where("roomCode")
		.equals(roomCode)
		.returnFirst();

	if (!game) {
		return null;
	}

	return create(GameSettingsSchema, {
		maxPlayers: game.settingsMaxPlayers,
		delay: game.settingsDelay,
		duration: game.settingsDuration,
	});
};
