import z from "zod";
import { gameCountriesFoundRepository } from "../utils/redis/models/index.js";
import { procedure } from "../utils/trpc.js";

export const p = procedure
	.input(z.object({ roomCode: z.string() }))
	.query(async ({ input }) => {
		const countriesFound = await gameCountriesFoundRepository
			.search()
			.where("roomCode")
			.equals(input.roomCode)
			.returnAll();

		return countriesFound;
	});
