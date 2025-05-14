import React from 'react';
import { Cloud, CloudDrizzle, CloudLightning, CloudRain, CloudSnow, Sun, CloudSun, Wind } from 'lucide-react';

interface WeatherIconProps {
  iconCode: string;
  size?: number;
  className?: string;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  iconCode, 
  size = 24, 
  className = "" 
}) => {
  // Map OpenWeatherMap icon codes to Lucide icons
  const getIcon = (code: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      '01d': <Sun size={size} className={`text-yellow-400 ${className}`} />,
      '01n': <Sun size={size} className={`text-gray-400 ${className}`} />,
      '02d': <CloudSun size={size} className={`text-gray-500 ${className}`} />,
      '02n': <CloudSun size={size} className={`text-gray-500 ${className}`} />,
      '03d': <Cloud size={size} className={`text-gray-500 ${className}`} />,
      '03n': <Cloud size={size} className={`text-gray-500 ${className}`} />,
      '04d': <Cloud size={size} className={`text-gray-600 ${className}`} />,
      '04n': <Cloud size={size} className={`text-gray-600 ${className}`} />,
      '09d': <CloudDrizzle size={size} className={`text-blue-400 ${className}`} />,
      '09n': <CloudDrizzle size={size} className={`text-blue-400 ${className}`} />,
      '10d': <CloudRain size={size} className={`text-blue-500 ${className}`} />,
      '10n': <CloudRain size={size} className={`text-blue-500 ${className}`} />,
      '11d': <CloudLightning size={size} className={`text-yellow-400 ${className}`} />,
      '11n': <CloudLightning size={size} className={`text-yellow-400 ${className}`} />,
      '13d': <CloudSnow size={size} className={`text-blue-200 ${className}`} />,
      '13n': <CloudSnow size={size} className={`text-blue-200 ${className}`} />,
      '50d': <Wind size={size} className={`text-gray-400 ${className}`} />,
      '50n': <Wind size={size} className={`text-gray-400 ${className}`} />,
    };

    return iconMap[code] || <Cloud size={size} className={className} />;
  };

  return <>{getIcon(iconCode)}</>;
};

export default WeatherIcon;