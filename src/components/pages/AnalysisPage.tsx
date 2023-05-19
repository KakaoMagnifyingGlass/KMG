import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { AnalyzedMessage } from "../../@types/index.d";
import KeywordCloud from "../organisms/graphs/KeywordCloud";
import ReplyLineGraph from "../organisms/graphs/ReplyLineGraph";
import MostChatTimesGraph from "../organisms/graphs/MostChatTimesGraph";
import scrollToEvent from "../../module/common/scrollEvent";
import ChatRatioGraph from "../organisms/graphs/ChatRaitoGraph";
import TimezoneGraph from "../organisms/graphs/TimezoneGraph";
import ChatVolumeGraph from "../organisms/graphs/ChatVolumeGraph";
import SummaryPieGraph from "../organisms/graphs/SummaryPieGraph";
import DatePickerCalendar from "../organisms/DatePickerCalendar";
import DashboardSection from "../section/DashboardSection";
import DashboardSideMenu from "../section/DashboardSideMenu";
import PercentAreaChart from "../organisms/graphs/PercentAreaChart";

const AnalysisPageBox = styled.div`
  margin-top: 80px;
  display: flex;
  width: 100%;

  > :nth-child(1) {
    width: 15%;
  }
  > :nth-child(2) {
    width: 85%;
  }
`;

const TempGraphBox = styled.div`
  height: 500px;
`;

const AnalysisPage = () => {
  const results = useSelector(
    (state: { analyzedMessagesSlice: AnalyzedMessage }) => state.analyzedMessagesSlice
  );

  useEffect(() => {
    scrollToEvent(0, "auto");
  }, []);

  return (
    <AnalysisPageBox>
      <DashboardSideMenu />
      <DashboardSection />
    </AnalysisPageBox>
  );
};

export default AnalysisPage;
