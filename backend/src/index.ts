import websocket, { type WebSocket } from "@fastify/websocket";
// Import the framework and instantiate it
import Fastify from "fastify";
import { P, match } from "ts-pattern";
import { v4 as uuid } from "uuid";

const fastify = Fastify({
	logger: true,
});

fastify.register(websocket);

type Room = {
	code: string;
	users: Record<string, User>;
};

type User = {
	socket: WebSocket;
	role: "host" | "guest";
	id: string;
	room?: Room;
};

// TODO: udpate this with better persistence
const rooms: Record<string, Room> = {};

const room = {
	create: (user: User) => {
		// Generate a room code and create the room
		while (true) {
			const roomCode = uuid();
			if (!rooms[roomCode]) {
				rooms[roomCode] = {
					code: roomCode,
					users: {
						[user.id]: user,
					},
				};
				user.room = rooms[roomCode];
				return {
					roomCode,
				};
			}
		}
	},
	join: (roomCode: string, user: User) => {
		if (!rooms[roomCode]) return false;
		if (rooms[roomCode].users[user.id]) return false;

		// Add the user to the room
		rooms[roomCode].users[user.id] = user;
		user.room = rooms[roomCode];
		return true;
	},
	leave: (roomCode: string, user: User) => {
		if (!rooms[roomCode]) return false;
		if (rooms[roomCode].users[user.id]) return false;

		// Remove the user from the room
		delete rooms[roomCode].users[user.id];
		user.room = undefined;

		// Delete the room if there are no more users in it
		if (Object.keys(rooms[roomCode].users).length === 0) {
			delete rooms[roomCode];
		}

		return true;
	},
};

fastify.register(async (fastify) => {
  fastify.get("/websocket", { websocket: true }, (socket, req) => {
    const userId = uuid();
    const { roomCode } = room.create({ socket, id: userId, role: "host" });
    socket.send(
      JSON.stringify({
        type: "room-created",
        data: {
          roomCode,
          users: [userId],
        },
      }),
    );

		const message = (callback: (data: any) => void) => {
			return (data: any) => {
				const newData = JSON.parse(data.toString("utf-8"));
				return callback(newData);
			};
		};

		socket.on(
			"message",
			message((message) => {
				match(message)
					.with(
						{ intent: "join-room", data: P.any },
						({ data }: { data: any }) => {
							const isJoined = room.join(data.roomCode, {
								socket,
								role: "guest",
								id: data.user.name,
							});

							if (!isJoined) return socket.send(JSON.stringify({ error: "Did not join the room" }));

							const userList = Object.keys(rooms[data.roomCode].users);
							for (const user of Object.values(rooms[data.roomCode].users)) {
								user.socket.send(JSON.stringify({ type: "user-joined", user: data.user.name, users: userList }));
							}
						},
					)
					.otherwise(() => {
						console.log(message);
						socket.send("Unexpected message");
					});
			}),
		);

		socket.on("close", (data) => {});
	});
});

// Declare a route
fastify.get("/", async function handler(request, reply) {
	return { hello: "world" };
});

// Run the server!
try {
	await fastify.listen({ port: 5000 });
} catch (err) {
	fastify.log.error(err);
	process.exit(1);
}
