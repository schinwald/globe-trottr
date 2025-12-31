import { countries } from "@globe-trottr/shared/utils/countries.js";
import { deriveGameState } from "@globe-trottr/shared/utils/game.js";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { CHANNELS } from "../utils/redis/channels.js";
import { gameRepository } from "../utils/redis/models/games/index.js";
import { gameCountriesFoundRepository } from "../utils/redis/models/index.js";
import { publish } from "../utils/redis/publisher.js";
import { procedure } from "../utils/trpc.js";
import { requireUser } from "../utils/user.js";

export const p = procedure
	.input(
		z.object({
			roomCode: z.string(),
			settings: z.object({
				// maxPlayers: z.number(),
				delay: z.number(),
				duration: z.number(),
			}),
		}),
	)
	.mutation(async ({ input, ctx }) => {
		requireUser(ctx);

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

		if (["counting-down", "in-progress"].includes(state)) {
			throw new TRPCError({
				code: "BAD_REQUEST",
				message:
					"Game has started! Please wait until the game is over to change settings.",
			});
		}

		game.settingsDuration = input.settings.duration;
		game.settingsDelay = input.settings.delay;

		gameRepository.save(game);
		ctx.log.info({ roomCode: input.roomCode }, "Game settings saved");

		const settings = {
			maxPlayers: game.settingsMaxPlayers,
			duration: game.settingsDuration,
			delay: game.settingsDelay,
		};

		await publish(CHANNELS.GAME_SETTINGS(input.roomCode), settings);

		return settings;
	});
