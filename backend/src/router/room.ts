import z from "zod";
import { getRoom } from "../utils/redis-schema.js";
import { t } from "../utils/trpc.js";

export const procedure = t.procedure
	.input(z.object({ roomCode: z.string() }))
	.query(async ({ input }) => {
		const room = await getRoom(input.roomCode);
		return { room };
	});
