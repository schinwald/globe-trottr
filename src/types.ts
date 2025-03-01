export interface Country {
	id: string;
	name: string;
	iso: string;
	guessed: boolean;
}

export interface GameState {
	countries: Country[];
	timeLeft: number;
	gameStarted: boolean;
	gameOver: boolean;
	score: number;
	totalCountries: number;
	hintsUsed: number;
	currentHint: string | null;
	guessedCountry: Country | null;
}

