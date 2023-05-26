import React, { useState, useEffect, ChangeEvent } from "react";
import styled from "styled-components";
import DashboardContainer from "../organisms/DashboardContainer";
import { useDispatch, useSelector } from "react-redux";
import scrollToEvent from "../../module/common/scrollEvent";
import { AnalyzedMessage, ChatTimes, StringNumberTuple } from "../../@types/index.d";
import ChatVolumeByHourlyGraph from "../organisms/graphs/ChatVolumeByHourlyGraph";
import ReplySpeedGraph from "../organisms/graphs/ReplySpeedGraph";
import ReplyCountByHourlyGraph from "../organisms/graphs/ReplyCountByHourlyGraph";
import Span from "../atoms/Span";
import KeywordChartGraph from "../organisms/graphs/KeywordChartGraph";
import ChatRatioWithArrowGraph from "../organisms/graphs/ChatRatioWithArrowGraph";

import { getChatTimes, getSpeakers } from "../../module/common/getProperties";
import { getTotalChatCounts } from "../organisms/graphs/SummaryPieGraph";
import { setSelectedSpeakerIndex } from "../../store/reducer/selectedSpeakerIndexSlice";
import DetailGraphModalForSquare from "../organisms/DetailGraphModalForSquare";
import ChatRoomCompareGraph from "../organisms/graphs/ChatRoomCompareGraph";
import ChatVolumeByPeriodGraph from "../organisms/graphs/ChatVolumeByPeriodGraph";
import ChatRateGraph from "../organisms/graphs/ChatRateGraph";
import GraphDisplay from "../organisms/GraphDisplay";
import DashboardHeaderContent from "../molecules/DashboardHeaderContent";

const DashboardTemplateContainer = styled.div`
  height: calc(100vh - 80px);
  width: 100%;
  padding: 10px;
  gap: 10px;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  text-align: center;
  background: ${(props) => props.theme.mainBlue};

  > :nth-child(1) {
    display: flex;
    height: 100%;
    width: 25%;
  }
  > :nth-child(2) {
    display: flex;
    height: 100%;
    width: 75%;
  }
`;

const AsideBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  > * {
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
    justify-content: center;
    width: 100%;
    background: ${(props) => props.theme.mainWhite};
    border-radius: 15px;
  }
  > :nth-child(1) {
    height: 33.333%;
  }
  > :nth-child(2) {
    height: 33.333%;
  }
  > :nth-child(3) {
    height: 33.333%;
  }
`;

const ArticleBox = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 80px);
  width: 100%;
  gap: 10px;
  > :nth-child(1) {
    height: 15%;
  }
  > :nth-child(2) {
    height: 85%;
  }
`;

const HeadBox = styled.div`
  display: flex;
  gap: 10px;
  height: 100%;

  > * {
    background: ${(props) => props.theme.mainWhite};
    padding: 10px 20px 0px 15px;
    text-align: left;
    border-radius: 15px;
    flex: 1;
  }
  > :nth-child(1) {
    flex: 2;
    flex-direction: row;
    justify-content: space-between;
  }
`;

const BodyBox = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 10px;

  > :nth-child(1) {
    height: 50%;
  }
  > :nth-child(2) {
    height: 50%;

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
  gap: 10px;
  height: 100%;
  flex-direction: row;
  > * {
    border-radius: 15px;
  }
  > :nth-child(1) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

    background: ${(props) => props.theme.mainWhite};
  }
`;

const HorizontalBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  > * {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    border-radius: 15px;
    background: ${(props) => props.theme.mainWhite};
  }
`;

const SpeakerSelectBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
  align-items: flex-end;
