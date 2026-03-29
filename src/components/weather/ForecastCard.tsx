import React, { useMemo } from 'react';
import { ForecastData, ForecastListItem } from '../../types';
import { useWeather } from '../../context/WeatherContext';
import WeatherIcon from './WeatherIcon';

interface ForecastCardProps {
  forecastData: ForecastData;
}

function groupByLocalDay(
  list: ForecastListItem[],
  timezoneSec: number
): ForecastListItem[][] {
  const buckets = new Map<string, ForecastListItem[]>();
  for (const item of list) {
    const key = new Date((item.dt + timezoneSec) * 1000).toISOString().slice(0, 10);
    const arr = buckets.get(key) ?? [];
    arr.push(item);
    buckets.set(key, arr);
  }
  return Array.from(buckets.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(0, 5)
    .map(([, items]) => items);
}

const ForecastCard: React.FC<ForecastCardProps> = ({ forecastData }) => {
  const { displayCityName } = useWeather();
  const forecastCityLabel = displayCityName ?? forecastData.city.name;
  const tz = forecastData.city.timezone ?? 0;

  const dailyRows = useMemo(() => {
    const groups = groupByLocalDay(forecastData.list, tz);
    return groups.map((items, idx) => {
      const minTemp = Math.min(...items.map((i) => i.main.temp_min));
      const maxTemp = Math.max(...items.map((i) => i.main.temp_max));
      const maxPop = Math.max(...items.map((i) => i.pop ?? 0));
      const maxWindMs = Math.max(...items.map((i) => i.wind.speed));
      const avgHumidity =
        items.reduce((s, i) => s + i.main.humidity, 0) / items.length;
      const mid = items[Math.floor(items.length / 2)] ?? items[0];
      const date = new Date(mid.dt * 1000);
      return {
        key: `${mid.dt}-${idx}`,
        date,
        minTemp,
        maxTemp,
        rainPct: Math.round(maxPop * 100),
        windKmh: maxWindMs * 3.6,
        humidity: Math.round(avgHumidity),
        weather: mid.weather[0],
      };
    });
  }, [forecastData.list, tz]);

  return (
    <div className="w-full max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ring-1 ring-black/5 dark:ring-white/10">
      <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 text-white">
        <h3 className="text-lg font-semibold">5-day forecast</h3>
        <p className="text-sm opacity-90">
          {forecastCityLabel}, {forecastData.city.country}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 dark:divide-gray-700">
        {dailyRows.map((row) => {
          const day = row.date.toLocaleDateString('en-US', { weekday: 'short' });
          const formattedDate = row.date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });

          return (
            <div key={row.key} className="p-4 flex flex-col items-center justify-center text-center">
              <p className="font-semibold text-gray-700 dark:text-gray-300">{day}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{formattedDate}</p>

              <WeatherIcon iconCode={row.weather.icon} size={40} className="my-2" />

              <p className="text-xl font-bold text-gray-800 dark:text-white">
                {Math.round(row.maxTemp)}° / {Math.round(row.minTemp)}°
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 capitalize">
                {row.weather.description}
              </p>

              <div className="mt-3 w-full space-y-1 text-xs text-gray-600 dark:text-gray-300">
                <p>
                  <span className="text-gray-500 dark:text-gray-400">Rain: </span>
                  {row.rainPct}%
                </p>
                <p>
                  <span className="text-gray-500 dark:text-gray-400">Wind: </span>
                  {row.windKmh.toFixed(0)} km/h
                </p>
                <p className="text-gray-500 dark:text-gray-400">Humidity: {row.humidity}%</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ForecastCard;
