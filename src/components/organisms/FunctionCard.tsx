import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import H2 from "../atoms/H2";
import H3 from "../atoms/H3";
import Img from "../atoms/Img";
import Paragraph from "../atoms/Paragraph";
import CardContent from "../molecules/CardContent";
import SlideBtn from "../molecules/SlideBtn";

const Container = styled.div`
  padding: 100px 20px;
  @media (max-width: 768px) {
    padding: 50px 20px;
  }
`;

const Card = styled.div`
  position: relative;
  width: 100%;
  max-width: 1200px;
  display: flex;
  border-radius: 10px;
  margin: 0 auto;
  height: 500px;
  box-shadow: 2px 0px 10px 0px #ddd;
  background-color: ${(props) => props.theme.mainWhite};
  overflow: hidden;
  @media (max-width: 768px) {
    flex-direction: column;
    margin-top: 100px;
  }

  &.dark {
    box-shadow: none;
    background: #eeeeee;
  }
`;

const SideSlide = styled.div`
  width: 50%;
  height: 100%;
  transition: transform 0.5s ease-in-out;
  /* > * {
    background-color: #ff0;
  } */
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const SideContent = styled.div`
  width: 100%;
  height: 100%;
  border-right: 1px solid ${(props) => props.theme.mainGray};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  @media (max-width: 768px) {
    padding: 50px;
    border-right: none;
  }
  @media (max-width: 320px) {
    padding: 20px;
  }
  > :nth-child(1) {
    display: none;
    @media (max-width: 768px) {
      display: block;
      font-size: 1.3em;
      margin-bottom: 10px;
    }
  }
  > :nth-child(2) {
    display: none;

    @media (max-width: 768px) {
      display: block;
      font-size: 1.1em;
      margin-bottom: 30px;
    }
  }
  > :nth-child(3) {
    width: 100%;
    height: 100%;
    object-fit: contain;
    @media (max-width: 768px) {
      width: 50%;
      height: 50%;
    }
  }

  > :nth-child(4) {
    display: none;
    @media (max-width: 768px) {
      display: block;
      white-space: normal;
      word-wrap: break-word;
      word-break: break-all;
      line-height: 1.3;
      word-spacing: 3px;
      font-size: 0.9em;
    }
    @media (max-width: 600px) {
      padding-bottom: 50px;
    }
  }
`;

const MainSlide = styled.div`
  width: 50%;
  height: 100%;
  transition: transform 0.5s ease-in-out;
  color: ${(props) => props.theme.mainBlack};
  @media (max-width: 768px) {
    display: none;
  }
  > * {
    display: flex;
    flex-direction: column;
    align-items: left;
    justify-content: center;
    padding: 10%;
    @media (max-width: 768px) {
      padding: 30px;
      text-align: center;
    }
  }
`;
const SlideBox = styled.div`
  cursor: pointer;
  z-index: 100;

  > * {
    padding: 10px;
    color: ${(props) => props.theme.functionArrowWhite};
    position: absolute;
    right: 50%;
    bottom: 5%;
    background-color: ${(props) => props.theme.mainBlue};
  }
  > :first-child {
    border-top-right-radius: 20%;
    border-bottom-right-radius: 20%;
    transform: scaleY(-1) translateX(44px);
    @media (max-width: 768px) {
      bottom: 30px;
    }
    &:hover {
      background: ${(props) => props.theme.mainBlueHover};
    }
  }
  > :last-child {
    border-top-left-radius: 20%;
    border-bottom-left-radius: 20%;
    @media (max-width: 768px) {
      bottom: 30px;
    }
    &:hover {
      background: ${(props) => props.theme.mainBlueHover};
    }
  }
