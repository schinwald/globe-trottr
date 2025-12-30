import { TRPCError } from "@trpc/server";
import { Repository, Schema } from "redis-om";
import { CONSTANTS } from "../../../constants.js";
import redis, { type Redis } from "../../setup.js";
import type { Game } from "./types.js";

const schema = new Schema("game", {
	roomCode: { type: "string" },
	settingsDuration: { type: "number" },
	settingsDelay: { type: "number" },
	settingsMaxPlayers: { type: "number" },
	startedAt: { type: "date" },
});

class GameRepository extends Repository<Game> {
	constructor(schema: Schema<Game>, redis: Redis) {
		super(schema, redis);
	}

	async init(roomCode: string) {
		return this.save({
			roomCode,
			settingsDuration: CONSTANTS.DEFAULT_DURATION,
			settingsDelay: CONSTANTS.DEFAULT_DELAY,
			settingsMaxPlayers: CONSTANTS.MAX_PLAYERS,
			startedAt: null,
		});
	}

	async start(roomCode: string) {
		const game = await this.search()
			.where("roomCode")
			.equals(roomCode)
			.returnFirst();

		if (!game) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: "Game not found",
			});
		}

		const latency = 2000;
		game.startedAt = new Date(Date.now() + latency);
		return this.save(game);
	}
}

export const gameRepository = new GameRepository(schema, redis);

redis.on("connect", async () => {
	await gameRepository.createIndex();
});
