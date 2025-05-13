import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import YouTubePlayer, { YouTubePlayerHandle } from './YoutubePlayer';
import { EmitFunction } from '../../../../hooks/useSocket';
import Button from '../../Button';
import { seekToTime } from '../../../../store/slices/roomSlice';
import { fmt, timeStringToSeconds } from '../../../../utils/time';

interface VideoPlayerProps {
  emitter: EmitFunction;
}

export default function VideoPlayer({ emitter: emit }: VideoPlayerProps) {
  const roomId = useAppSelector((store) => store.room.roomId);
  const id = useAppSelector((store) => store.room.video.id);
  const videoStatus = useAppSelector((store) => store.room.status);
  const videoDuration = useAppSelector((store) => store.room.video.duration);
  const videoTime = useAppSelector((store) => store.room.video.time);
  const dispatch = useAppDispatch();

  const playerRef = useRef<YouTubePlayerHandle>(null);
  const [duration, setDuration] = useState<number>(0);
  const [sliderPos, setSliderPos] = useState<number>(0);
  const [playerReady, setPlayerReady] = useState<boolean>(false);

  const isSeekingRef = useRef<boolean>(false);
  const isPausingRef = useRef<boolean>(false);
  const isTriggerPause = useRef<boolean>(false);
  const isPlayingRef = useRef<boolean>(false);
  const [isMute, setIsMute] = useState<boolean>(true);

  useEffect(() => {
    if (!playerReady || !id) return;
    setSliderPos(0); // reset slider UI
    setDuration(
      playerRef.current?.getDuration() || timeStringToSeconds(videoDuration)
    );
  }, [videoDuration, playerReady, id]);

  useEffect(() => {
    if (!playerRef.current) return;

    if (videoStatus === 'waiting') {
      isPausingRef.current = true;
      playerRef.current?.pause();
      // const currentTime = playerRef.current?.getCurrentTime?.();
      // emit('save-watch-time', { roomId, time: currentTime });
    }
    if (videoStatus === 'active') {
      isPlayingRef.current = true;
      playerRef.current?.play();
    }
  }, [videoStatus]);

  useEffect(() => {
    if (!videoTime) return;

    if (!isTriggerPause.current) isSeekingRef.current = true;
    playerRef.current?.seekTo(videoTime);

    setSliderPos(videoTime);
  }, [videoTime, playerReady, videoStatus]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      const currentTime = playerRef.current?.getCurrentTime?.();
      emit('save-watch-time', { roomId, time: currentTime });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Poll playback time so slider & label stay in sync (mobile‑safe)
  useEffect(() => {
    if (!playerReady) return;

    const idt = setInterval(() => {
      const t = playerRef.current?.getCurrentTime?.() ?? 0;
      setSliderPos(t);
    }, 500);

    return () => clearInterval(idt);
  }, [playerReady, videoTime]);

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

  function handleOnReady() {
    console.log('Video is ready.');
    setDuration(playerRef.current?.getDuration() || 1);
    setPlayerReady(true);
  }
  function handleOnPlay() {
    if (isSeekingRef.current) {
      isSeekingRef.current = false;
      return;
    }

    if (isPlayingRef.current) {
      isPlayingRef.current = false;
      return;
    }

    console.log('Video is playing');
    const currentTime = playerRef.current?.getCurrentTime?.() ?? 0;
    emit('play-room-video', { roomId, playTime: currentTime });
  }
  function handleOnPause() {
    if (isPausingRef.current) {
      isPausingRef.current = false;
      return;
    }
    console.log('Video is pause');
    isTriggerPause.current = true;
    emit('pause-room-video', { roomId });
  }
  function handleOnEnd() {
    console.log('Video ended');
  }

  function handleMute() {
    if (isMute) {
      playerRef.current?.unMute();
      setIsMute(false);
    } else {
      playerRef.current?.mute();
      setIsMute(true);
    }
  }

  function handleSliderChange(e: any) {
    const newSliderPos = Number(e.target.value);
    setSliderPos(newSliderPos);
    // emit('play-room-video', { roomId, playTime: newSliderPos });
    dispatch(seekToTime(newSliderPos));
    emit('seek-room-video', { roomId, time: newSliderPos });
  }

  return (
    <div className="w-full">
      <div className="aspect-video">
        <YouTubePlayer
          ref={playerRef}
          videoId={id}
          onReady={handleOnReady}
          onPlay={handleOnPlay}
          onPause={handleOnPause}
          onEnd={handleOnEnd}
          isMuted={isMute}
        />
      </div>

      <div className="flex flex-col">
        <div className="flex gap-4 mt-4 w-full ">
          <div className="relative mb-7 w-full px-5 mx-auto">
            <label htmlFor="labels-range-input" className="sr-only">
              Labels range
            </label>
            <input
              id="labels-range-input"
              type="range"
              value={sliderPos}
              min={0}
              max={duration || 1}
              onChange={handleSliderChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="">
              <span className=" ml-5 text-sm text-gray-500 dark:text-gray-400 absolute start-0 -bottom-6">
                ({fmt(sliderPos)})
              </span>
              <span className="mr-5 text-sm text-gray-500 dark:text-gray-400 absolute end-0 -bottom-6">
                ({fmt(duration)})
              </span>
            </div>
          </div>
        </div>
        <p className="px-5 mb-2 text-xs text-center">
          {isMute ? (
            <>
              <span>Video is muted.</span>
              <br />
              <span>Please unmute to hear something.</span>
            </>
          ) : (
            ''
          )}
        </p>
        <div className="flex  items-center justify-center gap-2">
          <Button onClick={() => playerRef.current?.play()}>▶️ Play</Button>
          <Button onClick={() => playerRef.current?.pause()}>⏸ Pause</Button>
          <Button onClick={handleMute}>
            {isMute ? `🔊 Unmute` : `🔈 Mute`}
          </Button>
        </div>
      </div>
    </div>
  );
}
