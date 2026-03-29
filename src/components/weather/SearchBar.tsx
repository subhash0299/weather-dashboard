import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, MapPin } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';

const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
const GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct';

interface GeoSuggestion {
  name: string;
  country: string;
  state?: string;
}

function formatSuggestion(g: GeoSuggestion): string {
  const parts = [g.name, g.state, g.country].filter(Boolean);
  return parts.join(', ');
}

const SearchBar: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState<GeoSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const { searchCity, isLoading, error } = useWeather();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const runSearch = useCallback(
    (q: string) => {
      const trimmed = q.trim();
      if (!trimmed || !API_KEY) return;
      searchCity(trimmed);
      setOpen(false);
      setSuggestions([]);
    },
    [searchCity]
  );

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!API_KEY || searchValue.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;
      try {
        const res = await fetch(
          `${GEO_URL}?q=${encodeURIComponent(searchValue.trim())}&limit=5&appid=${API_KEY}`,
          { signal: ac.signal }
        );
        if (!res.ok) return;
        const data: GeoSuggestion[] = await res.json();
        setSuggestions(Array.isArray(data) ? data : []);
        setOpen(true);
      } catch (e) {
        if ((e as Error).name !== 'AbortError') {
          setSuggestions([]);
        }
      }
    }, 350);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(searchValue);
  };

  const pickSuggestion = (g: GeoSuggestion) => {
    const label = formatSuggestion(g);
    setSearchValue(label);
    runSearch(`${g.name},${g.country}`);
  };

  return (
    <div ref={containerRef} className="w-full max-w-lg mx-auto relative">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => suggestions.length > 0 && setOpen(true)}
              placeholder="Search for a city..."
              autoComplete="off"
              className="w-full py-3 pl-4 pr-12 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition duration-200"
              disabled={isLoading}
              aria-autocomplete="list"
              aria-expanded={open}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              disabled={isLoading || !searchValue.trim()}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
          <button
            type="submit"
            disabled={isLoading || !searchValue.trim()}
            className="shrink-0 px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors shadow-md"
          >
            Search
          </button>
        </div>

        {open && suggestions.length > 0 && (
          <ul
            className="absolute z-20 mt-1 w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg max-h-60 overflow-auto"
            role="listbox"
          >
            {suggestions.map((g, i) => (
              <li key={`${g.name}-${g.country}-${i}`} role="option">
                <button
                  type="button"
                  className="w-full text-left px-4 py-2.5 flex items-start gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pickSuggestion(g)}
                >
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-blue-500" />
                  <span>{formatSuggestion(g)}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {error && <p className="text-red-500 text-sm mt-1 ml-1">{error}</p>}
      </form>
    </div>
  );
};

export default SearchBar;
