import React from 'react';
import { Heart, Wind, Droplets, Thermometer } from 'lucide-react';
import { WeatherData } from '../../types';
import { useWeather } from '../../context/WeatherContext';
import { useAuth } from '../../context/AuthContext';
import WeatherIcon from './WeatherIcon';

interface WeatherCardProps {
  weatherData: WeatherData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weatherData }) => {
  const { favoriteLocations, addToFavorites, removeFromFavorites } = useWeather();
  const { isAuthenticated } = useAuth();
  
  const isFavorite = favoriteLocations.some(city => city.id === weatherData.id);
  
  const handleFavoriteToggle = () => {
    if (isFavorite) {
      removeFromFavorites(weatherData.id);
    } else {
      addToFavorites({
        id: weatherData.id,
        name: weatherData.name,
        country: weatherData.sys.country
      });
    }
  };
  
  // Format date
  const currentDate = new Date(weatherData.dt * 1000).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Get the main weather data
  const mainWeather = weatherData.weather[0];
  
  // Convert temperature to Celsius and round to one decimal place
  const temp = Math.round(weatherData.main.temp);
  const feelsLike = Math.round(weatherData.main.feels_like);
  
  // Background color based on temperature
  const getBgColor = (temp: number) => {
    if (temp >= 30) return 'from-orange-500 to-red-600';
    if (temp >= 20) return 'from-yellow-400 to-orange-500';
    if (temp >= 10) return 'from-blue-300 to-green-400';
    return 'from-blue-500 to-blue-700';
  };
  
  return (
    <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-lg transition-all duration-300 transform hover:shadow-xl bg-gradient-to-br dark:from-gray-800 dark:to-gray-900">
      {/* Header with city info */}
      <div className={`p-6 bg-gradient-to-r ${getBgColor(temp)} text-white`}>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold">{weatherData.name}</h2>
            <p className="text-sm opacity-90">{weatherData.sys.country}</p>
            <p className="text-sm mt-1 opacity-80">{currentDate}</p>
          </div>
          <div className="flex items-center">
            <WeatherIcon iconCode={mainWeather.icon} size={56} />
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-end">
          <div>
            <p className="text-5xl font-bold">{temp}°C</p>
            <p className="text-sm opacity-90">Feels like {feelsLike}°C</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold capitalize">{mainWeather.description}</p>
          </div>
        </div>
      </div>
      
      {/* Details section */}
      <div className="bg-white dark:bg-gray-800 p-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <Wind className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Wind</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">
                {weatherData.wind.speed} m/s
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Droplets className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Humidity</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">
                {weatherData.main.humidity}%
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Thermometer className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Min/Max</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">
                {Math.round(weatherData.main.temp_min)}°/{Math.round(weatherData.main.temp_max)}°
              </p>
            </div>
          </div>
          
          {isAuthenticated && (
            <div className="flex items-center">
              <button
                onClick={handleFavoriteToggle}
                className={`flex items-center justify-center p-2 rounded-full transition-colors ${
                  isFavorite
                    ? 'text-red-500 hover:text-red-600'
                    : 'text-gray-400 hover:text-red-500'
                }`}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                <span className="ml-1 text-sm">
                  {isFavorite ? 'Saved' : 'Save'}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;