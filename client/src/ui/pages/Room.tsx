import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSocket } from '../../hooks/useSocket';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { exitRoom } from '../../store/slices/roomSlice';

function Room() {
  const { roomId } = useParams<{ roomId: string }>();
  if (!roomId) throw new Error('Missing roomId in URL');

  const { socket, emit } = useSocket(roomId);

  // const [in, setIn] = useState('');

  const navigate = useNavigate();

  const room = useAppSelector((store) => store.room);
  const dispatch = useAppDispatch();

  function handleBackToHome() {
    // the navigate also disconnects the socket and triggers the user removal from room in server
    navigate('/');
    dispatch(exitRoom());
  }

  function submitChat(e) {
    e.preventDefault();
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Room ID: {roomId}</h2>
      <button onClick={handleBackToHome}>Back to home</button>
      Users: {room.users}
      <form action="">
        {/* <input type="text" onChange={(e) => setIn(e.target.value)} /> */}
        <button onClick={submitChat}>submit chat</button>
      </form>
    </div>
  );
}

export default Room;
