import { useQuery } from '@tanstack/react-query';
import { fetchVideos } from '../services/youtube';

export function useSearchVideos(query: string) {
  return useQuery({
    queryKey: ['videos', query],
    queryFn: () => fetchVideos(query),
    enabled: false,
    refetchOnWindowFocus: false,
  });
}
