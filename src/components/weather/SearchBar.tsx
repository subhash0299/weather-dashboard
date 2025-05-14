import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';

const SearchBar: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const { searchCity, isLoading, error } = useWeather();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      searchCity(searchValue.trim());
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search for a city..."
            className="w-full py-3 pl-4 pr-12 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition duration-200"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
            disabled={isLoading || !searchValue.trim()}
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
        {error && (
          <p className="text-red-500 text-sm mt-1 ml-1">{error}</p>
        )}
      </form>
    </div>
  );
};

export default SearchBar;