`;

const DashboardSection = () => {
  const dispatch = useDispatch();

  const analyzedMessages = useSelector(
    (state: { analyzedMessagesSlice: AnalyzedMessage[] }) => state.analyzedMessagesSlice
  );
  const selectedChatRoomIndex = useSelector(
    (state: { selectedRoomIndexSlice: number }) => state.selectedRoomIndexSlice
  );
  const mostChattedTimes = useSelector(
    (state: { mostChattedTimesSlice: StringNumberTuple[] }) => state.mostChattedTimesSlice
  );
  const selectedSpeakerIndex = useSelector(
    (state: { selectedSpeakerIndexSlice: number }) => state.selectedSpeakerIndexSlice
  );

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentModalData, setCurrentModalData] = useState<any>();

  const speakers: string[][] = getSpeakers(analyzedMessages);
  const chatTimes: ChatTimes[][][] = getChatTimes(analyzedMessages);
  const totalChatCounts: number[] = getTotalChatCounts(chatTimes);

  const handleChangeSpeaker = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value !== "전체") {
      dispatch(setSelectedSpeakerIndex(Number(e.target.value)));
    } else {
      dispatch(setSelectedSpeakerIndex(-1));
    }
  };

  useEffect(() => {
    scrollToEvent(0, "auto");
  }, []);

  const graphContentData = [
    {
      id: 0,
      subject: "대화 비율",
      graph: <ChatRatioWithArrowGraph />,
      setIsModalVisible,
      setCurrentModalData,
    },
    {
      id: 1,
      subject: "종합 비교",
      graph: <ChatRoomCompareGraph />,
      setIsModalVisible,
      setCurrentModalData,
    },
    {
      id: 2,
      subject: "기간 대화량",
      graph: <ChatVolumeByPeriodGraph />,
      setIsModalVisible,
      setCurrentModalData,
    },
    {
      id: 3,
      subject: "대화 비율",
      graph: <ChatRateGraph />,
      setIsModalVisible,
      setCurrentModalData,
    },
    {
      id: 4,
      subject: "시간대별 답장 횟수",
      graph: <ReplyCountByHourlyGraph />,
      setIsModalVisible,
      setCurrentModalData,
    },
    {
      id: 5,
      subject: "키워드",
      graph: <KeywordChartGraph />,
      setIsModalVisible,
      setCurrentModalData,
    },
    {
      id: 6,
      subject: "답장속도",
      graph: <ReplySpeedGraph />,
      setIsModalVisible,
      setCurrentModalData,
    },
    {
      id: 7,
      subject: "시간대별 대화량",
      graph: <ChatVolumeByHourlyGraph />,
      setIsModalVisible,
      setCurrentModalData,
    },
  ];

  const HeaderData = [
    {
      id: "speakerCount",
      headerTitle: "대화자 수",
      headerContent: ` ${speakers[selectedChatRoomIndex]?.length || 0}`,
    },
    {
      id: "totalChatCount",
      headerTitle: "총 대화수",
      headerContent: `${totalChatCounts[selectedChatRoomIndex]?.toLocaleString() || 0}`,
    },
    {
      id: "mostChatTime",
      headerTitle: "주 대화 시간대",
      headerContent: `${mostChattedTimes[selectedChatRoomIndex]?.[0]?.[0] || 0}` + "시",
    },
  ];

  return (
    <DashboardTemplateContainer>
      <AsideBox>
        {graphContentData.slice(1, 4).map((data) => {
          return <GraphDisplay data={data} key={data.id} />;
        })}
      </AsideBox>
      <ArticleBox>
        <HeadBox>
          <DashboardContainer>
            <GraphDisplay data={graphContentData[0]} />
            <SpeakerSelectBox>
              <Span color="#7e848a">강조할 대화자</Span>
              <select
                value={selectedSpeakerIndex === -1 ? "전체" : selectedSpeakerIndex}
                onChange={handleChangeSpeaker}
              >
                <option value="전체" key="전체">
                  전체
                </option>
                {speakers[selectedChatRoomIndex]?.map((speaker, index) => {
                  const displayName = speaker.length > 6 ? speaker.substring(0, 6) + "..." : speaker;
                  return (
                    <option value={index} key={index}>
                      {displayName}
                    </option>
                  );
                })}
              </select>
              <Span fontSize="11px" color="#0D6EFD">
                각 대화자의 분석이 가능합니다
              </Span>
            </SpeakerSelectBox>
          </DashboardContainer>
          {HeaderData.map((data) => {
            return (
              <DashboardContainer>
                <DashboardHeaderContent data={data} key={data.id} />
              </DashboardContainer>
            );
          })}
        </HeadBox>
        <BodyBox>
          <VerticalBox>
            <GraphDisplay data={graphContentData[6]} />
          </VerticalBox>
          <VerticalBox>
            <HorizontalBox>
              <GraphDisplay data={graphContentData[7]} />
            </HorizontalBox>
            <HorizontalBox>
              {graphContentData.slice(4, 6).map((data) => {
                return <GraphDisplay data={data} key={data.id} />;
              })}
            </HorizontalBox>
          </VerticalBox>
        </BodyBox>
      </ArticleBox>
      {isModalVisible && (
        <DetailGraphModalForSquare
          setIsModalVisible={setIsModalVisible}
          currentModalData={currentModalData}
          setCurrentModalData={setCurrentModalData}
        />
      )}
    </DashboardTemplateContainer>
  );
};

export default DashboardSection;
