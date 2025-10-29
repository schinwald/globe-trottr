import { t } from "../utils/trpc.js";
import { procedure as mutationAuthenticate } from "./authenticate.js";
import { procedure as subscriptionCountryGuesses } from "./country-guesses.js";
import { procedure as queryRoom } from "./room.js";
import { procedure as subscriptionRoomConnections } from "./room-connections.js";
import { procedure as mutationRoomCreate } from "./room-create.js";
import { procedure as subscriptionRoomUpdates } from "./room-updates.js";
import { procedure as queryUser } from "./user.js";
import { procedure as mutationUserGuessCountry } from "./user-guess-country.js";

export const appRouter = t.router({
	subscriptionCountryGuesses,
	subscriptionRoomUpdates,
	subscriptionRoomConnections,
	mutationRoomCreate,
	mutationUserGuessCountry,
	mutationAuthenticate,
	queryRoom,
	queryUser,
});

export type AppRouter = typeof appRouter;
