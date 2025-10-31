import z from "zod/v4";
import redis from "../utils/redis.js";
import {
	createSubscriberIterator,
	GAME_STATUSES_CHANNEL,
	getGameStatus,
} from "../utils/redis-schema.js";
import { t } from "../utils/trpc.js";

export const procedure = t.procedure
	.input(z.object({ roomCode: z.string() }))
	.subscription(async function* ({ input, signal }) {
		const subscriber = redis.duplicate();
		subscriber.subscribe(GAME_STATUSES_CHANNEL(input.roomCode));
		const iterator = await createSubscriberIterator(subscriber, { signal });

		try {
			const status = await getGameStatus(input.roomCode);
			yield status;

			for await (const data of iterator) {
				yield JSON.parse(data.message) as {
					startedAt: number;
				};
			}
		} finally {
			await subscriber.unsubscribe();
			subscriber.disconnect();
		}
	});
