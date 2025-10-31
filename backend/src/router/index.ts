import { t } from "../utils/trpc.js";
import { procedure as subscriptionGameCountryStatuses } from "./game-country-statuses.js";
import { procedure as mutationGameStart } from "./game-start.js";
import { procedure as subscriptionGameStatuses } from "./game-statuses.js";
import { procedure as queryRoom } from "./room.js";
import { procedure as subscriptionRoomConnections } from "./room-connections.js";
import { procedure as mutationRoomCreate } from "./room-create.js";
import { procedure as queryUser } from "./user.js";
import { procedure as mutationUserAuthenticate } from "./user-authenticate.js";
import { procedure as mutationUserMessage } from "./user-message.js";
import { procedure as subscriptionUserMessages } from "./user-messages.js";

export const appRouter = t.router({
	subscriptionGameStatuses,
	subscriptionGameCountryStatuses,
	subscriptionRoomConnections,
	subscriptionUserMessages,
	mutationGameStart,
	mutationRoomCreate,
	mutationUserMessage,
	mutationUserAuthenticate,
	queryRoom,
	queryUser,
});

export type AppRouter = typeof appRouter;
