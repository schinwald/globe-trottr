import { createRoom } from "../utils/redis-schema.js";
import { t } from "../utils/trpc.js";

export const procedure = t.procedure.mutation(async ({ ctx }) => {
	ctx.log.info("Creating room");
	const roomCode = await createRoom();
	ctx.log.info({ roomCode }, "Room created");
	return { roomCode };
});
