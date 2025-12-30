import { type Country, countries } from "./countries";

// Checking if a game is won
export const checkIsGameWon = (countriesFound: Country[]) => {
	if (countriesFound.length === countries.length) return true;
	return false;
};

type Resources = {
	startedAt: Date | null;
	delay: number;
	duration: number;
	countriesFound: Country[];
};

// Derive the state of the game
export const deriveGameState = (resources: Resources) => {
	const { startedAt, delay, duration, countriesFound } = resources;

	const isGameWon = checkIsGameWon(countriesFound);

	if (!startedAt) return "default";
	if (isGameWon) return "won";

	const currentTime = Date.now();
	const activeTime = startedAt.getTime() + delay;
	const endTime = activeTime + duration;

	if (currentTime < activeTime) return "counting-down";
	if (currentTime <= endTime) return "in-progress";
	return "timed-out";
};

export type GameState = ReturnType<typeof deriveGameState>;
