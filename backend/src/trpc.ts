import { initTRPC } from "@trpc/server";
import { z } from "zod";
import redis from "./redis.js";
import {
	createRoom,
	createSubscriberIterator,
	joinRoom,
	leaveRoom,
	publishRoomUpdate,
	ROOM_UPDATES_CHANNEL,
} from "./redis-schema.js";

const t = initTRPC.create();

export const appRouter = t.router({
	createRoom: t.procedure
		.input(z.object({ hostName: z.string() }))
		.mutation(async ({ input }) => {
			const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
			const hostId = Math.random().toString(36).substring(2, 8);
			const result = await createRoom(roomCode, hostId, input.hostName);
			await publishRoomUpdate(roomCode, "room-created", {
				roomCode,
				username: input.hostName,
				userId: hostId,
			});
			return result;
		}),
	joinRoom: t.procedure
		.input(z.object({ roomCode: z.string(), username: z.string() }))
		.mutation(async ({ input }) => {
			const userId = Math.random().toString(36).substring(2, 8);
			const result = await joinRoom(input.roomCode, userId, input.username);
			await publishRoomUpdate(input.roomCode, "join", {
				roomCode: input.roomCode,
				username: input.username,
				userId,
			});
			return result;
		}),
	leaveRoom: t.procedure
		.input(z.object({ roomCode: z.string(), userId: z.string() }))
		.mutation(async ({ input }) => {
			const result = await leaveRoom(input.roomCode, input.userId);
			await publishRoomUpdate(input.roomCode, "leave", {
				roomCode: input.roomCode,
				userId: input.userId,
			});
			return result;
		}),
	roomUpdates: t.procedure
		.input(z.object({ roomCode: z.string() }))
		.subscription(async function* ({ input, signal }) {
			const subscriber = redis.duplicate();
			await subscriber.subscribe(ROOM_UPDATES_CHANNEL(input.roomCode));

			try {
				for await (const { message } of await createSubscriberIterator(
					subscriber,
				)) {
					if (signal?.aborted) break;
					const data = JSON.parse(message);
					if (data.event === "join" || data.event === "leave") {
						yield data;
					}
				}
			} finally {
				await subscriber.unsubscribe();
				subscriber.disconnect();
			}
		}),
});

export type AppRouter = typeof appRouter;
