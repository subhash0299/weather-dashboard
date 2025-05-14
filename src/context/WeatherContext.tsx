import React, { createContext, useState, useContext, useEffect } from 'react';
import { WeatherData, ForecastData, FavoriteCity } from '../types';
import { useAuth } from './AuthContext';

interface WeatherContextType {
  currentWeather: WeatherData | null;
  forecast: ForecastData | null;
  isLoading: boolean;
  error: string | null;
  favoriteLocations: FavoriteCity[];
  searchCity: (city: string) => Promise<void>;
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
  searchCity: async () => {},
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
  
  const { isAuthenticated, user } = useAuth();

  // Load favorites from localStorage when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const storedFavorites = localStorage.getItem(`weatherFavorites_${user.id}`);
      if (storedFavorites) {
        try {
          const favorites = JSON.parse(storedFavorites);
          setFavoriteLocations(favorites);
        } catch (error) {
          console.error('Failed to parse stored favorites:', error);
        }
      }
    } else {
      setFavoriteLocations([]);
    }
  }, [isAuthenticated, user]);

  // Get weather data for a city
  const getWeatherForCity = async (city: string): Promise<void> => {
    if (!city) return;
    
    if (!API_KEY) {
      setError('OpenWeatherMap API key is not configured');
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      // Fetch current weather
      const weatherResponse = await fetch(
        `${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`
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

      // Fetch 5-day forecast
      const forecastResponse = await fetch(
        `${BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`
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
  };

  // Search for a city's weather
  const searchCity = async (city: string): Promise<void> => {
    await getWeatherForCity(city);
  };

  // Add a city to favorites
  const addToFavorites = (city: FavoriteCity): void => {
    if (!isAuthenticated || !user) return;

    // Check if city is already in favorites
    if (!favoriteLocations.some((loc) => loc.id === city.id)) {
      const updatedFavorites = [...favoriteLocations, city];
      setFavoriteLocations(updatedFavorites);
      
      // Save to localStorage
      localStorage.setItem(
        `weatherFavorites_${user.id}`,
        JSON.stringify(updatedFavorites)
      );
    }
  };

  // Remove a city from favorites
  const removeFromFavorites = (cityId: number): void => {
    if (!isAuthenticated || !user) return;

    const updatedFavorites = favoriteLocations.filter((city) => city.id !== cityId);
    setFavoriteLocations(updatedFavorites);
    
    // Save to localStorage
    localStorage.setItem(
      `weatherFavorites_${user.id}`,
      JSON.stringify(updatedFavorites)
    );
  };

  return (
    <WeatherContext.Provider
      value={{
        currentWeather,
        forecast,
        isLoading,
        error,
        favoriteLocations,
        searchCity,
        addToFavorites,
        removeFromFavorites,
        getWeatherForCity,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};