import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { StringNumberTuple } from "../../../@types/index.d";

const initialState: StringNumberTuple[] = [];

export const mostChattedTimesSlice = createSlice({
  name: "mostChattedTimes",
  initialState,
  reducers: {
    setMostChattedTimes: (state, action: PayloadAction<StringNumberTuple[]>) => {
      state = action.payload;
      return state;
    },
  },
});

export let { setMostChattedTimes } = mostChattedTimesSlice.actions;
