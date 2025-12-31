import {
	countries,
	validateGuess,
} from "@globe-trottr/shared/utils/countries.js";
import { deriveGameState } from "@globe-trottr/shared/utils/game.js";
import { timestampFromDate } from "@globe-trottr/shared/utils/protobuf.js";
import { TRPCError } from "@trpc/server";
import crypto from "crypto";
import z from "zod";
import { CHANNELS } from "../utils/redis/channels.js";
import {
	gameCountriesFoundRepository,
	gameRepository,
} from "../utils/redis/models/index.js";
import { publish } from "../utils/redis/publisher.js";
import { procedure } from "../utils/trpc.js";
import { requireUser } from "../utils/user.js";

export const p = procedure
	.input(
		z.object({
			roomCode: z.string(),
			message: z.string().min(1),
		}),
	)
	.mutation(async ({ input, ctx }) => {
		const user = requireUser(ctx);

		const game = await gameRepository
			.search()
			.where("roomCode")
			.equals(input.roomCode)
			.returnFirst();

		if (!game) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "Game not found",
			});
		}

		const countryIdsFound = await gameCountriesFoundRepository
			.search()
			.where("roomCode")
			.equals(input.roomCode)
			.returnAll()
			.then((countriesFound) =>
				countriesFound.map((country) => country.countryId),
			);

		const countriesFound = countries.filter((country) => {
			return countryIdsFound.includes(country.id);
		});

		const state = deriveGameState({
			startedAt: game.startedAt,
			duration: game.settingsDuration,
			delay: game.settingsDelay,
			countriesFound,
		});

		const guess = validateGuess(input.message);
		const timestamp = new Date();

		if (["in-progress"].includes(state)) {
			ctx.log.info({ input }, "Guessing country");

			if (guess) {
				await gameCountriesFoundRepository.save({
					roomCode: input.roomCode,
					userId: user.id,
					countryId: guess.id,
					timestamp,
				});
				ctx.log.info({ guess }, "Successfully guessed country");
			}

			await publish(CHANNELS.USER_MESSAGES(input.roomCode), {
				id: crypto.randomUUID(),
				userId: user.id,
				message: input.message,
				timestamp: timestampFromDate(timestamp),
				meta: {
					case: "metaGuess",
					value: {
						score: guess ? 1 : 0,
						countryId: guess?.iso,
					},
				},
			});
		} else {
			await publish(CHANNELS.USER_MESSAGES(input.roomCode), {
				id: crypto.randomUUID(),
				userId: user.id,
				message: input.message,
				timestamp: timestampFromDate(timestamp),
				meta: {
					case: "metaMessage",
					value: {},
				},
			});
		}
	});
