import { Repository, Schema } from "redis-om";
import redis, { type Redis } from "../../setup.js";
import type { GameCountriesFound } from "./types.js";

const schema = new Schema<GameCountriesFound>("game_countries_found", {
	roomCode: { type: "string" },
	userId: { type: "string" },
	countryId: { type: "string" },
	timestamp: { type: "date" },
});

class GameCountriesFoundRepository extends Repository<GameCountriesFound> {
	constructor(schema: Schema<GameCountriesFound>, redis: Redis) {
		super(schema, redis);
	}
}

export const gameCountriesFoundRepository = new GameCountriesFoundRepository(
	schema,
	redis,
);

redis.on("connect", async () => {
	await gameCountriesFoundRepository.createIndex();
});
