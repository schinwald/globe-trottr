import z from "zod";
import redis from "../utils/redis.js";
import {
	createSubscriberIterator,
	ROOM_GUESSES_CHANNEL,
} from "../utils/redis-schema.js";
import { t } from "../utils/trpc.js";

export const procedure = t.procedure
	.input(z.object({ roomCode: z.string(), userId: z.string() }))
	.subscription(async function* ({ input, signal, ctx }) {
		const subscriber = redis.duplicate();
		await subscriber.subscribe(ROOM_GUESSES_CHANNEL(input.roomCode));
		const iterator = createSubscriberIterator(subscriber);

		try {
			for await (const { message } of await iterator) {
				if (signal?.aborted) break;
				ctx.log.info({ message }, "Consuming guess");
				yield JSON.parse(message);
			}
		} finally {
			await subscriber.unsubscribe();
			subscriber.disconnect();
		}
	});
