import { Play, RefreshCw, Timer } from "lucide-react";
import type React from "react";
import { useEffect, useRef } from "react";
import Globe from "react-globe.gl";
import pointsData from "../data/world.json";
import globeImageUrl from "../data/world.png";
import type { Country } from "../types";
import { cn } from "../utils/classname";

const countryPositions: Record<string, [number, number, number]> = {};
for (const feature of pointsData.features) {
	let count = 1;
	const average: [number, number, number] = [0, 0, 0];
	for (const islands of feature.geometry.coordinates) {
		for (const islandCoordinates of islands) {
			for (const islandCoordinate of islandCoordinates) {
				if (typeof islandCoordinate === "number") {
					const delta: [number, number] = [
						(islandCoordinates[0] - average[0]) / count,
						(islandCoordinates[1] - average[1]) / count,
					];
					average[0] += delta[0];
					average[1] += delta[1];
					count++;
					break;
				}

				const delta: [number, number] = [
					(islandCoordinate[0] - average[0]) / count,
					(islandCoordinate[1] - average[1]) / count,
				];
				average[0] += delta[0];
				average[1] += delta[1];
				count++;
			}
		}
	}
	countryPositions[feature.properties.ISO_A3] = average;
}

interface WorldMapProps {
	guessedCountry: Country | null;
	countries: Country[];
	score: number;
	totalCountries: number;
	timeLeft: number;
	gameOver: boolean;
	gameStarted: boolean;
	onStartGame: () => void;
	onRestartGame: () => void;
}

const WorldMap: React.FC<WorldMapProps> = ({
	guessedCountry,
	countries,
	score,
	totalCountries,
	timeLeft,
	gameOver,
	gameStarted,
	onStartGame,
	onRestartGame,
}) => {
	const globeRef = useRef();
	const guessed = countries
		.filter((country) => country.guessed)
		.reduce((accumulator: Record<string, Country>, current) => {
			if (accumulator) accumulator[current.iso] = current;
			return accumulator;
		}, {});

	useEffect(() => {
		if (!guessedCountry) return;
		if (!globeRef.current) return;
		const [lng, lat] = countryPositions[guessedCountry.iso];
		globeRef.current.pointOfView({ lat, lng }, 1000);
	}, [guessedCountry]);

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
	};

	return (
		<div className="grid h-[600px] w-full overflow-hidden justify-center">
			<div
				className={cn(
					"col-span-full row-span-full m-10 z-50 text-white flex flex-col items-center justify-between",
					{ "pointer-events-none": gameOver || gameStarted },
				)}
			>
				<div>
					{guessedCountry?.name ? (
						<span className="text-green-400">{guessedCountry.name}</span>
					) : (
						<span>Guess a country</span>
					)}
				</div>
				<div>
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
					) : null}
				</div>
				<div className="flex justify-between items-center mb-4 w-full px-10">
					<div className="flex items-center">
						<Timer className="mr-2 text-blue-600" size={20} />
						<span className="text-xl font-bold">{formatTime(timeLeft)}</span>
					</div>
					<div className="text-xl font-bold">
						{score} / {totalCountries}
					</div>
				</div>
			</div>
			<div className="col-span-full row-span-full">
				<Globe
					ref={globeRef}
					height={600}
					width={600}
					globeImageUrl={globeImageUrl}
					polygonsData={pointsData.features}
					polygonSideColor={({ properties: d }) => {
						if (guessed[d.ISO_A3]) return "#0e0";
						return "#eee";
					}}
					polygonStrokeColor={({ properties: d }) => {
						if (guessed[d.ISO_A3]) return "#0c0";
						return "#aaa";
					}}
					polygonCapColor={({ properties: d }) => {
						if (guessed[d.ISO_A3]) return "#0f0";
						return "#ffffff";
					}}
					polygonLabel={({ properties: d }) => `
          <b>${d.ADMIN}</b>
        `}
					polygonAltitude={0.01}
					backgroundColor={"#1b2436"}
				/>
			</div>
		</div>
	);
};

export default WorldMap;
