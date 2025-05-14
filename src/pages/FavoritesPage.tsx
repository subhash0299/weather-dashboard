import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWeather } from '../context/WeatherContext';
import { MapPin, Heart, Trash2 } from 'lucide-react';

const FavoritesPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { favoriteLocations, removeFromFavorites, getWeatherForCity } = useWeather();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleViewWeather = (cityName: string) => {
    getWeatherForCity(cityName);
    // Navigate to dashboard to see the weather
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Your Favorite Locations</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Quick access to weather data for your saved locations.
          </p>
        </div>

        {favoriteLocations.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">No favorites yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              You haven't added any locations to your favorites.
            </p>
            <a
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Search for a location
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {favoriteLocations.map((city) => (
              <div
                key={city.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:translate-y-[-4px]"
              >
                <div className="p-4 bg-blue-600 dark:bg-blue-700 text-white">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold truncate flex-1">{city.name}</h3>
                    <span className="text-xs bg-blue-500 dark:bg-blue-600 py-1 px-2 rounded-full">
                      {city.country}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between">
                    <button
                      onClick={() => handleViewWeather(city.name)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      <MapPin className="h-4 w-4 mr-1" />
                      View Weather
                    </button>
                    <button
                      onClick={() => removeFromFavorites(city.id)}
                      className="inline-flex items-center p-1.5 border border-transparent text-sm font-medium rounded-md text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none transition-colors"
                      aria-label="Remove from favorites"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;