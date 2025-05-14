import React from 'react';
import { ForecastData } from '../../types';
import WeatherIcon from './WeatherIcon';

interface ForecastCardProps {
  forecastData: ForecastData;
}

const ForecastCard: React.FC<ForecastCardProps> = ({ forecastData }) => {
  // Create a filtered list of forecast items (one per day)
  const dailyForecasts = forecastData.list.reduce((acc, item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
    if (!acc[date]) {
      acc[date] = item;
    }
    return acc;
  }, {} as Record<string, ForecastData['list'][0]>);

  // Convert to array and limit to 5 days
  const forecasts = Object.values(dailyForecasts).slice(0, 5);

  return (
    <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300">
      <div className="p-4 bg-blue-600 dark:bg-blue-800 text-white">
        <h3 className="text-lg font-semibold">5-Day Forecast</h3>
        <p className="text-sm opacity-80">{forecastData.city.name}, {forecastData.city.country}</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 dark:divide-gray-700">
        {forecasts.map((forecast, index) => {
          const date = new Date(forecast.dt * 1000);
          const day = date.toLocaleDateString('en-US', { weekday: 'short' });
          const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          const temp = Math.round(forecast.main.temp);
          const weather = forecast.weather[0];

          return (
            <div key={index} className="p-4 flex flex-col items-center justify-center">
              <p className="font-semibold text-gray-700 dark:text-gray-300">{day}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{formattedDate}</p>
              
              <WeatherIcon iconCode={weather.icon} size={40} className="my-2" />
              
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{temp}°C</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 capitalize">{weather.description}</p>
              
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex flex-col items-center">
                <p>Humidity: {forecast.main.humidity}%</p>
                <p>Wind: {forecast.wind.speed} m/s</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ForecastCard;