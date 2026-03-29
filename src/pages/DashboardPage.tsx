import React, { useEffect, useState, useMemo } from 'react';
import { useWeather } from '../context/WeatherContext';
import SearchBar from '../components/weather/SearchBar';
import WeatherCard from '../components/weather/WeatherCard';
import ForecastCard from '../components/weather/ForecastCard';
import HourlyForecast from '../components/weather/HourlyForecast';
import { Loader, RefreshCw } from 'lucide-react';
import { getPageBackgroundClasses } from '../utils/weatherTheme';
import { formatRelativeTime } from '../utils/formatRelativeTime';

const DashboardPage: React.FC = () => {
  const {
    currentWeather,
    forecast,
    isLoading,
    error,
    getWeatherForCity,
    refreshWeather,
    lastUpdated,
  } = useWeather();
  const [initialLoad, setInitialLoad] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (initialLoad) {
      getWeatherForCity('Delhi');
      setInitialLoad(false);
    }
  }, [initialLoad, getWeatherForCity]);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(id);
  }, []);

  const pageBg = useMemo(() => {
    if (!currentWeather?.weather[0]) {
      return 'from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900';
    }
    const w = currentWeather.weather[0];
    return getPageBackgroundClasses(w.main, w.icon);
  }, [currentWeather]);

  return (
    <div
      className={`min-h-[calc(100vh-64px)] bg-gradient-to-br ${pageBg} py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-500`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Weather Dashboard
            </h1>
            {lastUpdated != null && !isLoading && (
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-700 dark:text-gray-200">
                <span className="opacity-90" data-rerender={tick}>
                  Last updated: {formatRelativeTime(lastUpdated)}
                </span>
                <button
                  type="button"
                  onClick={() => refreshWeather()}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur px-4 py-2 font-medium text-gray-800 dark:text-gray-100 shadow-md border border-gray-200/80 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            )}
          </div>
          <SearchBar />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader className="h-10 w-10 text-purple-600 dark:text-purple-400 animate-spin" />
            <span className="ml-3 text-lg text-gray-600 dark:text-gray-300">
              Loading weather data...
            </span>
          </div>
        ) : error ? (
          <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-lg max-w-2xl mx-auto">
            {error}
          </div>
        ) : (
          <>
            {currentWeather && (
              <div className="mb-8 flex flex-col items-center gap-6">
                <WeatherCard weatherData={currentWeather} />
                {forecast && <HourlyForecast forecastData={forecast} />}
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
