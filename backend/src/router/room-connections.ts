import z from "zod/v4";
import redis from "../utils/redis.js";
import {
	createSubscriberIterator,
	getRoomUsers,
	joinRoom,
	leaveRoom,
	publishRoomConnection,
	ROOM_CONNECTION_CHANNEL,
	type User,
} from "../utils/redis-schema.js";
import { t } from "../utils/trpc.js";
import { requireUser } from "../utils/user.js";

export const procedure = t.procedure
	.input(z.object({ roomCode: z.string() }))
	.subscription(async function* ({ input, signal, ctx }) {
		const user = requireUser(ctx);
		const subscriber = redis.duplicate();
		subscriber.subscribe(ROOM_CONNECTION_CHANNEL(input.roomCode));
		const iterator = await createSubscriberIterator(subscriber, { signal });

		try {
			await joinRoom({
				roomCode: input.roomCode,
				userId: user.id,
			});

			const users = await getRoomUsers(input.roomCode);

			const payload = { users };

			await publishRoomConnection(input.roomCode, "join", payload);
			yield payload;

			for await (const data of iterator) {
				yield JSON.parse(data.message) as {
					users: (User & { id: string; role: "host" | "guest" })[];
				};
			}
		} finally {
			await (async () => {
				const left = await leaveRoom({
					roomCode: input.roomCode,
					userId: user.id,
				});
				if (!left) return;

				const users = await getRoomUsers(input.roomCode);

				await publishRoomConnection(input.roomCode, "leave", {
					users,
				});
			})();

			await subscriber.unsubscribe();
			subscriber.disconnect();
		}
	});
