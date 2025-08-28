import { useCallback, useEffect, useRef, useState } from 'react';
import { socket } from '../sockets/sockets';
import { Socket } from 'socket.io-client';
import { useAppDispatch } from '../store/hooks';
import {
  IRoom,
  pauseVideo,
  playVideo,
  seekToTime,
  sendMessageToRoom,
  setVideo,
  updateRoom as updateUserRoom,
  syncVideoState,
  Video,
} from '../store/slices/roomSlice';
import { Message } from '../store/slices/roomSlice';
import { setIsHost } from '../store/slices/userSlice';

export type EmitFunction = <T = any>(
  event: string,
  payload?: T,
  callback?: () => void
) => void;

export function useSocket(roomId: string) {
  const socketRef = useRef<Socket>(socket);
  const dispatch = useAppDispatch();
  const [isConnected, setIsConnected] = useState(socket.connected);

  const updateRoom = useCallback(
    (room: IRoom) => {
      dispatch(updateUserRoom(room));
    },
    [dispatch]
  );

  const sendMessage = useCallback(
    ({ message }: { message: Message }) => {
      dispatch(sendMessageToRoom(message));
    },
    [dispatch]
  );

  const setRoomVideo = useCallback(
    ({ video }: { video: Video }) => {
      dispatch(setVideo(video));
    },
    [dispatch]
  );

  const playRoomVideo = useCallback(
    ({
      playTime,
    }: {
      playTime: number;
      status?: string;
      timestamp?: number;
    }) => {
      dispatch(playVideo(playTime));
    },
    [dispatch]
  );

  const pauseRoomVideo = useCallback(
    ({
      pauseTime,
    }: {
      pauseTime: number;
      status?: string;
      timestamp?: number;
    }) => {
      if (pauseTime !== undefined) {
        dispatch(seekToTime(pauseTime));
      }
      dispatch(pauseVideo(''));
    },
    [dispatch]
  );

  const endRoomVideo = useCallback(
    ({ video }: { video: Video }) => {
      dispatch(setVideo(video));
    },
    [dispatch]
  );

  const seekRoomVideo = useCallback(
    ({
      time,
      status,
    }: {
      time: number;
      status?: string;
      timestamp?: number;
    }) => {
      dispatch(seekToTime(time));
      // Update status if provided
      if (status === 'active') {
        dispatch(playVideo(time));
      } else if (status === 'waiting') {
        dispatch(pauseVideo(''));
      }
    },
    [dispatch]
  );

  const handleSyncResponse = useCallback(
    ({
      video,
      status,
      timestamp,
      authoritative,
    }: {
      video: Video;
      status: string;
      timestamp: number;
      authoritative: boolean;
    }) => {
      if (authoritative) {
        dispatch(syncVideoState({ video, status, timestamp }));
      }
    },
    [dispatch]
  );

  const setRoomHost = useCallback(() => {
    dispatch(setIsHost(true));
  }, [dispatch]);

  const startListeners = useCallback(() => {
    const { current: ref } = socketRef;

    ref.on('set-room-host', setRoomHost);
    ref.on('seek-room-video', seekRoomVideo);
    ref.on('play-room-video', playRoomVideo);
    ref.on('pause-room-video', pauseRoomVideo);
    ref.on('end-room-video', endRoomVideo);
    ref.on('update-room', updateRoom);
    ref.on('send-message', sendMessage);
    ref.on('set-room-video', setRoomVideo);
    ref.on('sync-response', handleSyncResponse);
  }, [
    setRoomHost,
    seekRoomVideo,
    playRoomVideo,
    pauseRoomVideo,
    endRoomVideo,
    updateRoom,
    sendMessage,
    setRoomVideo,
    handleSyncResponse,
  ]);

  const stopListeners = useCallback(() => {
    const { current: ref } = socketRef;

    ref.off('set-room-host', setRoomHost);
    ref.off('seek-room-video', seekRoomVideo);
    ref.off('play-room-video', playRoomVideo);
    ref.off('pause-room-video', pauseRoomVideo);
    ref.off('end-room-video', endRoomVideo);
    ref.off('update-room', updateRoom);
    ref.off('send-message', sendMessage);
    ref.off('set-room-video', setRoomVideo);
    ref.off('sync-response', handleSyncResponse);
  }, [
    setRoomHost,
    seekRoomVideo,
    playRoomVideo,
    pauseRoomVideo,
    endRoomVideo,
    updateRoom,
    sendMessage,
    setRoomVideo,
    handleSyncResponse,
  ]);

  const socketDispatcher: EmitFunction = useCallback(
    (event, payload, callback) => {
      socket.emit(event, payload, callback);
    },
    []
  );

  useEffect(() => {
    const ref = socketRef.current;

    // Set up connection event listeners
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    ref.on('connect', onConnect);
    ref.on('disconnect', onDisconnect);

    if (!ref.connected) ref.connect();

    return () => {
      console.log('Component unmounting..');
      ref.off('connect', onConnect);
      ref.off('disconnect', onDisconnect);
      ref.emit('leave-room', { roomId }, () => ref.disconnect());
    };
  }, [roomId]);

  useEffect(() => {
    startListeners();

    return () => {
      stopListeners();
    };
  }, [startListeners, stopListeners]);

  return { socket: socketRef.current, emit: socketDispatcher, isConnected };
}
