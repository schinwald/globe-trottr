import { TRPCError } from "@trpc/server";
import z from "zod";
import { roomRepository } from "../utils/redis/models/index.js";
import { procedure } from "../utils/trpc.js";

export const p = procedure
	.input(z.object({ roomCode: z.string() }))
	.query(async ({ input }) => {
		const room = await roomRepository
			.search()
			.where("roomCode")
			.equals(input.roomCode)
			.returnFirst();

		if (!room) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "Room not found",
			});
		}

		return room;
	});
