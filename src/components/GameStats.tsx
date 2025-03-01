import React from 'react';
import { Country } from '../types';
import { CheckCircle2 } from 'lucide-react';

interface GameStatsProps {
  countries: Country[];
  score: number;
}

const GameStats: React.FC<GameStatsProps> = ({ countries, score }) => {
  const guessedCountries = countries.filter(country => country.guessed);
  
  return (
    <div className="mt-6 bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <CheckCircle2 className="mr-2 text-green-500" size={20} />
        Guessed Countries ({score})
      </h2>
      
      {guessedCountries.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {guessedCountries.map(country => (
            <div key={country.id} className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
              {country.name}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">No countries guessed yet. Start typing to make your first guess!</p>
      )}
    </div>
  );
};

export default GameStats;