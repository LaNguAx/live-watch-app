import { URL as backendURL } from '../sockets/sockets';

export async function fetchVideos(query: string) {
  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(
      `${backendURL}/api/youtube/search?q=${encodedQuery}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.error || 'Failed to fetch videos');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ fetchVideos error:', error);
    // Re-throw so React Query or caller can handle it
    throw error;
  }
}
