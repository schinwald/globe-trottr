export type RoomUser = {
	roomCode: string;
	userId: string;
	role: "host" | "guest";
	connections: number;
};
