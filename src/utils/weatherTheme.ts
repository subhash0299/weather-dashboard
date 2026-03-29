/** Page / hero gradients from OpenWeather condition codes (main + icon). */
export function getPageBackgroundClasses(
  weatherMain: string,
  iconCode: string
): string {
  const main = weatherMain.toLowerCase();
  const isNight = iconCode.endsWith('n');

  if (main === 'clear' && !isNight) {
    return 'from-amber-200 via-yellow-100 to-sky-200 dark:from-amber-950/40 dark:via-yellow-950/30 dark:to-sky-950/40';
  }
  if (main === 'clear' && isNight) {
    return 'from-slate-900 via-indigo-950 to-slate-900';
  }
  if (main === 'rain' || main === 'drizzle') {
    return 'from-sky-400 via-blue-500 to-slate-600 dark:from-sky-950 dark:via-blue-950 dark:to-slate-900';
  }
  if (main === 'thunderstorm') {
    return 'from-slate-700 via-violet-900 to-slate-900';
  }
  if (main === 'snow') {
    return 'from-slate-200 via-sky-100 to-blue-100 dark:from-slate-800 dark:via-sky-950 dark:to-slate-900';
  }
  if (main === 'mist' || main === 'fog' || main === 'haze') {
    return 'from-slate-300 via-gray-300 to-slate-400 dark:from-slate-800 dark:via-gray-900 dark:to-slate-800';
  }
  if (main === 'clouds') {
    return 'from-slate-300 via-gray-200 to-slate-400 dark:from-slate-800 dark:via-gray-800 dark:to-slate-700';
  }
  return 'from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900';
}

/** Hero strip inside the weather card (top colored section). */
export function getCardHeroGradient(
  weatherMain: string,
  iconCode: string
): string {
  const main = weatherMain.toLowerCase();
  const isNight = iconCode.endsWith('n');

  if (main === 'clear' && !isNight) return 'from-amber-400 to-orange-500';
  if (main === 'clear' && isNight) return 'from-indigo-800 to-slate-900';
  if (main === 'rain' || main === 'drizzle') return 'from-sky-600 to-blue-800';
  if (main === 'thunderstorm') return 'from-violet-700 to-slate-900';
  if (main === 'snow') return 'from-sky-300 to-blue-400';
  if (main === 'clouds') return 'from-slate-500 to-slate-700';
  if (main === 'mist' || main === 'fog') return 'from-gray-500 to-slate-600';

  if (main === 'clear') return 'from-amber-400 to-orange-500';
  return 'from-blue-500 to-indigo-700';
}
