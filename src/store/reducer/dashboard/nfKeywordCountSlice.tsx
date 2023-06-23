import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";

const initialState: number[][] = [];

export const nfKeywordCountsSlice = createSlice({
  name: "nfKeywordCount",
  initialState,
  reducers: {
    setNfKeywordCount: (state, action: PayloadAction<number[][]>) => {
      state = action.payload;
      return state;
    },
  },
});

export let { setNfKeywordCount } = nfKeywordCountsSlice.actions;
