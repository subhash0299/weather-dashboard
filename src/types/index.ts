export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface WeatherData {
  id: number;
  name: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: Weather[];
  wind: {
    speed: number;
    deg: number;
  };
  /** Meters; OpenWeather may omit in edge cases */
  visibility?: number;
  clouds?: {
    all: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  dt: number;
  timezone: number;
  coord: {
    lat: number;
    lon: number;
  };
}

export interface ForecastListItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: Weather[];
  wind: {
    speed: number;
    deg: number;
  };
  /** Probability of precipitation, 0–1 */
  pop?: number;
  dt_txt: string;
}

export interface ForecastData {
  list: ForecastListItem[];
  city: {
    name: string;
    country: string;
    /** Seconds offset from UTC */
    timezone?: number;
  };
}

export interface FavoriteCity {
  id: number;
  name: string;
  country: string;
}

export interface ThemeState {
  darkMode: boolean;
}