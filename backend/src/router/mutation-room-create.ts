import { gameRepository, roomRepository } from "../utils/redis/models/index.js";
import { procedure } from "../utils/trpc.js";

export const p = procedure.mutation(async ({ ctx }) => {
	ctx.log.info("Creating room");
	const room = await roomRepository.init();
	await gameRepository.init(room.roomCode);
	ctx.log.info(room, "Room created");
	return room;
});
