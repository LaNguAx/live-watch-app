export const fmt = (s: number) =>
  new Date(s * 1000).toISOString().substring(14, 19);
export function timeStringToSeconds(time: string): number {
  const parts = time.trim().split(':').map(Number);

  if (parts.length === 2) {
    // MM:SS
    const [m, s] = parts;
    return m * 60 + s;
  }

  if (parts.length === 3) {
    // HH:MM:SS
    const [h, m, s] = parts;
    return h * 3600 + m * 60 + s;
  }

  throw new Error('Invalid time format. Use MM:SS or HH:MM:SS');
}
