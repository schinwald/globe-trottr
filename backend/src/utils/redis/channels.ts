import type { DescMessage } from "@bufbuild/protobuf";
import { GameSettingsSchema } from "@globe-trottr/shared/types/proto/v1/messages/game_settings_pb.js";
import { GameStatusSchema } from "@globe-trottr/shared/types/proto/v1/messages/game_statuses_pb.js";
import { RoomConnectionsSchema } from "@globe-trottr/shared/types/proto/v1/messages/room_connections_pb.js";
import { UserMessageSchema } from "@globe-trottr/shared/types/proto/v1/messages/user_messages_pb.js";

export type Channel<T extends DescMessage> = {
	key: string;
	schema: T;
};

export const CHANNELS = {
	GAME_SETTINGS: (code: string) => ({
		key: `game:${code}:game:settings` as const,
		schema: GameSettingsSchema,
	}),
	GAME_STATUSES: (code: string) => ({
		key: `room:${code}:game:status` as const,
		schema: GameStatusSchema,
	}),
	ROOM_CONNECTIONS: (code: string) => ({
		key: `room:${code}:connections` as const,
		schema: RoomConnectionsSchema,
	}),
	USER_MESSAGES: (code: string) => ({
		key: `room:${code}:user:messages` as const,
		schema: UserMessageSchema,
	}),
};
