import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { getEvents, roomEmitter } from "./events.js";

const t = initTRPC.create();

type Room = {
	code: string;
	users: Record<string, string>; // userId to name
};

const rooms: Record<string, Room> = {};

export const appRouter = t.router({
	createRoom: t.procedure
		.input(z.object({ hostName: z.string() }))
		.mutation(({ input }) => {
			const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
			const hostId = Math.random().toString(36).substring(2, 8);
			rooms[roomCode] = { code: roomCode, users: { [hostId]: input.hostName } };
			return { roomCode, users: [input.hostName] };
		}),
	joinRoom: t.procedure
		.input(z.object({ roomCode: z.string(), username: z.string() }))
		.mutation(({ input }) => {
			if (!rooms[input.roomCode]) throw new Error("Room not found");
			const userId = Math.random().toString(36).substring(2, 8);

			rooms[input.roomCode].users[userId] = input.username;
			const users = Object.values(rooms[input.roomCode].users);

			roomEmitter.emit("join", {
				roomCode: input.roomCode,
				username: input.username,
				userId,
			});

			return { userId, users };
		}),
	leaveRoom: t.procedure
		.input(z.object({ roomCode: z.string(), userId: z.string() }))
		.mutation(({ input }) => {
			if (!rooms[input.roomCode]) throw new Error("Room not found");
			if (!rooms[input.roomCode].users[input.userId]) throw new Error("User not in room");

			delete rooms[input.roomCode].users[input.userId];
			const users = Object.values(rooms[input.roomCode].users);

			roomEmitter.emit("leave", {
				roomCode: input.roomCode,
				userId: input.userId,
			});

			return { users };
		}),
	roomUpdates: t.procedure
		.input(z.object({ roomCode: z.string() }))
		.subscription(async function* ({ input, signal }) {
			for await (const data of getEvents(roomEmitter, "join", { signal })) {
				if (input.roomCode === data.roomCode) {
					yield data;
				}
			}
		}),
});

export type AppRouter = typeof appRouter;
