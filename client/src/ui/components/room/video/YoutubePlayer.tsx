import { useEffect, useRef, useImperativeHandle, forwardRef, Ref } from 'react';

export interface YouTubePlayerHandle {
  play: () => void;
  pause: () => void;
  seekTo: (seconds: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  unMute: () => void;
  mute: () => void;
}

interface YouTubePlayerProps {
  videoId: string;
  onReady?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnd?: () => void;
  isMuted: boolean;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const YouTubePlayer = forwardRef(function YouTubePlayer(
  { videoId, onReady, onPlay, onPause, onEnd, isMuted }: YouTubePlayerProps,
  ref: Ref<YouTubePlayerHandle>
) {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 👇 Expose methods to parent
  useImperativeHandle(ref, () => ({
    play: () => playerRef.current?.playVideo?.(),
    pause: () => playerRef.current?.pauseVideo?.(),
    seekTo: (seconds: number) => playerRef.current?.seekTo?.(seconds, true),
    getCurrentTime: () => playerRef.current?.getCurrentTime?.() || 0,
    getDuration: () => playerRef.current?.getDuration?.() || 0,
    unMute: () => playerRef.current?.unMute?.(),
    mute: () => playerRef.current?.mute?.(),
  }));

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
        playerVars: {
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          fs: 0,
          iv_load_policy: 3,
          disablekb: 1,
          mute: +isMuted,
        },

        // FIX SOUND IT DOESNT WORK
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
  }, []);

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
});

export default YouTubePlayer;
