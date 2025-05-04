import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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
  status: 'waiting' | 'active';
}

const initialState: IRoom = {
  roomId: '',
  users: [],
  status: 'waiting',
};

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    exitRoom(state) {
      return initialState;
    },
    updateRoom(state, action: PayloadAction<IRoom>) {
      return action.payload;
    },
  },
});

export const { exitRoom, updateRoom } = roomSlice.actions;
export default roomSlice.reducer;
