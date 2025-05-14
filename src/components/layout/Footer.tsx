import React from 'react';
import { Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 shadow-inner py-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} Weather Dashboard. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <a
              href="#"
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              <span className="sr-only">GitHub</span>
              <Github className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
        <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-500">
          Weather data provided by OpenWeatherMap
        </div>
      </div>
    </footer>
  );
};

export default Footer;