import z from "zod";
import { CONSTANTS } from "../utils/constants.js";
import {
	changeGameSettings,
	publishGameSettingsChange,
} from "../utils/redis-schema.js";
import { t } from "../utils/trpc.js";

export const procedure = t.procedure
	.input(
		z.object({
			roomCode: z.string(),
			duration: z.number(),
		}),
	)
	.mutation(async ({ input, ctx }) => {
		const settings = await changeGameSettings({
			roomCode: input.roomCode,
			userId: ctx.info.user.id,
			settings: {
				maxPlayers: CONSTANTS.MAX_PLAYERS,
				duration: input.duration,
			},
		});
		ctx.log.info({ roomCode: input.roomCode }, "Game started");

		await publishGameSettingsChange(input.roomCode, "settings", settings);

		return settings;
	});
