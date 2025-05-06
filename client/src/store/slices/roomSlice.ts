import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from './userSlice';

export type Message = {
  user: string;
  message: string;
};

export type Chat = Message[];

interface IRoom {
  roomId: string;
  users: Record<string, IUser>;
  chat: Chat;
  status: 'waiting' | 'active';
}

const initialState: IRoom = {
  roomId: '',
  users: {},
  status: 'waiting',
  chat: [],
};

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    updateRoom(_state, action: PayloadAction<IRoom>) {
      return action.payload;
    },
    exitRoom(_state) {
      return initialState;
    },
    sendMessageToRoom(state, action: PayloadAction<Message>) {
      state.chat.push(action.payload);
    },
  },
});

export const { exitRoom, updateRoom, sendMessageToRoom } = roomSlice.actions;
export default roomSlice.reducer;
