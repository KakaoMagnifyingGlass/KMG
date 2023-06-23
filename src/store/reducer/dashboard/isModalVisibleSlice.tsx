import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";

const initialState: boolean = false;

export const isModalVisibleSlice = createSlice({
  name: "isModalVisible",
  initialState,
  reducers: {
    setIsModalVisible: (state, action: PayloadAction<boolean>) => {
      return action.payload;
    },
  },
});

export let { setIsModalVisible } = isModalVisibleSlice.actions;
