import { t } from "../utils/trpc.js";
import { procedure as mutationAuthenticate } from "./authenticate.js";
import { procedure as queryRoom } from "./room.js";
import { procedure as subscriptionRoomConnections } from "./room-connections.js";
import { procedure as subscriptionRoomCountryStatuses } from "./room-country-statuses.js";
import { procedure as mutationRoomCreate } from "./room-create.js";
import { procedure as queryUser } from "./user.js";
import { procedure as mutationUserMessage } from "./user-message.js";
import { procedure as subscriptionUserMessages } from "./user-messages.js";

export const appRouter = t.router({
	subscriptionRoomCountryStatuses,
	subscriptionRoomConnections,
	subscriptionUserMessages,
	mutationAuthenticate,
	mutationRoomCreate,
	mutationUserMessage,
	queryRoom,
	queryUser,
});

export type AppRouter = typeof appRouter;
