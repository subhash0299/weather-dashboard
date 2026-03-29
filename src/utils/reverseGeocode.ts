/**
 * OpenWeather reverse geocoding returns places from most specific → general.
 * Index 0 is often a neighborhood (e.g. "Kanija Bhavan"); index 1 is usually the city (e.g. "Bengaluru").
 */
export interface ReverseGeoItem {
  name: string;
  country: string;
  state?: string;
}

export function pickCityLabelFromReverseResults(results: ReverseGeoItem[]): string | null {
  if (!results?.length) return null;
  if (results.length >= 2 && results[1]?.name) {
    return results[1].name;
  }
  return results[0].name;
}
