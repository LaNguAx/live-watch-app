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
  duration: string;
  url: string;
  time: number;
};

type Search = {
  results: Video[];
  query: string;
};

export interface IRoom {
  roomId: string;
  users: Record<string, IUser>;
  chat: Chat;
  search: Search;
  video: Video;
  status: 'waiting' | 'active' | '';
}

export const initialState: IRoom = {
  roomId: '',
  users: {},
  status: '',
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
    duration: '',
    url: '',
    time: 0,
  },
  chat: [],
};

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    updateRoom(state, action: PayloadAction<IRoom>) {
      return {
        ...action.payload,
        search: { results: state.search.results, query: state.search.query },
      };
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
    playVideo(state, action: PayloadAction<number>) {
      state.video.time = action.payload;
      state.status = 'active';
    },
    pauseVideo(state, _action: PayloadAction<string>) {
      state.status = 'waiting';
    },
    seekToTime(state, action: PayloadAction<number>) {
      state.video.time = action.payload;
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
  playVideo,
  pauseVideo,
  seekToTime,
} = roomSlice.actions;
export default roomSlice.reducer;
