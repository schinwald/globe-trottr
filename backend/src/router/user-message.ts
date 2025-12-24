import z from "zod";
import { type Country, countries } from "../utils/countries.js";
import {
	getGameState,
	getGuessedCountries,
	guessCountry,
	publishGameCountryStatus,
	publishUserMessage,
} from "../utils/redis-schema.js";
import { t } from "../utils/trpc.js";
import { requireUser } from "../utils/user.js";

export const procedure = t.procedure
	.input(
		z.object({
			roomCode: z.string(),
			guess: z.string().min(1),
		}),
	)
	.mutation(async ({ input, ctx }) => {
		const user = requireUser(ctx);
		const gameState = await getGameState(input.roomCode);

		let country: Country | null = null;
		if (["in-progress"].includes(gameState)) {
			country = await guessCountry({
				roomCode: input.roomCode,
				userId: user.id,
				guess: input.guess,
			});
			ctx.log.info({ input }, "Guessing country");

			const guessedCountries = await getGuessedCountries(input.roomCode);

			await publishGameCountryStatus(input.roomCode, "country-statuses", {
				countries: countries.map((country) => {
					return {
						...country,
						guessed: guessedCountries[country.iso],
					};
				}),
			});
			ctx.log.info({ input }, "Publishing country statuses to room");
		}

		await publishUserMessage(input.roomCode, "message", {
			userId: user.id,
			guess: input.guess,
			country,
		});
		ctx.log.info({ input }, "Publishing user message to room");
	});
