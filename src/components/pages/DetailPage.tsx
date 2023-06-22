import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import scrollToEvent from "../../module/common/scrollToEvent";
import DashboardSideMenu from "../sections/dashboard/DashboardSideMenu";
import ModalGraph from "../organisms/dashboard/ModalGraph";
import ChatRoomCompareGraph from "../molecules/graphs/ChatRoomCompareGraph";
import ChatVolumeByPeriodGraph from "../molecules/graphs/ChatVolumeByPeriodGraph";
import ChatRateGraph from "../molecules/graphs/ChatRateGraph";
import ReplyCountByHourlyGraph from "../molecules/graphs/ReplyCountByHourlyGraph";
import KeywordChartGraph from "../molecules/graphs/KeywordChartGraph";
import ReplySpeedGraph from "../molecules/graphs/ReplySpeedGraph";
import ChatVolumeByHourlyGraph from "../molecules/graphs/ChatVolumeByHourlyGraph";
import { setVolumeHourlyBoxSize } from "../../store/reducer/volumeHourlyBoxSizeSlice";

export const graphContentData = [
  {
    id: 1,
    subject: "종합 비교",
    graph: <ChatRoomCompareGraph />,
    h2: "채팅방 종합 비교",
    h3: "대화 데이터를 종합적으로 분석한 결과를 시각화하여 보여주는 화면",
    p: "대화 로그 데이터를 종합적으로 분석한 결과를 시각화하여 보여주는 화면입니다. 대화량, 대화 시간대, 답장 속도, 대화 키워드 등 다양한 정보를 종합하여 분석한 결과를 그래프, 차트, 표 등 다양한 방식으로 표시합니다.",
  },
  {
    id: 2,
    subject: "기간 대화량",
    graph: <ChatVolumeByPeriodGraph />,
    h2: "기간별 대화량",
    h3: "대화 활동의 기간별 분포에 따라 시각화하여 보여주는 그래프",
    p: "각 기간에 대한 대화량을 시각적으로 표현하여, 대화 활동이 어느 기간에 집중되어 있는지 알 수 있습니다. 이를 통해 특정 기간에 대화가 활발하게 이루어지는 경향이나 트렌드를 파악할 수 있습니다.",
  },
  {
    id: 3,
    subject: "대화 비율",
    graph: <ChatRateGraph />,
    h2: "대화 비율",
    h3: "대화 참여자별 대화량의 변화를 시간에 따라 시각화하여 보여주는 그래프",
    p: "대화에 참여한 인원들 간의 대화량을 나타냅니다. 이를 통해 각각의 인원이 대화에 얼마나 기여하였는지, 대화량이 많은 인원이 어느 정도인지 등을 파악할 수 있습니다.",
  },

  {
    id: 4,
    subject: "키워드",
    graph: <KeywordChartGraph />,
    h2: "카톡 습관",
    h3: "대화 내용에서 빈도수가 높은 단어를 추출하여 시각화하여 보여주는 워드 클라우드",
    p: "대화 내용에서 자주 등장하는 단어나 문구를 나타냅니다. 이를 통해 대화의 주요 주제나 키워드를 파악할 수 있으며, 이를 활용하여 대화의 내용을 더욱 효율적으로 파악하고 관리할 수 있습니다.",
  },
  {
    id: 5,
    subject: "답장속도",
    graph: <ReplySpeedGraph />,
    h2: "답장 속도",
    h3: "대화 참여자별  평균 답장 속도를 시각화하여 보여주는 그래프",
    p: "상대방이 보낸 메시지에 대한 본인의 답장 속도를 나타냅니다. 이를 통해 메시지에 대한 대응속도가 어느정도인지, 더 빠른 대응이 필요한 상황이 있는지 등을 파악할 수 있습니다.",
  },
  {
    id: 6,
    subject: "시간대별 대화량",
    graph: <ChatVolumeByHourlyGraph />,
    h2: "시간대별 대화량",
    h3: "대화가 활발히 이루어진 시간대를 시각화하여 보여주는 그래프",
    p: "대화가 발생한 시간대를 나타냅니다. 이를 통해 대화가 활발히 이루어지는 시간대, 그리고 상대방과의 대화 타이밍을 파악할 수 있습니다.",
  },
];

const GraphDetailContainer = styled.div`
  position: relative;
  margin-top: 80px;
  display: flex;
  width: 100%;
  background: ${(props) => props.theme.mainBackground};
  @media (max-width: 768px) {
    margin-top: 60px;
  }
`;

const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(85% - 30px);

  @media (max-width: 1024px) {
    width: calc(100% - 30px);
  }
`;

const GraphBox = styled.div`
  margin: 15px;
  height: 70vh;
  width: 100%;
  gap: 30px;
  > :nth-child(1) {
    background: ${(props) => props.theme.modalBackground};
  }
  @media (max-width: 768px) {
    height: 70vh;
  }
`;

const DetailPage = () => {
  const isAnalyzedMessagesExist = useSelector(
    (state: { isAnalyzedMessagesExistSlice: boolean }) => state.isAnalyzedMessagesExistSlice
  );

  const dispatch = useDispatch();

  const modalRef = useRef<HTMLDivElement | null>(null);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    scrollToEvent(0, "auto");
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

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <GraphDetailContainer>
      {windowWidth > 1024 && <DashboardSideMenu />}
      <ContentBox>
        {isAnalyzedMessagesExist &&
          graphContentData.map((item) => {
            return (
              <GraphBox ref={modalRef}>
                <ModalGraph currentModalData={item} />
              </GraphBox>
            );
          })}
      </ContentBox>
    </GraphDetailContainer>
  );
};

export default DetailPage;
