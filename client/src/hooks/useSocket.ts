import { useCallback, useEffect, useRef } from 'react';
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
  Video,
} from '../store/slices/roomSlice';
import { Message } from '../store/slices/roomSlice';

export type EmitFunction = <T = any>(
  event: string,
  payload?: T,
  callback?: () => void
) => void;

export function useSocket(roomId: string) {
  const socketRef = useRef<Socket>(socket);
  const dispatch = useAppDispatch();

  // const updateRoom = useCallback(
  //   ({
  //     roomId,
  //     users,
  //     chat,
  //     status,
  //   }: {
  //     roomId: string;
  //     users: Record<string, IUser>;
  //     chat: Message[];
  //     status: 'waiting' | 'active';
  //   }) => {
  //     console.log(roomId, users, status, chat);
  //     dispatch(
  //       updateUserRoom({roomId, users, status, chat })
  //     );
  //   },
  //   []
  // );
  const updateRoom = useCallback((room: IRoom) => {
    dispatch(updateUserRoom(room));
  }, []);

  const sendMessage = useCallback(({ message }: { message: Message }) => {
    dispatch(sendMessageToRoom(message));
  }, []);

  const setRoomVideo = useCallback(({ video }: { video: Video }) => {
    dispatch(setVideo(video));
  }, []);

  const playRoomVideo = useCallback(({ playTime }: { playTime: number }) => {
    dispatch(playVideo(playTime));
  }, []);

  const pauseRoomVideo = useCallback(({ roomId }: { roomId: string }) => {
    dispatch(pauseVideo(roomId));
  }, []);

  const endRoomVideo = useCallback(({ video }: { video: Video }) => {
    dispatch(setVideo(video));
  }, []);

  const seekRoomVideo = useCallback(({ time }: { time: number }) => {
    dispatch(seekToTime(time));
  }, []);

  const startListeners = useCallback(() => {
    const { current: ref } = socketRef;

    ref.on('seek-room-video', seekRoomVideo);
    ref.on('play-room-video', playRoomVideo);
    ref.on('pause-room-video', pauseRoomVideo);
    ref.on('end-room-video', endRoomVideo);
    ref.on('update-room', updateRoom);
    ref.on('send-message', sendMessage);
    ref.on('set-room-video', setRoomVideo);
  }, []);

  const stopListeners = useCallback(() => {
    const { current: ref } = socketRef;

    ref.off('seek-room-video', seekRoomVideo);
    ref.off('play-room-video', playRoomVideo);
    ref.off('pause-room-video', pauseRoomVideo);
    ref.off('end-room-video', endRoomVideo);
    ref.off('update-room', updateRoom);
    ref.off('send-message', sendMessage);
    ref.off('set-room-video', setRoomVideo);
  }, []);

  const socketDispatcher: EmitFunction = useCallback(
    (event, payload, callback) => {
      socket.emit(event, payload, callback);
    },
    []
  );

  useEffect(() => {
    const ref = socketRef.current;

    if (!ref.connected) ref.connect();

    return () => {
      console.log('Component unmounting..');
      ref.emit('leave-room', { roomId }, () => ref.disconnect());
    };
  }, [roomId]);

  useEffect(() => {
    startListeners();

    return () => {
      stopListeners();
    };
  }, [roomId]);

  return { socket: socketRef.current, emit: socketDispatcher };
}
