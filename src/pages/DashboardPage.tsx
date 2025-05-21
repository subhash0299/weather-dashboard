import React, { useEffect, useState } from 'react';
import { useWeather } from '../context/WeatherContext';
import SearchBar from '../components/weather/SearchBar';
import WeatherCard from '../components/weather/WeatherCard';
import ForecastCard from '../components/weather/ForecastCard';
import { Loader } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { currentWeather, forecast, isLoading, error, getWeatherForCity } = useWeather();
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (initialLoad) {
      getWeatherForCity('London');
      setInitialLoad(false);
    }
  }, [initialLoad, getWeatherForCity]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Weather Dashboard
          </h1>
          <SearchBar />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader className="h-10 w-10 text-purple-600 dark:text-purple-400 animate-spin" />
            <span className="ml-3 text-lg text-gray-600 dark:text-gray-300">Loading weather data...</span>
          </div>
        ) : error ? (
          <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-lg">
            {error}
          </div>
        ) : (
          <>
            {currentWeather && (
              <div className="mb-8 flex justify-center">
                <WeatherCard weatherData={currentWeather} />
              </div>
            )}

            {forecast && (
              <div className="mt-12">
                <ForecastCard forecastData={forecast} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;