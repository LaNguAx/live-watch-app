import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSocket } from '../../hooks/useSocket';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { exitRoom } from '../../store/slices/roomSlice';

export default function Room() {
  const { roomId } = useParams<{ roomId: string }>();
  if (!roomId) throw new Error('Missing roomId in URL');

  const { socket, emit } = useSocket(roomId);

  return <div>test</div>;
}
