import { Globe } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import GameControls from "./components/GameControls";
import GameStats from "./components/GameStats";
import WorldMap from "./components/WorldMap";
import { countries as countriesData } from "./data/countries";
import type { GameState } from "./types";
import { getHintForRandomCountry } from "./utils/hints";

const GAME_TIME = 300; // 5 minutes in seconds

function App() {
	const [gameState, setGameState] = useState<GameState>({
		countries: countriesData,
		timeLeft: GAME_TIME,
		gameStarted: false,
		gameOver: false,
		score: 0,
		totalCountries: countriesData.length,
		hintsUsed: 0,
		currentHint: null,
		guessedCountry: null,
	});

	const startGame = useCallback(() => {
		setGameState((prev) => ({
			...prev,
			gameStarted: true,
			gameOver: false,
			timeLeft: GAME_TIME,
			score: 0,
			hintsUsed: 0,
			currentHint: null,
			countries: countriesData.map((country) => ({
				...country,
				guessed: false,
			})),
		}));
	}, []);

	const restartGame = useCallback(() => {
		startGame();
	}, [startGame]);

	const handleGuess = useCallback((guess: string) => {
		const normalizedGuess = guess.trim().toLowerCase();
		const guessedCountry = gameState.countries.find((country) => {
			if (country.name.toLowerCase() === normalizedGuess && !country.guessed) {
				return true;
			}
		});

		setGameState((prev) => {
			const updatedCountries = prev.countries.map((country) => {
				if (country.id === guessedCountry?.id)
					return { ...country, guessed: true };
				return country;
			});

			const newScore = updatedCountries.filter((c) => c.guessed).length;

			return {
				...prev,
				countries: updatedCountries,
				guessedCountry: guessedCountry,
				score: newScore,
			};
		});
	}, []);

	const requestHint = useCallback(() => {
		setGameState((prev) => {
			const hint = getHintForRandomCountry(prev.countries);
			return {
				...prev,
				hintsUsed: prev.hintsUsed + 1,
				currentHint: hint,
			};
		});
	}, []);

	// Timer effect
	useEffect(() => {
		let timer: number | undefined;

		console.log(gameState);

		if (
			gameState.gameStarted &&
			!gameState.gameOver &&
			gameState.timeLeft > 0
		) {
			timer = window.setInterval(() => {
				setGameState((prev) => {
					const newTimeLeft = prev.timeLeft - 1;
					if (newTimeLeft <= 0) {
						clearInterval(timer);
						return { ...prev, timeLeft: 0, gameOver: true };
					}
					return { ...prev, timeLeft: newTimeLeft };
				});
			}, 1000);
		}

		return () => {
			if (timer) clearInterval(timer);
		};
	}, [gameState.gameStarted, gameState.gameOver, gameState.timeLeft]);

	// For testing - mark some countries as guessed
	useEffect(() => {
		if (!gameState.gameStarted) {
			const testCountries = gameState.countries.map((country, index) => {
				// Mark a few countries as guessed for testing the map display
				if (index % 10 === 0) {
					return { ...country, guessed: true };
				}
				return country;
			});

			setGameState((prev) => ({
				...prev,
				countries: testCountries,
				score: testCountries.filter((c) => c.guessed).length,
			}));
		}
	}, []);

	return (
		<div className="min-h-screen bg-gray-50 py-8 px-4">
			<div className="max-w-6xl mx-auto">
				<header className="text-center mb-8">
					<h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center justify-center">
						<Globe className="mr-3 text-blue-600" size={32} />
						World-Wide Wonders
					</h1>
					<p className="text-gray-600 mt-2">
						Guess as many countries as you can before the timer runs out!
					</p>
				</header>

				<div className="grid grid-cols-12 max-w-screen-2xl gap-6">
					<div className="bg-white rounded-xl shadow-md overflow-hidden col-span-6">
						<WorldMap
							guessedCountry={gameState.guessedCountry}
							countries={gameState.countries}
							score={gameState.score}
							totalCountries={gameState.totalCountries}
							timeLeft={gameState.timeLeft}
						/>
					</div>
					<div className="col-span-6">
						<GameControls
							onGuess={handleGuess}
							onStartGame={startGame}
							onRestartGame={restartGame}
							onRequestHint={requestHint}
							gameStarted={gameState.gameStarted}
							gameOver={gameState.gameOver}
							score={gameState.score}
							totalCountries={gameState.totalCountries}
							countries={gameState.countries}
							hintsUsed={gameState.hintsUsed}
							currentHint={gameState.currentHint}
						/>
						{(gameState.gameStarted || gameState.gameOver) && (
							<GameStats
								countries={gameState.countries}
								score={gameState.score}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
