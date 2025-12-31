import type { GameSettings } from "@globe-trottr/shared/types/proto/v1/messages/game_settings_pb.js";
import { TRPCError } from "@trpc/server";
import z from "zod/v4";
import { CHANNELS, subscribe } from "../utils/redis/index.js";
import { getGameSettingsFromEntities } from "../utils/redis/utils/game-settings.js";
import { procedure } from "../utils/trpc.js";

export const p = procedure
	.input(z.object({ roomCode: z.string() }))
	.subscription(async function* ({ input, signal }) {
		const { iterator, subscriber } = await subscribe(
			CHANNELS.GAME_SETTINGS(input.roomCode),
			{ signal },
		);

		try {
			const gameSettings = await getGameSettingsFromEntities(input.roomCode);

			if (!gameSettings) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Game settings not found",
				});
			}

			yield gameSettings as GameSettings;

			for await (const data of iterator) {
				yield data as GameSettings;
			}
		} finally {
			await subscriber.unsubscribe();
			subscriber.disconnect();
		}
	});
