import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useWeather } from '../context/WeatherContext';
import SearchBar from '../components/weather/SearchBar';
import WeatherCard from '../components/weather/WeatherCard';
import ForecastCard from '../components/weather/ForecastCard';
import HourlyForecast from '../components/weather/HourlyForecast';
import { Loader, RefreshCw, MapPin, MapPinOff } from 'lucide-react';
import { getPageBackgroundClasses } from '../utils/weatherTheme';
import { formatRelativeTime } from '../utils/formatRelativeTime';

const GEO_OPTIONS: PositionOptions = {
  enableHighAccuracy: false,
  timeout: 15000,
  maximumAge: 300000,
};

function geolocationErrorMessage(code: number): string {
  switch (code) {
    case 1:
      return 'Location access was denied. Allow location in your browser settings, or search for a city above.';
    case 2:
      return 'Your position could not be determined. Try again or search for a city.';
    case 3:
      return 'Location request timed out. Try again or search for a city.';
    default:
      return 'Could not read your location. Try searching for a city.';
  }
}

const DashboardPage: React.FC = () => {
  const {
    currentWeather,
    forecast,
    isLoading,
    error,
    getWeatherForCity,
    getWeatherByCoordinates,
    refreshWeather,
    lastUpdated,
  } = useWeather();
  const [tick, setTick] = useState(0);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [showLocationPrompt, setShowLocationPrompt] = useState(true);

  const dismissLocationPrompt = useCallback(() => {
    setShowLocationPrompt(false);
  }, []);

  const handleDeclineLocation = useCallback(() => {
    setLocationError(null);
    dismissLocationPrompt();
  }, [dismissLocationPrompt]);

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

  useEffect(() => {
    if (currentWeather) {
      setLocationError(null);
    }
  }, [currentWeather]);

  useEffect(() => {
    if (!showLocationPrompt) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showLocationPrompt]);

  useEffect(() => {
    if (!showLocationPrompt) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleDeclineLocation();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showLocationPrompt, handleDeclineLocation]);

  const requestUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser. Search for a city instead.');
      dismissLocationPrompt();
      return;
    }

    setLocationError(null);
    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setIsLocating(false);
        dismissLocationPrompt();
        getWeatherByCoordinates(latitude, longitude);
      },
      (geoErr) => {
        setIsLocating(false);
        setLocationError(geolocationErrorMessage(geoErr.code));
        dismissLocationPrompt();
      },
      GEO_OPTIONS
    );
  }, [getWeatherByCoordinates, dismissLocationPrompt]);

  const pageBg = useMemo(() => {
    if (!currentWeather?.weather[0]) {
      return 'from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900';
    }
    const w = currentWeather.weather[0];
    return getPageBackgroundClasses(w.main, w.icon);
  }, [currentWeather]);

  const showWeatherBlock = currentWeather && !error;
  const showLoader = isLoading || isLocating;
  const loaderMessage = isLocating ? 'Getting your location…' : 'Loading weather data…';

  const locationModal =
    showLocationPrompt &&
    createPortal(
      <div
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="location-dialog-title"
      >
        <button
          type="button"
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
          aria-label="Dismiss"
          onClick={handleDeclineLocation}
        />
        <div
          className="relative z-10 w-full max-w-md rounded-2xl border border-gray-200/80 dark:border-gray-600 bg-white dark:bg-gray-900 shadow-2xl p-5 sm:p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <h2
            id="location-dialog-title"
            className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white text-center sm:text-left mb-2"
          >
            See weather for where you are
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 text-center sm:text-left">
            Choose whether to share your approximate location. If you allow, your browser will ask for
            permission. We only use it to load the forecast for your area.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              type="button"
              onClick={requestUserLocation}
              disabled={isLocating || isLoading}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 disabled:opacity-60 text-white font-semibold px-5 py-3 shadow-md transition-all"
            >
              <MapPin className="h-5 w-5 shrink-0" aria-hidden />
              Allow
            </button>
            <button
              type="button"
              onClick={handleDeclineLocation}
              disabled={isLocating || isLoading}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800/80 text-gray-800 dark:text-gray-100 font-semibold px-5 py-3 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700/80 disabled:opacity-60 transition-colors"
            >
              <MapPinOff className="h-5 w-5 shrink-0" aria-hidden />
              Don&apos;t allow
            </button>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left">
            You can always search for any city on the dashboard.
          </p>
          {locationError && (
            <p className="mt-3 text-sm text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-900/30 rounded-lg px-3 py-2 border border-amber-200/80 dark:border-amber-700/50">
              {locationError}
            </p>
          )}
        </div>
      </div>,
      document.body
    );

  return (
    <>
      {locationModal}

      <div
        className={`min-h-[calc(100vh-64px)] bg-gradient-to-br ${pageBg} py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-500`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Weather Dashboard
              </h1>
              {lastUpdated != null && !isLoading && !isLocating && (
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

            {!showLocationPrompt && locationError && (
              <p className="max-w-2xl mx-auto w-full text-sm text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-900/30 rounded-lg px-3 py-2 border border-amber-200/80 dark:border-amber-700/50">
                {locationError}
              </p>
            )}
          </div>

          {showLoader ? (
            <div className="flex items-center justify-center py-16">
              <Loader className="h-10 w-10 text-purple-600 dark:text-purple-400 animate-spin" />
              <span className="ml-3 text-lg text-gray-600 dark:text-gray-300">{loaderMessage}</span>
            </div>
          ) : error ? (
            <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-lg max-w-2xl mx-auto">
              {error}
            </div>
          ) : (
            <>
              {showWeatherBlock && (
                <div className="mb-8 flex flex-col items-center gap-6">
                  <WeatherCard weatherData={currentWeather} />
                  {forecast && <HourlyForecast forecastData={forecast} />}
                </div>
              )}

              {forecast && showWeatherBlock && (
                <div className="mt-12">
                  <ForecastCard forecastData={forecast} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
