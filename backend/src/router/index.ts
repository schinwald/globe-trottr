import { router } from "../utils/trpc.js";
import { p as mutationGameSettings } from "./mutation-game-settings.js";
import { p as mutationGameStart } from "./mutation-game-start.js";
import { p as mutationRoomCreate } from "./mutation-room-create.js";
import { p as mutationUserAuthenticate } from "./mutation-user-authenticate.js";
import { p as mutationUserMessage } from "./mutation-user-message.js";
import { p as queryCountriesFound } from "./query-countries-found.js";
import { p as queryMe } from "./query-me.js";
import { p as queryRoom } from "./query-room.js";
import { p as subscriptionGameSettings } from "./subscription-game-settings.js";
import { p as subscriptionGameStatuses } from "./subscription-game-statuses.js";
import { p as subscriptionRoomConnections } from "./subscription-room-connections.js";
import { p as subscriptionUserMessages } from "./subscription-user-messages.js";

export const appRouter = router({
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
	queryMe,
});

export type AppRouter = typeof appRouter;
