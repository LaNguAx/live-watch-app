import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from './userSlice';

export type Message = {
  user: string;
  message: string;
};

export type Chat = Message[];

export type Video = {
  id: string;
  title: string;
  thumbnail: string;
  author: string;
  publishedAt: string;
  description: string;
  duration:string;
  url: string;
};

type Search = {
  results: Video[];
  query: string;
};

interface IRoom {
  roomId: string;
  users: Record<string, IUser>;
  chat: Chat;
  search: Search;
  video: Video;
  status: 'waiting' | 'active';
}

export const initialState: IRoom = {
  roomId: '',
  users: {},
  status: 'waiting',
  search: {
    results: [],
    query: '',
  },
  video: {
    id: '',
    title: '',
    thumbnail: '',
    author: '',
    publishedAt: '',
    description: '',
    duration:'',
    url: '',
  },
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
    setSearchVideos(state, action: PayloadAction<Video[]>) {
      state.search.results = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.search.query = action.payload;
    },
    setVideo(state, action: PayloadAction<Video>) {
      state.video = action.payload;
    },
  },
});

export const {
  exitRoom,
  updateRoom,
  sendMessageToRoom,
  setSearchVideos,
  setSearchQuery,
  setVideo,
} = roomSlice.actions;
export default roomSlice.reducer;
