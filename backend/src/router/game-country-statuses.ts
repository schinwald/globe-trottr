import z from "zod";
import { type Country, countries } from "../utils/countries.js";
import redis from "../utils/redis.js";
import {
	createSubscriberIterator,
	getGuessedCountries,
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
			const guessedCountries = await getGuessedCountries(input.roomCode);
			yield {
				countries: countries.map((country) => {
					return {
						...country,
						guessed: guessedCountries[country.iso],
					};
				}),
			};

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
