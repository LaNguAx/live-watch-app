import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IUser {
  name: string;
  isHost: boolean;
  // inRoom: string | null;
}

const initialState: IUser = {
  name: '',
  isHost: false,
  // inRoom: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    },
    setIsHost(state, action: PayloadAction<boolean>) {
      state.isHost = action.payload;
    },
    // setRoom(state, action: PayloadAction<string | null>) {
    //   state.inRoom = action.payload;
    // },
    resetUser() {
      return initialState;
    },
  },
});

export const { setName, setIsHost } = userSlice.actions;
export default userSlice.reducer;
