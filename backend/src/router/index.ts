import { t } from "../utils/trpc.js";
import { procedure as mutationGameSettings } from "./mutation-game-settings.js";
import { procedure as mutationGameStart } from "./mutation-game-start.js";
import { procedure as mutationRoomCreate } from "./mutation-room-create.js";
import { procedure as mutationUserAuthenticate } from "./mutation-user-authenticate.js";
import { procedure as mutationUserMessage } from "./mutation-user-message.js";
import { procedure as queryCountriesFound } from "./query-countries-found.js";
import { procedure as queryRoom } from "./query-room.js";
import { procedure as queryUser } from "./query-user.js";
import { procedure as subscriptionGameSettings } from "./subscription-game-settings.js";
import { procedure as subscriptionGameStatuses } from "./subscription-game-statuses.js";
import { procedure as subscriptionRoomConnections } from "./subscription-room-connections.js";
import { procedure as subscriptionUserMessages } from "./subscription-user-messages.js";

export const appRouter = t.router({
	subscriptionGameSettings,
	subscriptionGameStatuses,
	subscriptionRoomConnections,
	subscriptionUserMessages,
	queryCountriesFound,
	mutationGameSettings,
	mutationGameStart,
	mutationRoomCreate,
	mutationUserMessage,
	mutationUserAuthenticate,
	queryRoom,
	queryUser,
});

export type AppRouter = typeof appRouter;
