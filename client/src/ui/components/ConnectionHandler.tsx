import { useSocket } from '../../hooks/useSocket';

export default function ConnectionHandler({ socket }) {
  return (
    <div>
      <button onClick={() => socket.connect()}>connect</button>
      <button onClick={() => socket.disconnect()}>disconnect</button>
    </div>
  );
}
