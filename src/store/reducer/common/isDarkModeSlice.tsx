import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";

const initialState: boolean = false;

export const isDarkModeSlice = createSlice({
  name: "isDarkMode",
  initialState,
  reducers: {
    setIsDarkMode: (state, action: PayloadAction<boolean>) => {
      return action.payload;
    },
  },
});

export let { setIsDarkMode } = isDarkModeSlice.actions;
