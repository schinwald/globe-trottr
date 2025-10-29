import z from "zod";
import redis from "../utils/redis.js";
import { t } from "../utils/trpc.js";

export const procedure = t.procedure
	.input(z.object({ roomCode: z.string(), userId: z.string() }))
	.subscription(async function* ({ input, signal }) {
		const subscriber = redis.duplicate();
		// await subscriber.subscribe(ROOM_CONNECTION_CHANNEL(input.roomCode));
		// const iterator = createSubscriberIterator(subscriber, { signal });
		//
		// try {
		// 	for await (const { message } of await iterator) {
		// 		if (signal?.aborted) break;
		// 		const data = JSON.parse(message);
		// 		if (data.event === "join" || data.event === "leave") {
		// 			yield data;
		// 		}
		// 	}
		// } finally {
		// 	await subscriber.unsubscribe();
		// 	subscriber.disconnect();
		// }
	});
