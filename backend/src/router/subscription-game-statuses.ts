import type { GameStatus } from "@globe-trottr/shared/types/proto/v1/messages/game_statuses_pb.js";
import { TRPCError } from "@trpc/server";
import z from "zod/v4";
import { CHANNELS, subscribe } from "../utils/redis/index.js";
import { getGameStatusFromEntities } from "../utils/redis/utils/game-status.js";
import { procedure } from "../utils/trpc.js";

export const p = procedure
	.input(z.object({ roomCode: z.string() }))
	.subscription(async function* ({ input, signal }) {
		const { iterator, subscriber } = await subscribe(
			CHANNELS.GAME_STATUSES(input.roomCode),
			{ signal },
		);

		try {
			const gameStatus = await getGameStatusFromEntities(input.roomCode);

			if (!gameStatus) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Game status not found",
				});
			}

			yield gameStatus as GameStatus;

			for await (const data of iterator) {
				yield data as GameStatus;
			}
		} finally {
			await subscriber.unsubscribe();
			subscriber.disconnect();
		}
	});
