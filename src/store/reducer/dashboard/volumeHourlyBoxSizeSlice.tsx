import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";

const initialState: number[] = [0, 0];

export const volumeHourlyBoxSizeSlice = createSlice({
  name: "volumeHourlyBoxSize",
  initialState,
  reducers: {
    setVolumeHourlyBoxSize: (state, action: PayloadAction<number[]>) => {
      return action.payload;
    },
  },
});

export let { setVolumeHourlyBoxSize } = volumeHourlyBoxSizeSlice.actions;
