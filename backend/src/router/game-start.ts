import z from "zod";
import { publishGameStatus, startGame } from "../utils/redis-schema.js";
import { t } from "../utils/trpc.js";

export const procedure = t.procedure
	.input(
		z.object({
			roomCode: z.string(),
		}),
	)
	.mutation(async ({ input, ctx }) => {
		const startedAt = await startGame({ roomCode: input.roomCode });
		ctx.log.info({ roomCode: input.roomCode }, "Game started");

		await publishGameStatus(input.roomCode, "started", {
			startedAt,
		});
		ctx.log.info({ startedAt }, "Publishing game started");
	});
