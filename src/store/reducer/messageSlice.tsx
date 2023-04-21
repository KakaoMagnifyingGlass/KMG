import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { AnalyzedMessage } from "../../components/main/Main";

const initialState: AnalyzedMessage[] = [];

export const analyzedMessagesSlice = createSlice({
  name: "analyzedMessage",
  initialState,
  reducers: {
    setAnalyzedMessages: (state, action: PayloadAction<AnalyzedMessage[]>) => {
      state = action.payload;
      return state;
    },
  },
});

export let { setAnalyzedMessages } = analyzedMessagesSlice.actions;
