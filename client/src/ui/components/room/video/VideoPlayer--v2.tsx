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
  const isUserHost = useAppSelector((store) => store.user.isHost);
  const videoStatus = useAppSelector((store) => store.room.status);
  const videoDuration = useAppSelector((store) => store.room.video.duration);
  const videoTime = useAppSelector((store) => store.room.video.time);
  const dispatch = useAppDispatch();

  const playerRef = useRef<YouTubePlayerHandle>(null);
  const [duration, setDuration] = useState<number>(0);
  const [sliderPos, setSliderPos] = useState<number>(0);
  const [playerReady, setPlayerReady] = useState<boolean>(false);
  const [isMute, setIsMute] = useState<boolean>(true);

  const statusRef = useRef({
    seeking: false,
    pausing: false,
    playing: false,
    triggerPause: false,
  });

  useEffect(() => {
    if (!playerReady || !id) return;
    setSliderPos(0);
    setDuration(
      playerRef.current?.getDuration() || timeStringToSeconds(videoDuration)
    );
  }, [videoDuration, playerReady, id]);

  useEffect(() => {
    if (!playerRef.current) return;

    if (videoStatus === 'waiting') {
      statusRef.current.pausing = true;
      playerRef.current.pause();
    } else if (videoStatus === 'active') {
      statusRef.current.playing = true;
      playerRef.current.play();
    }
  }, [videoStatus]);

  useEffect(() => {
    if (!videoTime || !playerRef.current) return;

    if (!statusRef.current.triggerPause) {
      statusRef.current.seeking = true;
    }
    playerRef.current.seekTo(videoTime);
    setSliderPos(videoTime);
    statusRef.current.triggerPause = false; // reset
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

  useEffect(() => {
    if (!playerReady) return;

    const interval = setInterval(() => {
      const current = playerRef.current?.getCurrentTime?.() ?? 0;
      setSliderPos(current);

      if (isUserHost) {
        emit('save-watch-time', { roomId, time: current });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [playerReady, isUserHost]);

  const handleOnReady = () => {
    setDuration(playerRef.current?.getDuration() || 1);
    setPlayerReady(true);
  };

  const handleOnPlay = () => {
    if (statusRef.current.seeking) {
      statusRef.current.seeking = false;
      return;
    }
    if (statusRef.current.playing) {
      statusRef.current.playing = false;
      return;
    }
    const currentTime = playerRef.current?.getCurrentTime?.() ?? 0;
    emit('play-room-video', { roomId, playTime: currentTime });
  };

  const handleOnPause = () => {
    if (statusRef.current.pausing) {
      statusRef.current.pausing = false;
      return;
    }
    statusRef.current.triggerPause = true;
    emit('pause-room-video', { roomId });
  };

  const handleOnEnd = () => {
    console.log('Video ended');
  };

  const handleMute = () => {
    if (isMute) {
      playerRef.current?.unMute();
    } else {
      playerRef.current?.mute();
    }
    setIsMute(!isMute);
  };

  const handleSliderChange = (e: any) => {
    const newSliderPos = Number(e.target.value);
    setSliderPos(newSliderPos);
    dispatch(seekToTime(newSliderPos));
    emit('seek-room-video', { roomId, time: newSliderPos });
  };

  if (!id) {
    return (
      <div className="flex flex-col items-center justify-center h-60 text-center text-gray-500 border border-dashed border-gray-300 rounded-xl p-6">
        <p className="text-lg font-medium">No video selected</p>
        <p className="text-sm text-gray-400 mt-1">
          Search and choose a video to start watching
        </p>
      </div>
    );
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
        <div className="flex gap-4 mt-4 w-full">
          <div className="relative mb-7 w-full px-5 mx-auto">
            <input
              type="range"
              value={sliderPos}
              min={0}
              max={duration || 1}
              onChange={handleSliderChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>{fmt(sliderPos)}</span>
              <span>{fmt(duration)}</span>
            </div>
          </div>
        </div>

        {isMute && (
          <p className="px-5 mb-2 text-xs text-center text-gray-400">
            <span>Video is muted.</span>
            <br />
            <span>Please unmute to hear something.</span>
          </p>
        )}

        <div className="flex items-center justify-center gap-2">
          <Button onClick={() => playerRef.current?.play()}>▶️ Play</Button>
          <Button onClick={() => playerRef.current?.pause()}>⏸ Pause</Button>
          <Button onClick={handleMute}>
            {isMute ? '🔊 Unmute' : '🔈 Mute'}
          </Button>
        </div>
      </div>
    </div>
  );
}