`;
interface Props {
  moveScrollPosition: React.MutableRefObject<HTMLDivElement | null>;
}

const functionCardData = [
  {
    id: 1,
    subject: "종합 비교",
    h3: "대화 데이터를 종합적으로 분석한 결과를 시각화하여 보여주는 화면",
    p: "대화 로그 데이터를 종합적으로 분석한 결과를 시각화하여 보여주는 화면입니다. 대화량, 대화 시간대, 답장 속도, 대화 키워드 등 다양한 정보를 종합하여 분석한 결과를 그래프, 차트, 표 등 다양한 방식으로 표시합니다.",
    img: `${process.env.PUBLIC_URL}/images/ChatRoomCompareGraph.jpg`,
  },
  {
    id: 2,
    subject: "기간 대화량",
    h3: "대화 활동의 기간별 분포에 따라 시각화하여 보여주는 그래프",
    p: "각 기간에 대한 대화량을 시각적으로 표현하여, 대화 활동이 어느 기간에 집중되어 있는지 알 수 있습니다. 이를 통해 특정 기간에 대화가 활발하게 이루어지는 경향이나 트렌드를 파악할 수 있습니다.",
    img: `${process.env.PUBLIC_URL}/images/ChatVolumeByPeriodGraph.jpg`,
  },
  {
    id: 3,
    subject: "대화 비율",
    h3: "대화 참여자별 대화량의 변화를 시간에 따라 시각화하여 보여주는 그래프",
    p: "대화에 참여한 인원들 간의 대화량을 나타냅니다. 이를 통해 각각의 인원이 대화에 얼마나 기여하였는지, 대화량이 많은 인원이 어느 정도인지 등을 파악할 수 있습니다.",
    img: `${process.env.PUBLIC_URL}/images/ChatRateGraph.jpg`,
  },

  {
    id: 4,
    subject: "키워드",
    h3: "대화 내용에서 빈도수가 높은 단어를 추출하여 시각화하여 보여주는 워드 클라우드",
    p: "대화 내용에서 자주 등장하는 단어나 문구를 나타냅니다. 이를 통해 대화의 주요 주제나 키워드를 파악할 수 있으며, 이를 활용하여 대화의 내용을 더욱 효율적으로 파악하고 관리할 수 있습니다.",
    img: `${process.env.PUBLIC_URL}/images/keywordGraph.jpg`,
  },
  {
    id: 5,
    subject: "답장속도",
    h3: "대화 참여자별  평균 답장 속도를 시각화하여 보여주는 그래프",
    p: "상대방이 보낸 메시지에 대한 본인의 답장 속도를 나타냅니다. 이를 통해 메시지에 대한 대응속도가 어느정도인지, 더 빠른 대응이 필요한 상황이 있는지 등을 파악할 수 있습니다.",
    img: `${process.env.PUBLIC_URL}/images/ReplySpeedGraph.jpg`,
  },
  {
    id: 6,
    subject: "시간대별 대화량",
    h3: "대화가 활발히 이루어진 시간대를 시각화하여 보여주는 그래프",
    p: "대화가 발생한 시간대를 나타냅니다. 이를 통해 대화가 활발히 이루어지는 시간대, 그리고 상대방과의 대화 타이밍을 파악할 수 있습니다.",
    img: `${process.env.PUBLIC_URL}/images/ChatVolumeByHourlyGraph.jpg`,
  },
];

const FunctionCard = ({ moveScrollPosition }: Props) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const slideCount = 6; // 슬라이드 개수

  const handleSlideChange = (direction: string) => {
    if (direction === "next") {
      setActiveSlideIndex((prevIndex) => (prevIndex + 1) % slideCount);
    } else if (direction === "prev") {
      setActiveSlideIndex((prevIndex) => (prevIndex - 1 + slideCount) % slideCount);
    }
  };

  const isDarkMode = useSelector((state: { isDarkModeSlice: boolean }) => state.isDarkModeSlice);

  return (
    <Container ref={moveScrollPosition}>
      <Card className={` ${isDarkMode ? "dark" : ""}`}>
        <SideSlide style={{ transform: `translateY(-${activeSlideIndex * 100}%)` }}>
          {functionCardData.map((data) => (
            <SideContent>
              <H2>{data.subject}</H2>{" "}
              <H3 fontSize="24px" lineHeight="1.5">
                {data.h3}{" "}
              </H3>
              <Img src={data.img} />
              <Paragraph>{data.p}</Paragraph>
            </SideContent>
          ))}
        </SideSlide>
        <MainSlide style={{ transform: `translateY(-${activeSlideIndex * 100}%)` }}>
          {functionCardData.map((data, index) => (
            <CardContent key={index} h2={data.subject} h3={data.h3} p={data.p} />
          ))}
        </MainSlide>
        <SlideBox>
          <SlideBtn onClick={() => handleSlideChange("next")} direction={"down"} />
          <SlideBtn onClick={() => handleSlideChange("prev")} direction={"up"} />
        </SlideBox>
      </Card>
    </Container>
  );
};

export default FunctionCard;
