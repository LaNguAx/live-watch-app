import { useParams } from 'react-router-dom';
import { useSocket } from '../../hooks/useSocket';
import { useEffect } from 'react';
import { useAppSelector } from '../../store/hooks';

function Room() {
  const { roomId } = useParams<{ roomId: string }>();
  if (!roomId) throw new Error('Missing roomId in URL');

  const { socket, emit } = useSocket(roomId);

  const { users } = useAppSelector((store) => store.room);

  useEffect(() => {
    emit('get-users-in-room', { roomId });
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Room ID: {roomId}</h2>
      Users: {users}
    </div>
  );
}

export default Room;
