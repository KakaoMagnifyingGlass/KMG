import { configureStore } from "@reduxjs/toolkit";
import { limitTimeSlice } from "./reducer/dashboard/limitTimeSlice";
import { analyzedMessagesSlice } from "./reducer/dashboard/analyzedMessagesSlice";
import { selectedRoomIndexSlice } from "./reducer/dashboard/selectedRoomIndexSlice";
import { averageReplyTimeSlice } from "./reducer/dashboard/averageReplyTimeSlice";
import { nfKeywordCountsSlice } from "./reducer/dashboard/nfKeywordCountSlice";
import { mostChattedTimesSlice } from "./reducer/dashboard/mostChattedTimes";
import { selectedSpeakerIndexSlice } from "./reducer/dashboard/selectedSpeakerIndexSlice";
import { speakersTopNKeywordsSlice } from "./reducer/dashboard/speakersTopNKeywordsSlice";
import { attachedFileListSlice } from "./reducer/attachment/attachedFileListSlice";
import { selectedOsIndexSlice } from "./reducer/attachment/selectedOsIndexSlice";
import { isAnalyzedMessagesExistSlice } from "./reducer/dashboard/isAnalyzedMessagesExistSlice";
import { volumeHourlyBoxSizeSlice } from "./reducer/dashboard/volumeHourlyBoxSizeSlice";
import { isDarkModeSlice } from "./reducer/common/isDarkModeSlice";
import { isModalVisibleSlice } from "./reducer/dashboard/isModalVisibleSlice";
import { isSideMenuChatRoomSelectSlice } from "./reducer/dashboard/isSideMenuChatRoomSelectSlice";

export default configureStore({
  reducer: {
    analyzedMessagesSlice: analyzedMessagesSlice.reducer,
    selectedRoomIndexSlice: selectedRoomIndexSlice.reducer,
    limitTimeSlice: limitTimeSlice.reducer,
    averageReplyTimeSlice: averageReplyTimeSlice.reducer,
    nfKeywordCountsSlice: nfKeywordCountsSlice.reducer,
    speakersTopNKeywordsSlice: speakersTopNKeywordsSlice.reducer,
    mostChattedTimesSlice: mostChattedTimesSlice.reducer,
    selectedSpeakerIndexSlice: selectedSpeakerIndexSlice.reducer,
    attachedFileListSlice: attachedFileListSlice.reducer,
    selectedOsIndexSlice: selectedOsIndexSlice.reducer,
    isAnalyzedMessagesExistSlice: isAnalyzedMessagesExistSlice.reducer,
    volumeHourlyBoxSizeSlice: volumeHourlyBoxSizeSlice.reducer,
    isDarkModeSlice: isDarkModeSlice.reducer,
    isModalVisibleSlice: isModalVisibleSlice.reducer,
    isSideMenuChatRoomSelectSlice: isSideMenuChatRoomSelectSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: true, // 불변성 체크 활성화
      serializableCheck: false, // 직렬화 체크 비활성화
    }),
});
