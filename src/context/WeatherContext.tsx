import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { WeatherData, ForecastData, FavoriteCity } from '../types';

interface WeatherContextType {
  currentWeather: WeatherData | null;
  forecast: ForecastData | null;
  isLoading: boolean;
  error: string | null;
  favoriteLocations: FavoriteCity[];
  currentCityQuery: string | null;
  lastUpdated: number | null;
  searchCity: (city: string) => Promise<void>;
  refreshWeather: () => Promise<void>;
  addToFavorites: (city: FavoriteCity) => void;
  removeFromFavorites: (cityId: number) => void;
  getWeatherForCity: (city: string) => Promise<void>;
}

const defaultWeatherContext: WeatherContextType = {
  currentWeather: null,
  forecast: null,
  isLoading: false,
  error: null,
  favoriteLocations: [],
  currentCityQuery: null,
  lastUpdated: null,
  searchCity: async () => {},
  refreshWeather: async () => {},
  addToFavorites: () => {},
  removeFromFavorites: () => {},
  getWeatherForCity: async () => {},
};

const WeatherContext = createContext<WeatherContextType>(defaultWeatherContext);

export const useWeather = () => useContext(WeatherContext);

const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [favoriteLocations, setFavoriteLocations] = useState<FavoriteCity[]>([]);
  const [currentCityQuery, setCurrentCityQuery] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('weatherFavorites');
      if (stored) {
        const parsed: FavoriteCity[] = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setFavoriteLocations(parsed);
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  const getWeatherForCity = useCallback(async (city: string): Promise<void> => {
    if (!city) return;

    if (!API_KEY) {
      setError('OpenWeatherMap API key is not configured');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const weatherResponse = await fetch(
        `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
      );

      if (!weatherResponse.ok) {
        throw new Error(
          weatherResponse.status === 404
            ? 'City not found'
            : 'Failed to fetch weather data'
        );
      }

      const weatherData: WeatherData = await weatherResponse.json();
      setCurrentWeather(weatherData);
      setCurrentCityQuery(weatherData.name);
      setLastUpdated(Date.now());

      const forecastResponse = await fetch(
        `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
      );

      if (!forecastResponse.ok) {
        throw new Error('Failed to fetch forecast data');
      }

      const forecastData: ForecastData = await forecastResponse.json();
      setForecast(forecastData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Weather fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchCity = useCallback(async (city: string): Promise<void> => {
    await getWeatherForCity(city);
  }, [getWeatherForCity]);

  const refreshWeather = useCallback(async (): Promise<void> => {
    if (currentCityQuery) {
      await getWeatherForCity(currentCityQuery);
    }
  }, [currentCityQuery, getWeatherForCity]);

  const addToFavorites = (city: FavoriteCity): void => {
    if (!favoriteLocations.some((loc) => loc.id === city.id)) {
      const updatedFavorites = [...favoriteLocations, city];
      setFavoriteLocations(updatedFavorites);
      localStorage.setItem('weatherFavorites', JSON.stringify(updatedFavorites));
    }
  };

  const removeFromFavorites = (cityId: number): void => {
    const updatedFavorites = favoriteLocations.filter((city) => city.id !== cityId);
    setFavoriteLocations(updatedFavorites);
    localStorage.setItem('weatherFavorites', JSON.stringify(updatedFavorites));
  };

  return (
    <WeatherContext.Provider
      value={{
        currentWeather,
        forecast,
        isLoading,
        error,
        favoriteLocations,
        currentCityQuery,
        lastUpdated,
        searchCity,
        refreshWeather,
        addToFavorites,
        removeFromFavorites,
        getWeatherForCity,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};
