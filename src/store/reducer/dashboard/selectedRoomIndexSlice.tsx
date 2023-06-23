import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";

const initialState: number = 0;

export const selectedRoomIndexSlice = createSlice({
  name: "selectedRoomIndex",
  initialState,
  reducers: {
    setSelectedChatRoomIndex: (state, action: PayloadAction<number>) => {
      state = action.payload;
      return state;
    },
  },
});

export let { setSelectedChatRoomIndex } = selectedRoomIndexSlice.actions;
