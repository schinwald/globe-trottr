import z from "zod";
import type { Country } from "../utils/countries.js";
import redis from "../utils/redis.js";
import {
	createSubscriberIterator,
	ROOM_COUNTRY_STATUSES_CHANNEL,
} from "../utils/redis-schema.js";
import { t } from "../utils/trpc.js";

export const procedure = t.procedure
	.input(z.object({ roomCode: z.string() }))
	.subscription(async function* ({ input, signal }) {
		const subscriber = redis.duplicate();
		await subscriber.subscribe(ROOM_COUNTRY_STATUSES_CHANNEL(input.roomCode));
		const iterator = createSubscriberIterator(subscriber, { signal });

		try {
			for await (const data of await iterator) {
				yield JSON.parse(data.message) as {
					countries: (Country & { guessed: boolean })[];
				};
			}
		} finally {
			await subscriber.unsubscribe();
			subscriber.disconnect();
		}
	});
