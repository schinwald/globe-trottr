import { gameRepository, roomRepository } from "../utils/redis/models/index.js";
import { t } from "../utils/trpc.js";

export const procedure = t.procedure.mutation(async ({ ctx }) => {
	ctx.log.info("Creating room");
	const room = await roomRepository.init();
	await gameRepository.init(room.roomCode);
	ctx.log.info(room, "Room created");
	return room;
});
