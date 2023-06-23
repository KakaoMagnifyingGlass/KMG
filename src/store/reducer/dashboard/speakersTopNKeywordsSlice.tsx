import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { ValueCountPair } from "../../../@types/index.d";

const initialState: ValueCountPair[][] = [];

export const speakersTopNKeywordsSlice = createSlice({
  name: "speakersTopNKeywords",
  initialState,
  reducers: {
    setSpeakersTopNKeywords: (state, action: PayloadAction<ValueCountPair[][]>) => {
      state = action.payload;
      console.log(action.payload);
      return state;
    },
  },
});

export let { setSpeakersTopNKeywords } = speakersTopNKeywordsSlice.actions;
