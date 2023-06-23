import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import scrollToEvent from "../../module/common/scrollToEvent";
import { AnalyzedMessage, ChatTimes, StringNumberTuple } from "../../@types/index.d";
import { getChatTimes, getSpeakers } from "../../module/common/getProperties";
import { getTotalChatCounts } from "../molecules/graphs/SummaryPieGraph";
import ModalGraph from "../organisms/ModalGraph";
import GraphDisplay from "../organisms/GraphDisplay";
import DashboardHeaderContent from "../molecules/DashboardHeaderContent";
import { setVolumeHourlyBoxSize } from "../../store/reducer/volumeHourlyBoxSizeSlice";
import SpeakerSelect from "../molecules/SpeakerSelect";

const DashboardSectionContainer = styled.div`
  padding: 10px;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  text-align: center;
  gap: 10px;
  height: calc(100vh - 80px);
  width: 100%;
  background: ${(props) => props.theme.dashboardBackground};
`;

const AsideBox = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 25%;
  gap: 10px;

  > * {
    height: calc((100% - 20px) / 3);
  }
`;

const ArticleBox = styled.div`
  height: 100%;
  width: calc(100% - 25% - 10px);
  display: flex;
  flex-direction: column;
  gap: 10px;

  /* <HeadBox> */
  > :first-child {
    height: calc((100% - 10px) * 0.15);
  }
  /*  <BodyBox> */
  > :last-child {
    height: calc((100% - 10px) * 0.85);
  }
`;

const HeadBox = styled.div`
  display: flex;
  gap: 10px;

  > * {
    background: ${(props) => props.theme.mainWhite};
    padding: 10px 20px 10px 15px;
    text-align: left;
    border-radius: 15px;
    flex: 1;
  }
  > :nth-child(1) {
    flex: 1.3;
    flex-direction: row;
    > :nth-child(1) {
      padding: 0;
    }
    /* 대화자 선택 그래프 */
    > :nth-child(1) {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
    }
  }
`;

const DashboardContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const BodyBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  > * {
    height: calc((100% - 10px) / 2);
  }
  > :nth-child(2) {
    > :nth-child(1) {
      width: 60%;
    }
    > :nth-child(2) {
      width: calc(100% - 60% - 10px);
    }
  }
`;

const VerticalBox = styled.div`
  display: flex;
  gap: 10px;
`;

const HorizontalBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ModalBox = styled.div`
  position: fixed;
  top: 17%;
  bottom: 10%;
  left: 21%;
  right: 5.5%;
  z-index: 999;
  display: flex;
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
  const isModalVisible = useSelector(
    (state: { isModalVisibleSlice: StringNumberTuple[] }) => state.isModalVisibleSlice
  );

  const [currentModalData, modalSetProps] = useState<any>();

  const speakers: string[][] = getSpeakers(analyzedMessages);
  const chatTimes: ChatTimes[][][] = getChatTimes(analyzedMessages);
  const totalChatCounts: number[] = getTotalChatCounts(chatTimes);

  useEffect(() => {
    scrollToEvent(0, "auto");
  }, []);

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
      headerContent: `${mostChattedTimes[selectedChatRoomIndex]?.[0]?.[0] || 0}시`,
    },
  ];

  const containerRef = useRef<HTMLDivElement | null>(null);

  if (!isModalVisible && containerRef?.current?.offsetHeight) {
    dispatch(
      setVolumeHourlyBoxSize([containerRef?.current?.offsetWidth, containerRef?.current?.offsetHeight])
    );
  }

  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (modalRef?.current?.offsetHeight) {
      dispatch(
        setVolumeHourlyBoxSize([
          (modalRef?.current?.offsetWidth * 3) / 4,
          modalRef?.current?.offsetHeight,
        ])
      );
    }
  }, [isModalVisible]);

  // const modalSetProps = { setIsModalVisible, modalSetProps };

  return (
    <DashboardSectionContainer>
      <AsideBox>
        <GraphDisplay displaySubject={"종합 비교"} modalSetProps={modalSetProps} zIndex={1} />
        <GraphDisplay displaySubject={"기간 대화량"} modalSetProps={modalSetProps} zIndex={3} />
        <GraphDisplay displaySubject={"대화 비율"} modalSetProps={modalSetProps} zIndex={2} />
      </AsideBox>
      <ArticleBox>
        <HeadBox>
          <DashboardContainer>
            <GraphDisplay displaySubject={"채팅방 대화 비율"} modalSetProps={modalSetProps} zIndex={1} />
            <SpeakerSelect />
          </DashboardContainer>
          {HeaderData.map((data) => {
            return (
              <DashboardContainer key={data.id}>
                <DashboardHeaderContent data={data} key={data.id} />
              </DashboardContainer>
            );
          })}
        </HeadBox>
        <BodyBox>
          <VerticalBox>
            <GraphDisplay displaySubject={"답장속도"} modalSetProps={modalSetProps} zIndex={3} />
          </VerticalBox>
          <VerticalBox>
            <HorizontalBox ref={containerRef}>
              <GraphDisplay
                displaySubject={"시간대별 대화량"}
                zIndex={1}
                modalSetProps={modalSetProps}
              />
            </HorizontalBox>
            <HorizontalBox>
              <GraphDisplay displaySubject={"키워드"} modalSetProps={modalSetProps} zIndex={1} />
            </HorizontalBox>
          </VerticalBox>
        </BodyBox>
      </ArticleBox>
      {isModalVisible && currentModalData && (
        <ModalBox ref={modalRef}>
          <ModalGraph currentModalData={currentModalData} modalSetProps={modalSetProps} />
        </ModalBox>
      )}
    </DashboardSectionContainer>
  );
};

export default DashboardSection;
