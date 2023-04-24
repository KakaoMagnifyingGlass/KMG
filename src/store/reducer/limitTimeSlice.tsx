import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { LimitTimeData } from "../../components/datePicker/dateForm";

const initialState: LimitTimeData[] = [];

export const limitTimeSlice = createSlice({
  name: "limitTimeSlice",
  initialState,
  reducers: {
    setLimitTime: (state, action: PayloadAction<LimitTimeData[]>) => {
      state = action.payload;
      return state;
    },
  },
});

export let { setLimitTime } = limitTimeSlice.actions;
