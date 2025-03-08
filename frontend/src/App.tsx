import { Globe } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import FriendsPanel from "./components/FriendsPanel";
import GameControls from "./components/GameControls";
import GameModeSelector from "./components/GameMode";
import GameOptions from "./components/GameOptions";
import GameStats from "./components/GameStats";
import WorldMap from "./components/WorldMap";
import { countries as countriesData } from "./data/countries";
import type { Friend, GameSettings, GameState } from "./types";
import { getHintForRandomCountry } from "./utils/hints";

const DEFAULT_GAME_TIME = 300; // 5 minutes in seconds

// Mock friends data for demonstration
const mockFriends: Friend[] = [
	{ id: "1", name: "Alex", online: true, score: 15 },
	{ id: "2", name: "Taylor", online: true, score: 8 },
	{ id: "3", name: "Jordan", online: false },
];

function normalizeCountryName(inputString: string) {
	const mappings: Record<string, string> = {
		ã: "a",
		é: "e",
		í: "i",
		ô: "o",
	};

	// Iterate over each character in the input string
	return Array.from(inputString.toLowerCase())
		.map((char) => {
			// Replace the character if it exists in the mappings object
			return mappings[char] || char;
		})
		.join("")
		.replaceAll(/[\-' ]/g, "");
}

function App() {
	const [settings, setSettings] = useState<GameSettings>({
		type: undefined,
		mode: undefined,
	});
	const [gameState, setGameState] = useState<GameState>({
		timeLeft: DEFAULT_GAME_TIME,
		gameStarted: false,
		gameOver: false,
		score: 0,
		totalCountries: countriesData.length,
		hintsUsed: 0,
		currentHint: null,
		countries: countriesData.map((country) => ({
			...country,
			guessed: true,
		})),
		guessedCountry: null,
		gameOptions: {
			timeLimit: DEFAULT_GAME_TIME,
			continentFilter: [],
			searchAccuracy: "fuzzy",
			maxHints: 3,
		},
		friends: [],
		notifications: [],
	});

	const startGame = useCallback(() => {
		setGameState((prev) => ({
			...prev,
			gameStarted: true,
			gameOver: false,
			timeLeft: DEFAULT_GAME_TIME,
			score: 0,
			hintsUsed: 0,
			currentHint: null,
			countries: countriesData.map((country) => ({
				...country,
				guessed: false,
			})),
			gameOptions: {
				timeLimit: DEFAULT_GAME_TIME,
				continentFilter: [],
				searchAccuracy: "fuzzy",
				maxHints: 3,
			},
			friends: mockFriends,
			notifications: [],
		}));
	}, []);

	// Update game options
	const handleOptionsChange = useCallback(
		(options: GameState["gameOptions"]) => {
			setGameState((prev) => ({
				...prev,
				gameOptions: options,
				timeLeft: options.timeLimit,
			}));
		},
		[],
	);

	const restartGame = useCallback(() => {
		startGame();
	}, [startGame]);

	const handleGuess = (guess: string) => {
		const normalizedGuess = normalizeCountryName(guess);
		const guessedCountry = gameState.countries.find((country) => {
			if (
				normalizeCountryName(country.name) === normalizedGuess &&
				!country.guessed
			) {
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
	};

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
					<div className="col-span-3">
						{!gameState.gameStarted && !gameState.gameOver ? (
							<div className="flex flex-col h-full gap-4">
								<GameModeSelector
									settings={settings}
									setSettings={setSettings}
									options={gameState.gameOptions}
									onOptionsChange={handleOptionsChange}
								/>
								<FriendsPanel friends={gameState.friends} />
							</div>
						) : (
							<div>
								<FriendsPanel friends={gameState.friends} />
								<GameControls
									onGuess={handleGuess}
									onRequestHint={requestHint}
									gameStarted={gameState.gameStarted}
									gameOver={gameState.gameOver}
									hintsUsed={gameState.hintsUsed}
									maxHints={gameState.gameOptions.maxHints}
									score={gameState.score}
									totalCountries={gameState.totalCountries}
									countries={gameState.countries}
									currentHint={gameState.currentHint}
								/>
							</div>
						)}
					</div>
					<div className="bg-white rounded-xl shadow-md overflow-hidden col-span-6">
						<WorldMap
							guessedCountry={gameState.guessedCountry}
							countries={gameState.countries}
							score={gameState.score}
							totalCountries={gameState.totalCountries}
							timeLeft={gameState.timeLeft}
							gameStarted={gameState.gameStarted}
							gameOver={gameState.gameOver}
							onStartGame={startGame}
							onRestartGame={restartGame}
						/>
					</div>
					<div className="col-span-3">
						<GameStats
							countries={gameState.countries}
							score={gameState.score}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
