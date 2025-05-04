import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAction } from '@reduxjs/toolkit';
import { IUser } from './userSlice';

interface IVideo {
  id: string;
  isPlaying: boolean;
  currentTime: number;
  syncedBy?: string;
}

interface IRoom {
  roomId: string;
  users: IUser[];
  video: IVideo;
  status: 'waiting' | 'active';
}

const initialState: IRoom = {
  roomId: '',
  users: [],
  video: {
    id: '',
    isPlaying: false,
    currentTime: 0,
    syncedBy: undefined,
  },
  status: 'waiting',
};

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    createRoom(state, action: PayloadAction<IRoom>) {
      return action.payload;
    },
    setUsers(state, action: PayloadAction<IUser[]>) {
      state.users = action.payload;
    },
    syncVideo(
      state,
      action: PayloadAction<{
        id: string;
        isPlaying: boolean;
        currentTime: number;
        syncedBy?: string;
      }>
    ) {
      state.video = action.payload;
    },
  },
});

export const joinRoom = createAction<{ roomId: string; user: IUser }>(
  'socket/joinRoom'
);
export const leaveRoom = createAction('socket/leaveRoom');
export const sendVideoState = createAction<{
  id: string;
  isPlaying: boolean;
  currentTime: number;
  syncedBy?: string;
}>('socket/sendVideoState');

export const { createRoom, setUsers, syncVideo } = roomSlice.actions;
export default roomSlice.reducer;
