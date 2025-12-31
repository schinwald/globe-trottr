import z from "zod";
import { CHANNELS, subscribe } from "../utils/redis/index.js";
import { t } from "../utils/trpc.js";
import { requireUser } from "../utils/user.js";

export const procedure = t.procedure
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
		} catch (error) {
			console.error(error);
		} finally {
			await subscriber.unsubscribe();
			subscriber.disconnect();
		}
	});
