import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";

const initialState: boolean = false;

export const isSideMenuChatRoomSelectSlice = createSlice({
  name: "isSideMenuChatRoom",
  initialState,
  reducers: {
    setIsSideMenuChatRoom: (state, action: PayloadAction<boolean>) => {
      return action.payload;
    },
  },
});

export let { setIsSideMenuChatRoom } = isSideMenuChatRoomSelectSlice.actions;
