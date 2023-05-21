import React, { useEffect } from "react";
import styled from "styled-components";
import DashboardContainer from "../organisms/DashboardContainer";
import { useSelector } from "react-redux";
import scrollToEvent from "../../module/common/scrollEvent";
import { AnalyzedMessage } from "../../@types/index.d";
import TimezoneGraph from "../organisms/graphs/TimezoneGraph";
import KeywordCloud from "../organisms/graphs/KeywordCloud";
import ReplyLineGraph from "../organisms/graphs/ReplyLineGraph";
import MostChatTimesGraph from "../organisms/graphs/MostChatTimesGraph";
import RadarGraph from "../organisms/graphs/RadarGraph";
import Span from "../atoms/Span";
import ChatVolumeGraph from "../organisms/graphs/ChatVolumeGraph";
import ChatRatioGraph from "../organisms/graphs/ChatRaitoGraph";
import PercentAreaChart from "../organisms/graphs/PercentAreaChart";
import KeyWordDashBoard from "../organisms/graphs/KeyWordDashBoard";
import PieChartWithNeedle from "../organisms/graphs/PieChartWithNeedle";

const DashboardTemplateContainer = styled.div`
  padding: 10px;
  gap: 10px;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  text-align: center;
  border: 1px solid #000;
  background: ${(props) => props.theme.mainBlue};
  * {
    border-radius: 12px;
  }
  > :nth-child(1) {
    width: 20%;
  }
  > :nth-child(2) {
    width: 80%;
  }
`;
const AsideBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  > * {
    background: ${(props) => props.theme.mainWhite};
  }
  > :nth-child(1) {
    width: 100%;
    height: 33%;
  }
  > :nth-child(2) {
    width: 100%;
    height: 33%;
  }
  > :nth-child(3) {
    width: 100%;
    height: 33%;
  }
`;
const ArticleBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  > :nth-child(1) {
    height: 15%;
    /* background-color: #f00; */
  }
  > :nth-child(2) {
    height: 85%;
  }
`;
const HeadBox = styled.div`
  display: flex;
  gap: 10px;

  > * {
    background: ${(props) => props.theme.mainWhite};
    padding: 10px 20px 0px 15px;
    text-align: left;
  }
  > :nth-child(1) {
    flex: 2;
    flex-direction: row;
    justify-content: space-between;
  }
  > :nth-child(2) {
    flex: 1;
  }
  > :nth-child(3) {
    flex: 1;
  }
  > :nth-child(4) {
    flex: 1;
  }
  > :nth-child(5) {
    flex: 1;
  }
`;

const BodyBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  > :nth-child(2) {
    > :nth-child(1) {
      width: 60%;
    }
    > :nth-child(2) {
      width: 40%;
    }
  }
`;

const VerticalBox = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  gap: 10px;
  > * {
    width: 100%;
  }
  > :nth-child(1) {
    background: ${(props) => props.theme.mainWhite};
  }
`;
const HorizontalBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  > * {
    width: 100%;
    background: ${(props) => props.theme.mainWhite};
  }
`;

const TempGraphBox = styled.div`
  height: 100%;
  padding: 10px;
  margin: 0 auto;
`;

const SpeakerSelect = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
  align-items: flex-end;
`;

const DashboardSection = () => {
  const results = useSelector(
    (state: { analyzedMessagesSlice: AnalyzedMessage }) => state.analyzedMessagesSlice
  );

  useEffect(() => {
    scrollToEvent(0, "auto");
  }, []);
  return (
    <DashboardTemplateContainer>
      <AsideBox>
        <TempGraphBox>{Array.isArray(results) && results.length !== 0 && <RadarGraph />}</TempGraphBox>
        <TempGraphBox>
          {Array.isArray(results) && results.length !== 0 && <ChatVolumeGraph />}
        </TempGraphBox>
        <TempGraphBox>
          {Array.isArray(results) && results.length !== 0 && <PercentAreaChart />}
        </TempGraphBox>
      </AsideBox>
      <ArticleBox>
        <HeadBox>
          <DashboardContainer>
            <div>
              <Span color="#7e848a">대화량</Span>
              {Array.isArray(results) && results.length !== 0 && <PieChartWithNeedle />}
            </div>

            <SpeakerSelect>
              <Span color="#7e848a">강조할 대화자</Span>
              <Span fontSize="19px" fontWeight="bold" color="#000">
                전체
              </Span>
              <Span fontSize="11px" color="#0D6EFD">
                각 대화자의 분석이 가능합니다
              </Span>
            </SpeakerSelect>
          </DashboardContainer>
          <DashboardContainer>
            <Span color="#7e848a">대화자 수</Span>
            <Span fontSize="24px" fontWeight="bold" textAlign="right">
              3
            </Span>
          </DashboardContainer>
          <DashboardContainer>
            <Span color="#7e848a">총 대화수</Span>
            <Span fontSize="24px" fontWeight="bold" textAlign="right">
              12341231
            </Span>
          </DashboardContainer>

          <DashboardContainer>
            <Span color="#7e848a">주로 대화 시간대</Span>
            <Span fontSize="24px" fontWeight="bold" textAlign="right">
              20시
            </Span>
          </DashboardContainer>
        </HeadBox>
        <BodyBox>
          <VerticalBox>
            <TempGraphBox>
              {Array.isArray(results) && results.length !== 0 && <ReplyLineGraph />}
            </TempGraphBox>
          </VerticalBox>
          <VerticalBox>
            <HorizontalBox>
              <TempGraphBox>
                {Array.isArray(results) && results.length !== 0 && <TimezoneGraph />}
              </TempGraphBox>
            </HorizontalBox>
            <HorizontalBox>
              <TempGraphBox>
                {Array.isArray(results) && results.length !== 0 && <MostChatTimesGraph />}
              </TempGraphBox>
              <TempGraphBox>
                {Array.isArray(results) && results.length !== 0 && <KeyWordDashBoard />}
              </TempGraphBox>
            </HorizontalBox>
          </VerticalBox>
        </BodyBox>
      </ArticleBox>
    </DashboardTemplateContainer>
  );
};

export default DashboardSection;
