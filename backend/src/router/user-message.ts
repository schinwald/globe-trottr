import z from "zod";
import { countries } from "../utils/countries.js";
import {
	getGuessedCountries,
	guessCountry,
	publishRoomCountryStatuses,
	publishUserMessage,
} from "../utils/redis-schema.js";
import { t } from "../utils/trpc.js";

export const procedure = t.procedure
	.input(
		z.object({
			roomCode: z.string(),
			guess: z.string(),
		}),
	)
	.mutation(async ({ input, ctx }) => {
		const isCorrect = await guessCountry({
			roomCode: input.roomCode,
			userId: ctx.info.user.id,
			guess: input.guess,
		});
		ctx.log.info({ input }, "Guessing country");

		const guessedCountries = await getGuessedCountries(input.roomCode);

		await publishUserMessage(input.roomCode, "message", {
			userId: ctx.info.user.id,
			guess: input.guess,
			isCorrect,
		});
		ctx.log.info({ input }, "Publishing user message to room");

		await publishRoomCountryStatuses(input.roomCode, "country-statuses", {
			countries: countries.map((country) => {
				return {
					...country,
					guessed: guessedCountries[country.iso],
				};
			}),
		});
		ctx.log.info({ input }, "Publishing country statuses to room");
	});
