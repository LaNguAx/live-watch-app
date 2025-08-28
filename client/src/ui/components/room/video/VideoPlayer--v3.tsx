import { useEffect, useRef, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import YouTubePlayer, { YouTubePlayerHandle } from './YoutubePlayer';
import { EmitFunction } from '../../../../hooks/useSocket';
import Button from '../../Button';
import { seekToTime } from '../../../../store/slices/roomSlice';
import { fmt, timeStringToSeconds } from '../../../../utils/time';
import { syncValidator, SyncState } from '../../../../utils/syncValidator';

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
  const lastSyncTimestamp = useAppSelector(
    (store) => store.room.lastSyncTimestamp
  );
  const dispatch = useAppDispatch();

  const playerRef = useRef<YouTubePlayerHandle>(null);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playerReady, setPlayerReady] = useState<boolean>(false);
  const [isMute, setIsMute] = useState<boolean>(true);

  // Sync state tracking
  const syncStateRef = useRef({
    isInternalAction: false, // Flag to prevent sync loops
    lastSyncTime: 0,
    syncTolerance: 1, // Allow 1 second drift before forcing sync
    isSeekingFromSync: false,
  });

  // Request sync from server when component mounts or reconnects
  const requestSync = useCallback(() => {
    if (roomId && playerReady) {
      emit('request-sync', { roomId });
    }
  }, [roomId, emit, playerReady]);

  // Initialize player and request sync
  useEffect(() => {
    if (!playerReady || !id) return;

    setCurrentTime(0);
    setDuration(
      playerRef.current?.getDuration() || timeStringToSeconds(videoDuration)
    );

    // Request current state from server
    requestSync();
  }, [videoDuration, playerReady, id, requestSync]);

  // Handle video status changes from Redux store
  useEffect(() => {
    if (!playerRef.current || !playerReady) return;

    syncStateRef.current.isInternalAction = true;

    if (videoStatus === 'waiting') {
      playerRef.current.pause();
    } else if (videoStatus === 'active') {
      playerRef.current.play();
    }

    // Reset flag after a short delay
    setTimeout(() => {
      syncStateRef.current.isInternalAction = false;
    }, 100);
  }, [videoStatus, playerReady]);

  // Handle time sync from Redux store
  useEffect(() => {
    if (!playerRef.current || !playerReady || videoTime === 0) return;

    const currentPlayerTime = playerRef.current.getCurrentTime();
    const timeDiff = Math.abs(currentPlayerTime - videoTime);

    // Only sync if there's significant drift
    if (timeDiff > syncStateRef.current.syncTolerance) {
      syncStateRef.current.isSeekingFromSync = true;
      syncStateRef.current.isInternalAction = true;

      playerRef.current.seekTo(videoTime);
      setCurrentTime(videoTime);

      setTimeout(() => {
        syncStateRef.current.isSeekingFromSync = false;
        syncStateRef.current.isInternalAction = false;
      }, 500);
    }
  }, [videoTime, playerReady]);

  // Time tracking, sync validation, and host sync broadcasting
  useEffect(() => {
    if (!playerReady) return;

    const interval = setInterval(() => {
      const current = playerRef.current?.getCurrentTime?.() ?? 0;
      setCurrentTime(current);

      // Only host broadcasts time updates during playback
      if (isUserHost && videoStatus === 'active') {
        const timeSinceLastSync =
          Date.now() - syncStateRef.current.lastSyncTime;

        // Broadcast time every 2 seconds during playback
        if (timeSinceLastSync > 2000) {
          emit('save-watch-time', { roomId, time: current });
          syncStateRef.current.lastSyncTime = Date.now();
        }
      }

      // Perform sync validation for all users (not just host)
      if (syncValidator.shouldPerformSyncCheck() && lastSyncTimestamp) {
        const localState: SyncState = {
          currentTime: current,
          isPlaying: videoStatus === 'active',
          videoId: id,
          lastUpdateTime: Date.now(),
        };

        const expectedState: SyncState = {
          currentTime: videoTime,
          isPlaying: videoStatus === 'active',
          videoId: id,
          lastUpdateTime: lastSyncTimestamp,
        };

        const validation = syncValidator.validateSync(
          localState,
          expectedState
        );

        if (validation.needsResync) {
          console.warn(
            'Sync drift detected:',
            validation.reason,
            `Drift: ${validation.timeDrift.toFixed(2)}s`
          );
          // Request fresh sync from server
          requestSync();
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [
    playerReady,
    isUserHost,
    videoStatus,
    roomId,
    emit,
    videoTime,
    lastSyncTimestamp,
    id,
    requestSync,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isUserHost) {
        const currentTime = playerRef.current?.getCurrentTime?.();
        emit('save-watch-time', { roomId, time: currentTime });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isUserHost, roomId, emit]);

  // Player event handlers
  const handleOnReady = useCallback(() => {
    const playerDuration = playerRef.current?.getDuration() || 1;
    setDuration(playerDuration);
    setPlayerReady(true);
  }, []);

  const handleOnPlay = useCallback(() => {
    if (syncStateRef.current.isInternalAction) return;

    const currentTime = playerRef.current?.getCurrentTime?.() ?? 0;
    emit('play-room-video', { roomId, playTime: currentTime });
  }, [roomId, emit]);

  const handleOnPause = useCallback(() => {
    if (syncStateRef.current.isInternalAction) return;

    const currentTime = playerRef.current?.getCurrentTime?.() ?? 0;
    emit('pause-room-video', { roomId, currentTime });
  }, [roomId, emit]);

  const handleOnEnd = useCallback(() => {
    console.log('Video ended');
    // Could emit end event here if needed
  }, []);

  const handleMute = useCallback(() => {
    if (isMute) {
      playerRef.current?.unMute();
    } else {
      playerRef.current?.mute();
    }
    setIsMute(!isMute);
  }, [isMute]);

  const handleSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTime = Number(e.target.value);

      // Update local state immediately for responsive UI
      setCurrentTime(newTime);

      // Update Redux state
      dispatch(seekToTime(newTime));

      // Emit seek event to sync with other users
      const shouldPlay = videoStatus === 'active';
      emit('seek-room-video', { roomId, time: newTime, shouldPlay });
    },
    [roomId, emit, dispatch, videoStatus]
  );

  // Manual control handlers (for buttons)
  const handleManualPlay = useCallback(() => {
    if (!playerRef.current) return;

    const currentTime = playerRef.current.getCurrentTime();
    emit('play-room-video', { roomId, playTime: currentTime });
  }, [roomId, emit]);

  const handleManualPause = useCallback(() => {
    if (!playerRef.current) return;

    const currentTime = playerRef.current.getCurrentTime();
    emit('pause-room-video', { roomId, currentTime });
  }, [roomId, emit]);

  // Render empty state
  if (!id) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="aspect-video w-full flex flex-col items-center justify-center text-center text-gray-500 border border-dashed border-gray-300 rounded-xl p-6">
          <p className="text-lg font-medium">No video selected</p>
          <p className="text-sm text-gray-400 mt-1">
            Search and choose a video to start watching together
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="aspect-video w-full flex-shrink-0">
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

      <div className="flex flex-col mt-4">
        {/* Progress bar */}
        <div className="flex gap-4 w-full">
          <div className="relative mb-7 w-full px-5 mx-auto">
            <input
              type="range"
              value={currentTime}
              min={0}
              max={duration || 1}
              onChange={handleSliderChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>{fmt(currentTime)}</span>
              <span>{fmt(duration)}</span>
            </div>
          </div>
        </div>

        {/* Mute warning */}
        {isMute && (
          <p className="px-5 mb-2 text-xs text-center text-gray-400">
            <span>Video is muted.</span>
            <br />
            <span>Please unmute to hear audio.</span>
          </p>
        )}

        {/* Control buttons */}
        <div className="flex items-center justify-center gap-2">
          <Button onClick={handleManualPlay}>▶️ Play</Button>
          <Button onClick={handleManualPause}>⏸ Pause</Button>
          <Button onClick={handleMute}>
            {isMute ? '🔊 Unmute' : '🔈 Mute'}
          </Button>
          <Button onClick={requestSync} className="text-xs">
            🔄 Sync
          </Button>
        </div>

        {/* Status indicator */}
        <div className="text-center mt-2">
          <span
            className={`text-xs px-2 py-1 rounded ${
              videoStatus === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {videoStatus === 'active' ? '▶️ Playing' : '⏸ Paused'}
          </span>
          {isUserHost && (
            <span className="text-xs text-blue-600 ml-2">👑 Host</span>
          )}
        </div>
      </div>
    </div>
  );
}
