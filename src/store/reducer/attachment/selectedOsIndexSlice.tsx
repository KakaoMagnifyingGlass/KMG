import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: number = 0;

export const selectedOsIndexSlice = createSlice({
  name: "selectedOsIndex",
  initialState,
  reducers: {
    setSelectedOsIndex: (state, action: PayloadAction<number>) => {
      return action.payload;
    },
  },
});

export const { setSelectedOsIndex } = selectedOsIndexSlice.actions;
