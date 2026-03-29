import React from 'react';
import { ForecastData } from '../../types';

interface HourlyForecastProps {
  forecastData: ForecastData;
}

function formatHourLabel(dt: number, timezoneSec: number): string {
  const ms = (dt + timezoneSec) * 1000;
  return new Date(ms).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ forecastData }) => {
  const tz = forecastData.city.timezone ?? 0;
  const slots = forecastData.list.slice(0, 8);

  if (slots.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700 overflow-hidden">
      <div className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-800 dark:to-purple-900 text-white">
        <h3 className="text-lg font-semibold">Hourly forecast</h3>
        <p className="text-sm opacity-90">Next 24 hours (3-hour steps)</p>
      </div>
      <div className="p-4 overflow-x-auto">
        <div className="flex gap-3 min-w-min pb-1">
          {slots.map((item) => {
            const icon = item.weather[0]?.icon ?? '01d';
            const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;
            const temp = Math.round(item.main.temp);
            const windKmh = Math.round(item.wind.speed * 3.6);

            return (
              <div
                key={item.dt}
                className="flex flex-col items-center justify-center min-w-[5.5rem] rounded-xl bg-gray-50 dark:bg-gray-900/80 px-3 py-3 border border-gray-100 dark:border-gray-700"
              >
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  {formatHourLabel(item.dt, tz)}
                </span>
                <img src={iconUrl} alt="" className="w-12 h-12" width={48} height={48} />
                <span className="text-lg font-bold text-gray-900 dark:text-white">{temp}°</span>
                <span className="text-[10px] text-gray-500 dark:text-gray-500">{windKmh} km/h</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HourlyForecast;
