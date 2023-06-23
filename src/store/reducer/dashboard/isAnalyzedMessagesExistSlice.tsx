import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";

const initialState: boolean = false;

export const isAnalyzedMessagesExistSlice = createSlice({
  name: "isAnalyzedMessagesExistSlice",
  initialState,
  reducers: {
    setIsAnalyzedMessagesExist: (state, action: PayloadAction<boolean>) => {
      return action.payload;
    },
  },
});

export let { setIsAnalyzedMessagesExist } = isAnalyzedMessagesExistSlice.actions;
