import { EventEmitter, on } from "node:events";

type EventMap = Record<string, any[]>;
type Options = Parameters<typeof on>[2];

export const getEvents = <T extends EventMap, Event extends keyof T>(
	emitter: EventEmitter<T>,
	event: Event,
	options: Options,
) => {
	return on(
		emitter as EventEmitter,
		event as string,
		options,
	) as AsyncIterableIterator<T[Event][0]>;
};

type RoomEvents = {
	join: { roomCode: string; userId: string; username: string }[];
	leave: { roomCode: string; userId: string }[];
	message: { id: string; text: string }[];
};

export const roomEmitter = new EventEmitter<RoomEvents>();
