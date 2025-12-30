import {
	type DescMessage,
	fromBinary,
	type MessageShape,
} from "@globe-trottr/shared/utils/protobuf.js";
import type { Channel } from "./channels.js";
import redis from "./setup.js";

const encoder = new TextEncoder();

export const subscribe = async <M extends DescMessage>(
	channel: Channel<M>,
	options?: { signal?: AbortSignal },
) => {
	const { iterator, callback } = await createSubscriberIterator({
		schema: channel.schema,
		signal: options?.signal,
	});

	const subscriber = redis.duplicate();
	await subscriber.connect();
	await subscriber.subscribe(channel.key, callback);

	return {
		subscriber,
		iterator,
	};
};

type IteratorOptions<T extends DescMessage> = {
	schema: T;
	signal?: AbortSignal;
};

// Create an async iterator for a Redis subscriber
export const createSubscriberIterator = async <T extends DescMessage>(
	option: IteratorOptions<T>,
) => {
	const queue: MessageShape<T>[] = [];
	let resolver: Function | null = null;
	let isAborted = false;

	option.signal?.addEventListener("abort", () => {
		isAborted = true;
		if (resolver) {
			resolver();
			resolver = null;
		}
	});

	const callback = (message: string) => {
		const buffer = Buffer.from(message, "base64");
		const binary = new Uint8Array(buffer);
		const data = fromBinary(option.schema, binary);
		queue.push(data);

		// Let iterator know that there is more data
		if (resolver) {
			resolver();
			resolver = null;
		}
	};

	const iterator = {
		async *[Symbol.asyncIterator]() {
			while (true) {
				// When there is no data, wait for the next message
				if (queue.length === 0) {
					await new Promise((resolve) => (resolver = resolve));
				}

				if (isAborted) {
					break;
				}

				yield queue.shift() as MessageShape<T>;
			}
		},
	};

	return {
		iterator,
		callback,
	};
};
