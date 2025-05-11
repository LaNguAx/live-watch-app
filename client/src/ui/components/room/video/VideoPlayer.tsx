import { useEffect, useRef } from 'react';
import { useAppSelector } from '../../../../store/hooks';
import YouTubePlayer, { YouTubePlayerHandle } from './YoutubePlayer';
import { EmitFunction } from '../../../../hooks/useSocket';

interface VideoPlayerProps {
  emitter: EmitFunction;
}

export default function VideoPlayer({ emitter: emit }: VideoPlayerProps) {
  const roomId = useAppSelector((store) => store.room.roomId);
  const id = useAppSelector((store) => store.room.video.id);
  const videoStatus = useAppSelector((store) => store.room.status);
  const videoTime = useAppSelector((store) => store.room.video.time);
  const playerRef = useRef<YouTubePlayerHandle>(null);
  const isSeekingRef = useRef<boolean>(false);

  useEffect(() => {
    // playerRef.current?.seekTo(videoTime);
    // playerRef.current?.play();
    // TMRW U HAVE TO FIX THIS WHERE SEEKING SOMEWHERE DOESNT WORK.
    // ITS BECAUSE SEEKTO GRIGGERS VIDEO PAUSED AND VIDEO PLAYED MULTIPLE TIMES...
    // maybe use ref to save state when seeking and stop the emit when its happening.s
    // i tried doing it using video status but utube api is trash.. whenver
    // u seek somehwere it fires 'pause' then 'start' therefore listening to that event will cause
    // unnecessary runs of code.
  }, [videoStatus]);

  useEffect(() => {
    console.log(videoStatus);
    if (videoStatus === 'active') {
      playerRef.current?.seekTo(videoTime);
      isSeekingRef.current = true;
      playerRef.current?.play();
      return;
    }
    if (videoStatus === 'waiting') playerRef.current?.pause();
  }, [videoStatus]);

  if (!id) {
    return (
      <div className="flex flex-col items-center justify-center h-60 text-center text-gray-500 border border-dashed border-gray-300 rounded-xl p-6">
        <svg
          className="w-12 h-12 mb-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 9V5.25M8.25 9V5.25M3.375 9h17.25m-4.125 4.5v5.25m-9.75-5.25v5.25M12 15.75v5.25"
          />
        </svg>
        <p className="text-lg font-medium">No video selected</p>
        <p className="text-sm text-gray-400 mt-1">
          Search and choose a video to start watching
        </p>
      </div>
    );
  }

  // 🔁 Programmatic control
  function handleReady() {
    console.log('Video is ready');
  }

  function handlePlay() {
    if (isSeekingRef.current) return;

    console.log('Video played');
    const playTime = playerRef.current?.getCurrentTime();
    emit('play-room-video', { roomId, playTime });
  }

  function handlePause() {
    // console.log('Video paused');
    // const pauseTime = playerRef.current?.getCurrentTime();
    // setCurrentVideoTime(pauseTime);
    emit('pause-room-video', { roomId });
  }

  function handleEnd() {
    console.log('Video ended');
    emit('end-room-video');
  }

  return (
    <div className="w-full">
      <div className="aspect-video">
        <YouTubePlayer
          ref={playerRef}
          videoId={id}
          onReady={handleReady}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnd={handleEnd}
        />
      </div>

      {/* Example buttons */}
      <div className="flex gap-4 mt-4">
        {/* <button onClick={() => playerRef.current?.play()}>▶️ Play</button>
        <button onClick={() => playerRef.current?.pause()}>⏸ Pause</button>
        <button onClick={() => playerRef.current?.seekTo(30)}>
          ⏩ Seek to 0:30
        </button> */}
      </div>
    </div>
  );
}
