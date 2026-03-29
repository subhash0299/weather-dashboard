import React from 'react';
import { Heart, Wind, Droplets, Thermometer, Eye, Gauge, Cloud, Sunrise, Sunset } from 'lucide-react';
import { WeatherData } from '../../types';
import { useWeather } from '../../context/WeatherContext';
import { useAuth } from '../../context/AuthContext';
import { getCardHeroGradient } from '../../utils/weatherTheme';

interface WeatherCardProps {
  weatherData: WeatherData;
}

function formatLocalTime(unixUtc: number, timezoneOffsetSec: number): string {
  const ms = (unixUtc + timezoneOffsetSec) * 1000;
  return new Date(ms).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weatherData }) => {
  const { favoriteLocations, addToFavorites, removeFromFavorites, displayCityName } = useWeather();
  const { isAuthenticated } = useAuth();

  const cityTitle = displayCityName ?? weatherData.name;

  const isFavorite = favoriteLocations.some((city) => city.id === weatherData.id);

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      removeFromFavorites(weatherData.id);
    } else {
      addToFavorites({
        id: weatherData.id,
        name: cityTitle,
        country: weatherData.sys.country,
      });
    }
  };

  const currentDate = new Date(weatherData.dt * 1000).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const mainWeather = weatherData.weather[0];
  const iconUrl = `https://openweathermap.org/img/wn/${mainWeather.icon}@2x.png`;

  const temp = Math.round(weatherData.main.temp);
  const feelsLike = Math.round(weatherData.main.feels_like);
  const tz = weatherData.timezone;

  const visibilityM = weatherData.visibility;
  const visibilityLabel =
    visibilityM == null
      ? '—'
      : visibilityM >= 1000
        ? `${(visibilityM / 1000).toFixed(1)} km`
        : `${visibilityM} m`;

  const cloudPct = weatherData.clouds?.all;
  const heroGradient = getCardHeroGradient(mainWeather.main, mainWeather.icon);

  return (
    <div className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-xl transition-all duration-300 transform hover:shadow-2xl bg-white dark:bg-gray-900 ring-1 ring-black/5 dark:ring-white/10">
      <div className={`p-6 sm:p-8 bg-gradient-to-r ${heroGradient} text-white`}>
        <div className="flex justify-between items-start gap-4">
          <div className="min-w-0">
            <h2 className="text-3xl sm:text-4xl font-bold truncate">{cityTitle}</h2>
            <p className="text-sm opacity-90">{weatherData.sys.country}</p>
            <p className="text-sm mt-1 opacity-80">{currentDate}</p>
          </div>
          <div className="flex-shrink-0 flex items-center justify-center rounded-2xl bg-white/15 p-2 backdrop-blur-sm">
            <img
              src={iconUrl}
              alt={mainWeather.description}
              className="w-20 h-20 sm:w-24 sm:h-24"
              width={96}
              height={96}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
            <p className="text-5xl sm:text-6xl font-bold tracking-tight">{temp}°C</p>
            <p className="mt-2 text-lg sm:text-xl font-semibold opacity-95">
              Feels Like: {feelsLike}°C <span aria-hidden>🌡️</span>
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-lg font-semibold capitalize">{mainWeather.description}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {isAuthenticated && (
            <button
              type="button"
              onClick={handleFavoriteToggle}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isFavorite
                  ? 'bg-white/25 hover:bg-white/35'
                  : 'bg-white/15 hover:bg-white/25'
              }`}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
              {isFavorite ? 'Saved to favorites' : 'Add to favorites'}
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 sm:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
          <div className="flex items-start gap-3">
            <Wind className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Wind</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">
                {(weatherData.wind.speed * 3.6).toFixed(1)} km/h
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Droplets className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Humidity</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">
                {weatherData.main.humidity}%
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Visibility</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">{visibilityLabel}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Gauge className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pressure</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">
                {weatherData.main.pressure} hPa
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Cloud className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Clouds</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">
                {cloudPct != null ? `${cloudPct}%` : '—'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex flex-col gap-1 shrink-0 mt-0.5">
              <Sunrise className="w-5 h-5 text-amber-500" aria-hidden />
              <Sunset className="w-5 h-5 text-orange-400" aria-hidden />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Sunrise</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">
                {formatLocalTime(weatherData.sys.sunrise, tz)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Sunset</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">
                {formatLocalTime(weatherData.sys.sunset, tz)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 sm:col-span-2">
            <Thermometer className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Min / Max</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">
                {Math.round(weatherData.main.temp_min)}° / {Math.round(weatherData.main.temp_max)}°
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WeatherCard;
