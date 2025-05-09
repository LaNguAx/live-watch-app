import { useCallback, useEffect, useRef } from 'react';
import { socket } from '../sockets/sockets';
import { Socket } from 'socket.io-client';
import { useAppDispatch } from '../store/hooks';
import {
  sendMessageToRoom,
  setVideo,
  updateRoom as updateUserRoom,
  Video,
} from '../store/slices/roomSlice';
import { IUser } from '../store/slices/userSlice';
import { Message } from '../store/slices/roomSlice';
import { initialState } from '../store/slices/roomSlice';

export type EmitFunction = <T = any>(
  event: string,
  payload?: T,
  callback?: () => void
) => void;

export function useSocket(roomId: string) {
  const socketRef = useRef<Socket>(socket);
  const dispatch = useAppDispatch();

  const updateRoom = useCallback(
    ({
      roomId,
      users,
      chat,
      status,
    }: {
      roomId: string;
      users: Record<string, IUser>;
      chat: Message[];
      status: 'waiting' | 'active';
    }) => {
      console.log(roomId, users, status, chat);
      dispatch(
        updateUserRoom({ ...initialState, roomId, users, status, chat })
      );
    },
    []
  );

  const sendMessage = useCallback(({ message }: { message: Message }) => {
    dispatch(sendMessageToRoom(message));
  }, []);

  const setRoomVideo = useCallback(({ video }: { video: Video }) => {
    dispatch(setVideo(video));
  }, []);

  const startListeners = useCallback(() => {
    const { current: ref } = socketRef;

    ref.on('update-room', updateRoom);
    ref.on('send-message', sendMessage);
    ref.on('set-room-video', setRoomVideo);
  }, []);

  const stopListeners = useCallback(() => {
    const { current: ref } = socketRef;

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
