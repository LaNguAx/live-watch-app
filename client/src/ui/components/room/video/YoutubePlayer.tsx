import { useEffect, useRef } from 'react';

interface YouTubePlayerProps {
  videoId: string;
  onReady?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnd?: () => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function YouTubePlayer({
  videoId,
  onReady,
  onPlay,
  onPause,
  onEnd,
}: YouTubePlayerProps) {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ✅ Load IFrame API once and create the player
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);

      window.onYouTubeIframeAPIReady = loadPlayer;
    } else {
      loadPlayer();
    }

    function loadPlayer() {
      if (!containerRef.current) return;

      playerRef.current = new window.YT.Player(containerRef.current, {
        height: '100%',
        width: '100%',
        videoId,
        events: {
          onReady: () => onReady?.(),
          onStateChange: (event: any) => {
            switch (event.data) {
              case window.YT.PlayerState.PLAYING:
                onPlay?.();
                break;
              case window.YT.PlayerState.PAUSED:
                onPause?.();
                break;
              case window.YT.PlayerState.ENDED:
                onEnd?.();
                break;
            }
          },
        },
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, []); // ⬅️ only run once on mount

  // ✅ Detect videoId change and load new video
  useEffect(() => {
    if (
      playerRef.current &&
      typeof playerRef.current.loadVideoById === 'function'
    ) {
      playerRef.current.loadVideoById(videoId);
    }
  }, [videoId]);

  return (
    <div className="aspect-video w-full">
      <div ref={containerRef} />
    </div>
  );
}
