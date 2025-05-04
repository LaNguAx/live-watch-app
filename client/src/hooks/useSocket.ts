import { useCallback, useEffect, useRef } from 'react';
import { socket } from '../sockets/sockets';
import { Socket } from 'socket.io-client';
import { useAppDispatch } from '../store/hooks';
import { updateRoom as updateUserRoom } from '../store/slices/roomSlice';
import { IUser } from '../store/slices/userSlice';

export function useSocket(roomId: string) {
  const socketRef = useRef<Socket>(socket);
  const dispatch = useAppDispatch();

  const updateRoom = useCallback(
    ({ roomId, users }: { roomId: string; users: IUser[] }) => {
      dispatch(updateUserRoom({ roomId, users, status: 'waiting' }));
    },
    []
  );

  const startListeners = useCallback(() => {
    const { current: ref } = socketRef;

    ref.on('update-room', updateRoom);
  }, []);

  const stopListeners = useCallback(() => {
    const { current: ref } = socketRef;

    ref.off('update-room', updateRoom);
  }, []);

  const socketDispatcher = useCallback(
    (action: any, payload?: any, retHandler?: () => void) => {
      socket.emit(action, payload, retHandler);
    },
    []
  );

  useEffect(() => {
    const ref = socketRef.current;

    if (ref.connected) return;

    ref.connect();

    return () => {
      console.log('Component unmounting..');
      ref.emit('leave-room', { roomId }, () => ref.disconnect());
    };
  }, []);

  useEffect(() => {
    startListeners();

    socketDispatcher('join-room', { roomId });

    return () => {
      stopListeners();
    };
  }, []);

  return { socket: socketRef.current, emit: socketDispatcher };
}
