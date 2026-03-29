export function formatRelativeTime(timestampMs: number): string {
  const s = Math.floor((Date.now() - timestampMs) / 1000);
  if (s < 10) return 'just now';
  if (s < 60) return `${s} sec${s === 1 ? '' : 's'} ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min${m === 1 ? '' : 's'} ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h === 1 ? '' : 's'} ago`;
  const d = Math.floor(h / 24);
  return `${d} day${d === 1 ? '' : 's'} ago`;
}
