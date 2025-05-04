import { useCallback, useEffect, useRef } from 'react';
import { socket } from '../sockets/sockets';
import { Socket } from 'socket.io-client';
import { useAppDispatch } from '../store/hooks';
import { setUsers } from '../store/slices/roomSlice';

export function useSocket(roomId: string) {
  const socketRef = useRef<Socket>(socket);
  const dispatch = useAppDispatch();

  const handleGetUsers = useCallback(({ roomId, users }: any) => {
    console.log(users);
    dispatch(setUsers(users));
  }, []);

  const startListeners = useCallback(() => {
    const { current: ref } = socketRef;

    ref.on('get-users-in-room', handleGetUsers);
  }, []);

  const stopListeners = useCallback(() => {
    const { current: ref } = socketRef;

    ref.off('get-users-in-room', handleGetUsers);
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
