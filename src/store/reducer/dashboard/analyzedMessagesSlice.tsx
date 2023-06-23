import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { AnalyzedMessage } from "../../../@types/index.d";

const initialState: AnalyzedMessage[][][] = [];

export const analyzedMessagesSlice = createSlice({
  name: "analyzedMessage",
  initialState,
  reducers: {
    setAnalyzedMessages: (state, action: PayloadAction<AnalyzedMessage[][][]>) => {
      return action.payload;
    },
  },
});

export let { setAnalyzedMessages } = analyzedMessagesSlice.actions;
