import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { FileObject } from "../../../@types/index.d";
import { isAllowedFileType } from "../../../components/sections/attachment/AttachmentSection";

const initialState: FileObject[][] = [];

export const attachedFileListSlice = createSlice({
  name: "attachedFileListSlice",
  initialState,
  reducers: {
    setAttachedFileList: (state, action: PayloadAction<FileObject[][]>) => {
      state = action.payload;
      return state;
    },

    pushNewlyAttachedFiles: (state, action: PayloadAction<any[]>) => {
      const allowedFiles = action.payload.filter((file) => isAllowedFileType(file));
      if (allowedFiles.length === 0) {
        alert("파일은 오직 .txt 그리고 .csv만 첨부가 가능합니다");
        return;
      }
      if (state.length) {
        return [...state, [...allowedFiles]];
      }
      return [[...allowedFiles]];
    },

    deleteAttachedFileArray: (state, action: PayloadAction<number>) => {
      const filteredFileList = [...state].filter((_, index) => index !== action.payload);
      return filteredFileList;
    },
  },
});

export let { setAttachedFileList, pushNewlyAttachedFiles, deleteAttachedFileArray } =
  attachedFileListSlice.actions;
