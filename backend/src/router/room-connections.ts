import { v4 as uuid } from "uuid";
import z from "zod/v4";
import redis from "../utils/redis.js";
import {
	createSubscriberIterator,
	getRoomUsers,
	joinRoom,
	leaveRoom,
	publishRoomUpdate,
	ROOM_CONNECTION_CHANNEL,
} from "../utils/redis-schema.js";
import { t } from "../utils/trpc.js";

export const procedure = t.procedure
	.input(z.object({ roomCode: z.string(), username: z.string() }))
	.subscription(async function* ({ input, ctx }) {
		const userId = uuid();
		const subscriber = redis.duplicate();
		subscriber.subscribe(ROOM_CONNECTION_CHANNEL(input.roomCode));
		const iterator = await createSubscriberIterator(subscriber);

		try {
			await joinRoom({
				roomCode: input.roomCode,
				username: input.username,
				userId,
			});
			ctx.log.info({ roomCode: input.roomCode, userId }, "Joining room");

			const users = await getRoomUsers(input.roomCode);

			await publishRoomUpdate(input.roomCode, "join", {
				users,
			});
			ctx.log.info({ events: "join", users }, "Publishing room update");

			for await (const data of iterator) {
				yield JSON.parse(data.message) as { users: string[] };
				ctx.log.info(data, "Consuming room update");
			}
		} finally {
			await leaveRoom({
				roomCode: input.roomCode,
				userId,
			});
			ctx.log.info({ roomCode: input.roomCode, userId }, "Leaving room");

			const users = await getRoomUsers(input.roomCode);

			ctx.log.info({ event: "leave", users }, "Publishing room update");
			await publishRoomUpdate(input.roomCode, "leave", {
				users,
			});

			await subscriber.unsubscribe();
			subscriber.disconnect();
		}
	});
