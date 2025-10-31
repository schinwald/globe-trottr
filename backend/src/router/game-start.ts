import z from "zod";
import { countries } from "../utils/countries.js";
import {
	publishGameCountryStatus,
	publishGameStatus,
	startGame,
} from "../utils/redis-schema.js";
import { t } from "../utils/trpc.js";

export const procedure = t.procedure
	.input(
		z.object({
			roomCode: z.string(),
		}),
	)
	.mutation(async ({ input, ctx }) => {
		const startedAt = await startGame({ roomCode: input.roomCode });
		ctx.log.info({ roomCode: input.roomCode }, "Game started");

		await publishGameStatus(input.roomCode, "started", {
			startedAt,
		});
		ctx.log.info({ startedAt }, "Publishing game started");

		await publishGameCountryStatus(input.roomCode, "country-statuses", {
			countries: countries.map((country) => {
				return {
					...country,
					guessed: false,
				};
			}),
		});
		ctx.log.info({ startedAt }, "Publishing game country started");
	});
