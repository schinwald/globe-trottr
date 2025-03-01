import { HelpCircle, Play, RefreshCw } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import type { Country } from "../types";

interface GameControlsProps {
	onGuess: (guess: string) => void;
	onStartGame: () => void;
	onRestartGame: () => void;
	onRequestHint: () => void;
	gameStarted: boolean;
	gameOver: boolean;
	score: number;
	totalCountries: number;
	countries: Country[];
	hintsUsed: number;
	currentHint: string | null;
}

const GameControls: React.FC<GameControlsProps> = ({
	onGuess,
	onStartGame,
	onRestartGame,
	onRequestHint,
	gameStarted,
	gameOver,
	score,
	totalCountries,
	countries,
	hintsUsed,
	currentHint,
}) => {
	const [guess, setGuess] = useState("");
	const [recentGuesses, setRecentGuesses] = useState<string[]>([]);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (gameStarted && !gameOver && inputRef.current) {
			inputRef.current.focus();
		}
	}, [gameStarted, gameOver]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!guess.trim() || !gameStarted || gameOver) return;

		onGuess(guess);

		// Add to recent guesses
		setRecentGuesses((prev) => {
			const newGuesses = [guess, ...prev];
			return newGuesses.slice(0, 5); // Keep only the 5 most recent guesses
		});

		setGuess("");
	};

	return (
		<div className="w-full mx-auto">
			{!gameStarted && !gameOver ? (
				<button
					onClick={onStartGame}
					className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-lg hover:bg-blue-700 transition-colors"
				>
					<Play className="mr-2" size={20} />
					Start Game
				</button>
			) : gameOver ? (
				<div className="text-center">
					<h2 className="text-2xl font-bold mb-4">Game Over!</h2>
					<p className="mb-4">
						You guessed {score} out of {totalCountries} countries.
					</p>
					<button
						onClick={onRestartGame}
						className="py-3 px-4 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-lg hover:bg-blue-700 transition-colors mx-auto"
					>
						<RefreshCw className="mr-2" size={20} />
						Play Again
					</button>
				</div>
			) : (
				<>
					<form onSubmit={handleSubmit} className="mb-4">
						<div className="relative">
							<input
								ref={inputRef}
								type="text"
								value={guess}
								onChange={(e) => setGuess(e.target.value)}
								placeholder="Enter a country name..."
								className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
								disabled={gameOver}
								autoComplete="off"
								list="country-suggestions"
							/>
							<datalist id="country-suggestions">
								{countries
									.filter((country) => !country.guessed)
									.map((country) => (
										<option key={country.id} value={country.name} />
									))}
							</datalist>
							<button
								type="submit"
								className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700 transition-colors"
								disabled={gameOver}
							>
								Guess
							</button>
						</div>
					</form>

					<div className="flex justify-between items-center mb-4">
						<button
							onClick={onRequestHint}
							className="flex items-center justify-center py-2 px-4 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
							disabled={gameOver}
						>
							<HelpCircle className="mr-2" size={16} />
							Get Hint ({hintsUsed})
						</button>
						<div className="text-sm text-gray-500">
							{totalCountries - score} countries left
						</div>
					</div>

					{currentHint && (
						<div className="bg-amber-50 border border-amber-200 p-3 rounded-lg mb-4">
							<p className="text-amber-800 font-medium">Hint: {currentHint}</p>
						</div>
					)}
				</>
			)}

			{gameStarted && !gameOver && recentGuesses.length > 0 && (
				<div className="mt-4">
					<h3 className="text-sm font-semibold text-gray-500 mb-1">
						Recent Guesses:
					</h3>
					<div className="flex flex-wrap gap-2">
						{recentGuesses.map((g, i) => (
							<span
								key={i}
								className="px-2 py-1 bg-gray-100 rounded-md text-sm"
							>
								{g}
							</span>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default GameControls;
