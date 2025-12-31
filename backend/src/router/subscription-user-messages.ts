import z from "zod";
import { CHANNELS, subscribe } from "../utils/redis/index.js";
import { procedure } from "../utils/trpc.js";
import { requireUser } from "../utils/user.js";

export const p = procedure
	.input(z.object({ roomCode: z.string() }))
	.subscription(async function* ({ input, signal, ctx }) {
		requireUser(ctx);

		const { iterator, subscriber } = await subscribe(
			CHANNELS.USER_MESSAGES(input.roomCode),
			{ signal },
		);

		try {
			for await (const data of iterator) {
				yield data;
			}
		} finally {
			await subscriber.unsubscribe();
			subscriber.disconnect();
		}
	});
