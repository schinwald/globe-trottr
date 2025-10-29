import z from "zod";
import { guessCountry, publishGuessedCountry } from "../utils/redis-schema.js";
import { t } from "../utils/trpc.js";

export const procedure = t.procedure
	.input(
		z.object({
			roomCode: z.string(),
			guess: z.string(),
		}),
	)
	.mutation(async ({ input, ctx }) => {
		await guessCountry({
			roomCode: input.roomCode,
			userId: ctx.info.user.id,
			guess: input.guess,
		});
		ctx.log.info({ input }, "Guessing country");

		await publishGuessedCountry(input.roomCode, "guess", {
			userId: ctx.info.user.id,
			guess: input.guess,
		});
		ctx.log.info({ input }, "Publishing guess to country");
	});
