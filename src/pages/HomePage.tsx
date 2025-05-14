import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CloudSun, MapPin, User, Moon } from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
            <span className="text-blue-600 dark:text-blue-400">Weather</span> Dashboard
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Stay ahead of the weather with real-time forecasts, save your favorite locations, and get the information you need at a glance.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-3 text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3 text-base font-medium rounded-lg text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-blue-600 dark:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Log In
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-transform duration-300 hover:transform hover:translate-y-[-4px]">
            <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-400 mb-4">
              <CloudSun className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Real-time Weather</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get accurate, up-to-the-minute weather information for any location worldwide with detailed forecasts.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-transform duration-300 hover:transform hover:translate-y-[-4px]">
            <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-400 mb-4">
              <MapPin className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Favorite Locations</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Save your most visited places and quickly access their weather forecasts with a single click.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-transform duration-300 hover:transform hover:translate-y-[-4px]">
            <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-400 mb-4">
              <Moon className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Dark Mode</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Customize your viewing experience with a sleek dark mode that's easier on your eyes at night.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 bg-blue-600 dark:bg-blue-800 text-white rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-blue-100">
            Create your free account today and get instant access to weather forecasts for any location.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="px-8 py-3 text-base font-medium rounded-lg text-blue-600 dark:text-blue-800 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white transition-colors"
          >
            Sign Up Free
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;