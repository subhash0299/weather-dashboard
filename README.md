# Weather Dashboard

A polished weather dashboard built with React, TypeScript, and Tailwind CSS. It uses the OpenWeatherMap API for live conditions, forecasts, and geocoding, with favorites, dark mode, and a layout tuned for portfolio or production demos.

![Weather Dashboard](https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)

## Recent updates

- **Rich current conditions**: Visibility, pressure (hPa), cloud coverage, sunrise/sunset (local time), min/max, humidity, and wind in km/h. **Feels like** is emphasized with clear typography.
- **OpenWeather icons**: Current weather uses official **`img/wn/{icon}@2x.png`** artwork from OpenWeatherMap for a native-app look.
- **Hourly-style forecast**: Next ~24 hours in **3-hour steps** (8 slots) with icons, temperature, and wind.
- **5-day forecast**: Per-day **high/low**, **rain probability** (from `pop`), **max wind**, and **average humidity**, grouped by local calendar day using the API timezone.
- **Search UX**: **Enter** or **Search** submits the form; **Geocoding API** suggestions (debounced) with a dropdown to pick a city.
- **Refresh & last updated**: Toolbar shows **relative** last update (e.g. “2 mins ago”, refreshed every 30s) and a **Refresh** control to reload the current city.
- **Weather-based UI**: Dashboard background and card header gradients react to condition (clear, rain, clouds, thunderstorm, snow, fog, day/night).
- **Context & persistence**: Favorites load from **`localStorage`** on app start; weather context tracks **`currentCityQuery`**, **`lastCoords`** (when using GPS), **`lastUpdated`**, and **`refreshWeather()`**.
- **Your location**: **Use my location** uses the browser **Geolocation API** (with permission), then loads weather via OpenWeather **`lat` / `lon`**. The **city title** uses the **Geocoding reverse** API (`/geo/1.0/reverse`) and prefers the **second** result (main city) so hyperlocal station names (e.g. a neighborhood) are not shown instead of the city (e.g. Bengaluru).
- **Default city**: The dashboard initially loads **Delhi**; you can switch with search or **Use my location**.

## Features

- Real-time weather from [OpenWeatherMap](https://openweathermap.org/) (current + 5-day/3-hour forecast)
- **Browser location**: optional “Use my location” flow (HTTPS or `localhost` recommended)
- Geocoding-powered city search with optional suggestions
- User authentication (demo: local storage)
- Favorite locations with persistence
- Dark mode
- Responsive layout
- Loading and error states

## Tech stack

- React 18
- TypeScript
- Tailwind CSS
- Vite
- Lucide React
- React Router DOM

## Getting started

### Prerequisites

- Node.js 18+
- npm or yarn
- [OpenWeatherMap API key](https://openweathermap.org/api) (free tier works for current weather, forecast, and geocoding)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/weather-dashboard.git
cd weather-dashboard
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root:

```env
VITE_OPENWEATHERMAP_API_KEY=your_api_key_here
```

4. Start the dev server:

```bash
npm run dev
```

Open `http://localhost:5173` (or the URL Vite prints).

### Production build

```bash
npm run build
```

Output is in `dist/`. Preview locally with `npm run preview`.

## Project structure

```
src/
├── components/
│   ├── auth/           # Login / signup
│   ├── layout/         # Navbar, footer
│   └── weather/        # WeatherCard, ForecastCard, HourlyForecast, SearchBar, WeatherIcon
├── context/            # Auth, theme, weather (API + favorites + refresh)
├── pages/              # Home, dashboard, favorites, login, signup
├── types/              # Shared TypeScript types
├── utils/              # weatherTheme (gradients), formatRelativeTime
├── App.tsx
└── main.tsx
```

## Features in detail

### Weather data

- Current: temperature, feels like, description, OpenWeather icon image
- Wind (km/h), humidity, visibility, pressure, cloud cover
- Sunrise and sunset (local offset from API)
- Hourly strip: next 8 forecast steps (~24 h)
- 5-day summary: daily min/max, rain %, wind, humidity

### User features

- Register and log in (demo credentials stored client-side; not for real secrets)
- Add/remove favorites from the dashboard when logged in
- Favorites page with quick navigation back to the dashboard

### UI / UX

- Condition-based page and card gradients (`src/utils/weatherTheme.ts`)
- Wider main card (`max-w-2xl`), stronger shadow, rounded corners
- Search button + keyboard submit + geolocation name suggestions

## API usage

The app calls:

- `GET /data/2.5/weather` — current weather (`q=city` or `lat` + `lon`)  
- `GET /data/2.5/forecast` — 5-day forecast in 3-hour steps (same query style)  
- `GET /geo/1.0/direct` — city search suggestions  

All use the same `VITE_OPENWEATHERMAP_API_KEY`. Location-based loads use **`lat` / `lon`** from the browser geolocation result. **Reverse geocoding** (`/geo/1.0/reverse`) picks a friendlier **city label** for the UI than the raw `name` from the weather-by-coordinates response.

## Contributing

Pull requests are welcome.

## License

This project is licensed under the MIT License — see [LICENSE](LICENSE).

## Acknowledgments

- Weather data and icons: [OpenWeatherMap](https://openweathermap.org/)
- UI icons: [Lucide](https://lucide.dev/)
