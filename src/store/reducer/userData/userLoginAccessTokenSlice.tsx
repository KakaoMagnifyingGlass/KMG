import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { AccessToken } from "../../../@types/index.d";

const initialState: AccessToken = "";

export const userLoginAccessTokenSlice = createSlice({
  name: "userLoginAccessToken",
  initialState,
  reducers: {
    setUserLoginAccessTokenSlice: (state, action: PayloadAction<AccessToken>) => {
      return action.payload;
    },
  },
});

export let { setUserLoginAccessTokenSlice } = userLoginAccessTokenSlice.actions;
