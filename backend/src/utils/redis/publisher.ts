import {
	create,
	type DescMessage,
	type MessageInitShape,
	toBinary,
} from "@globe-trottr/shared/utils/protobuf.js";
import type { Channel } from "./channels.js";
import redis from "./setup.js";

export const publish = async <T extends DescMessage>(
	channel: Channel<T>,
	data: MessageInitShape<T>,
) => {
	const protobuf = create(channel.schema, data);
	const binary = toBinary(channel.schema, protobuf);
	const buffer = Buffer.from(binary);
	const message = buffer.toString("base64");
	return redis.publish(channel.key, message);
};
