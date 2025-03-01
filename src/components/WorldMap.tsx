import { Timer } from "lucide-react";
import type React from "react";
import { useEffect, useRef } from "react";
import Globe from "react-globe.gl";
import pointsData from "../data/world.json";
import globeImageUrl from "../data/world.png";
import type { Country } from "../types";

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
}

const WorldMap: React.FC<WorldMapProps> = ({
	guessedCountry,
	countries,
	score,
	totalCountries,
	timeLeft,
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

	console.log(timeLeft);
	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
	};

	return (
		<div className="grid h-[600px] w-full overflow-hidden justify-center">
			<div className="col-span-full row-span-full m-10 z-50 text-white flex flex-col items-center justify-between pointer-events-none">
				<div>
					{guessedCountry?.name ? (
						<span className="text-green-400">{guessedCountry.name}</span>
					) : (
						<span>Guess a country</span>
					)}
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
