import { TRPCError } from "@trpc/server";
import z from "zod";
import { CONSTANTS } from "../utils/constants.js";
import {
	changeGameSettings,
	getGameState,
	publishGameSettingsChange,
} from "../utils/redis-schema.js";
import { t } from "../utils/trpc.js";

export const procedure = t.procedure
	.input(
		z.object({
			roomCode: z.string(),
			delay: z.number(),
			duration: z.number(),
		}),
	)
	.mutation(async ({ input, ctx }) => {
		const gameState = await getGameState(input.roomCode);
		if (["counting-down", "in-progress"].includes(gameState)) {
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "Game is in progress",
			});
		}

		const settings = await changeGameSettings({
			roomCode: input.roomCode,
			userId: ctx.info.user.id,
			settings: {
				maxPlayers: CONSTANTS.MAX_PLAYERS,
				delay: input.delay,
				duration: input.duration,
			},
		});
		ctx.log.info({ roomCode: input.roomCode }, "Game started");

		await publishGameSettingsChange(input.roomCode, "settings", settings);

		return settings;
	});
