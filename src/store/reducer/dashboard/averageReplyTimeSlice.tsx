import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";

const initialState: number[] = [];

export const averageReplyTimeSlice = createSlice({
  name: "averageReplyTime",
  initialState,
  reducers: {
    setAverageReplyTime: (state, action: PayloadAction<number[]>) => {
      state = action.payload;
      return state;
    },
  },
});

export let { setAverageReplyTime } = averageReplyTimeSlice.actions;
