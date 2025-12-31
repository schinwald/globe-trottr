import { timestampFromDate } from "@globe-trottr/shared/utils/protobuf.js";
import z from "zod";
import { gameCountriesFoundRepository } from "@/utils/redis/models/index.js";
import { CHANNELS } from "../utils/redis/channels.js";
import { gameRepository } from "../utils/redis/models/games/index.js";
import { publish } from "../utils/redis/publisher.js";
import { procedure } from "../utils/trpc.js";

export const p = procedure
	.input(
		z.object({
			roomCode: z.string(),
		}),
	)
	.mutation(async ({ input, ctx }) => {
		const game = await gameRepository.start(input.roomCode);
		ctx.log.info({ roomCode: input.roomCode }, "Game started");

		// Clear all previous game data
		const ids = await gameCountriesFoundRepository.search().returnAllIds();
		for (const id of ids) {
			await gameCountriesFoundRepository.remove(id);
		}

		await publish(CHANNELS.GAME_STATUSES(input.roomCode), {
			startedAt: timestampFromDate(game.startedAt),
		});

		ctx.log.info({ game }, "Publishing game started");
	});
