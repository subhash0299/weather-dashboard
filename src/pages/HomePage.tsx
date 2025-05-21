import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CloudSun, MapPin, Moon } from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Weather
            </span>{' '}
            <span className="bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
              Dashboard
            </span>
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Stay ahead of the weather with real-time forecasts and get the information you need at a glance.
          </p>
          <div className="mt-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-3 text-base font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all transform hover:scale-105"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl shadow-lg transition-all duration-300 hover:transform hover:translate-y-[-4px] border border-purple-100 dark:border-purple-900">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg text-white mb-4">
              <CloudSun className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Real-time Weather
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get accurate, up-to-the-minute weather information for any location worldwide with detailed forecasts.
            </p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl shadow-lg transition-all duration-300 hover:transform hover:translate-y-[-4px] border border-pink-100 dark:border-pink-900">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg text-white mb-4">
              <MapPin className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Location Search
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Search for any location worldwide and get instant access to detailed weather information.
            </p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl shadow-lg transition-all duration-300 hover:transform hover:translate-y-[-4px] border border-blue-100 dark:border-blue-900">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg text-white mb-4">
              <Moon className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Dark Mode
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Customize your viewing experience with a sleek dark mode that's easier on your eyes at night.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-8 md:p-12 text-center transform hover:scale-[1.02] transition-transform duration-300">
          <h2 className="text-3xl font-bold mb-4">Ready to check the weather?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-purple-100">
            Get instant access to weather forecasts for any location worldwide.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-3 text-base font-medium rounded-lg text-purple-600 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-white transition-colors"
          >
            Open Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;