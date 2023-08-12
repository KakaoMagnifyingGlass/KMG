import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import scrollToEvent from "../../../module/common/scrollToEvent";
import { AnalyzedMessage, ChatTimes, StringNumberTuple } from "../../../@types/index.d";
import { getChatTimes, getSpeakers } from "../../../module/common/getProperties";
import { getTotalChatCounts } from "../../molecules/graphs/SummaryPieGraph";
import ModalGraph from "../../organisms/dashboard/ModalGraph";
import GraphDisplay from "../../organisms/dashboard/GraphDisplay";
import DashboardHeaderContent from "../../molecules/dashboard/DashboardHeaderContent";
import { setVolumeHourlyBoxSize } from "../../../store/reducer/dashboard/volumeHourlyBoxSizeSlice";
import SpeakerSelect from "../../molecules/dashboard/SpeakerSelect";
import { setIsModalVisible } from "../../../store/reducer/dashboard/isModalVisibleSlice";
import { FlexCenterDiv, FlexColumnDiv } from "../../atoms/FlexDiv";
import { borderRadius } from "../../../style/specifiedCss/borderRadius";
import { zIndex } from "../../../style/specifiedCss/zIndex";

const DashboardSectionContainer = styled(FlexCenterDiv)`
  padding: 10px;
  gap: 10px;
  height: calc(100vh - 80px);
  width: 100%;
  background: var(--dashboardBackground);
  transition: background 0.3s;

  @media (max-width: 1200px) {
    height: calc(100vh - 70px);
    min-width: 1180px;
    min-height: 750px;
  }
`;

const AsideBox = styled(FlexColumnDiv)`
  height: 100%;
  width: 25%;
  gap: 10px;

  > * {
    height: calc((100% - 20px) / 3);
  }
`;

const ArticleBox = styled(FlexColumnDiv)`
  height: 100%;
  width: calc(100% - 25% - 10px);
  gap: 10px;
`;

const HeadBox = styled.div`
  display: flex;
  height: calc((100% - 10px) * 0.15);
  gap: 10px;

  > * {
    background: var(--mainWhite);
    padding: 10px 20px 10px 15px;
    text-align: left;
    border-radius: ${borderRadius.medium};
    flex: 1;
  }
  > :nth-child(1) {
    flex: 1.3;
    flex-direction: row;
  }
`;

const DashboardContainer = styled(FlexColumnDiv)`
  width: 100%;
  height: 100%;
  gap: 15px;
  transition: background 0.3s;
`;

const BodyBox = styled(FlexColumnDiv)`
  gap: 10px;
  height: calc((100% - 10px) * 0.85);
`;

const VerticalBox = styled.div`
  display: flex;
  gap: 10px;
  height: calc((100% - 10px) / 2);
`;

const ReplySpeedGraphBox = styled.div`
  width: 100%;
  height: 100%;
`;

const HorizontalBox = styled(FlexColumnDiv)`
  gap: 10px;
`;

const ReplyCountByHourlyGraphBox = styled(HorizontalBox)`
  width: 60%;
`;

const KeywordGraphBox = styled(HorizontalBox)`
  width: calc(100% - 60% - 10px);
`;

const ModalBox = styled.div`
  position: fixed;
  top: 17%;
  bottom: 10%;
  left: 21%;
  right: 5.5%;
  z-index: ${zIndex.graphModal};
  display: flex;
  @media (max-width: 1200px) {
    left: 5.5%;
  }
`;

const DashboardSection = () => {
  const dispatch = useDispatch();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

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

  const [currentModalData, setCurrentModalData] = useState<any>();

  const speakers: string[][] = getSpeakers(analyzedMessages);
  const chatTimes: ChatTimes[][][] = getChatTimes(analyzedMessages);
  const totalChatCounts: number[] = getTotalChatCounts(chatTimes);

  const HeaderData = [
    {
      id: "selectSpeaker",
      headerTitle: "강조할 대화자",
      headerContent: <SpeakerSelect alignItems="end" />,
    },
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

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  if (!isModalVisible && containerRef?.current?.offsetHeight) {
    dispatch(
      setVolumeHourlyBoxSize([containerRef?.current?.offsetWidth, containerRef?.current?.offsetHeight])
    );
  }

  useEffect(() => {
    dispatch(setIsModalVisible(false));
    scrollToEvent(0, "auto");
  }, []);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (modalRef?.current?.offsetHeight) {
      dispatch(
        setVolumeHourlyBoxSize([
          (modalRef?.current?.offsetWidth * 3) / 4,
          modalRef?.current?.offsetHeight,
        ])
      );
    }
  }, []);

  return (
    <DashboardSectionContainer>
      <AsideBox>
        <GraphDisplay
          displaySubject={"종합 비교"}
          setCurrentModalData={setCurrentModalData}
          zIndex={1}
        />
        <GraphDisplay
          displaySubject={"기간 대화량"}
          setCurrentModalData={setCurrentModalData}
          zIndex={3}
        />
        <GraphDisplay
          displaySubject={"대화 비율"}
          setCurrentModalData={setCurrentModalData}
          zIndex={2}
        />
      </AsideBox>
      <ArticleBox>
        <HeadBox>
          {HeaderData.map((data) => {
            return (
              <DashboardContainer key={data.id}>
                {data.id === "selectSpeaker" && (
                  <GraphDisplay
                    displaySubject={"채팅방 대화 비율"}
                    setCurrentModalData={setCurrentModalData}
                    zIndex={1}
                  />
                )}
                <DashboardHeaderContent data={data} key={data.id} />
              </DashboardContainer>
            );
          })}
        </HeadBox>
        <BodyBox>
          <VerticalBox>
            <ReplySpeedGraphBox>
              <GraphDisplay
                displaySubject={"답장속도"}
                setCurrentModalData={setCurrentModalData}
                zIndex={3}
              />
            </ReplySpeedGraphBox>
          </VerticalBox>
          <VerticalBox>
            <ReplyCountByHourlyGraphBox ref={containerRef}>
              <GraphDisplay
                displaySubject={"시간대별 대화량"}
                zIndex={1}
                setCurrentModalData={setCurrentModalData}
              />
            </ReplyCountByHourlyGraphBox>
            <KeywordGraphBox>
              <GraphDisplay
                displaySubject={"키워드"}
                setCurrentModalData={setCurrentModalData}
                zIndex={1}
              />
            </KeywordGraphBox>
          </VerticalBox>
        </BodyBox>
      </ArticleBox>
      {isModalVisible && currentModalData && (
        <ModalBox ref={modalRef}>
          <ModalGraph currentModalData={currentModalData} setCurrentModalData={setCurrentModalData} />
        </ModalBox>
      )}
    </DashboardSectionContainer>
  );
};

export default DashboardSection;
