import z from "zod/v4";
import redis from "../utils/redis.js";
import {
	createSubscriberIterator,
	GAME_SETTINGS_CHANGES_CHANNEL,
	type GameSettings,
	getGameSettings,
} from "../utils/redis-schema.js";
import { t } from "../utils/trpc.js";

export const procedure = t.procedure
	.input(z.object({ roomCode: z.string() }))
	.subscription(async function* ({ input, signal }) {
		const subscriber = redis.duplicate();
		subscriber.subscribe(GAME_SETTINGS_CHANGES_CHANNEL(input.roomCode));
		const iterator = await createSubscriberIterator(subscriber, { signal });

		try {
			const settings = await getGameSettings(input.roomCode);
			yield settings;

			for await (const data of iterator) {
				yield JSON.parse(data.message) as GameSettings;
			}
		} finally {
			await subscriber.unsubscribe();
			subscriber.disconnect();
		}
	});
