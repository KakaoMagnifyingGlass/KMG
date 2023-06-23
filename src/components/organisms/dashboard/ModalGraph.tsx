import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Span from "../../atoms/Span";
import Icon from "../../atoms/Icon";
import ChatRatioWithArrowGraph from "../../molecules/graphs/ChatRatioWithArrowGraph";
import SpeakerSelect from "../../molecules/dashboard/SpeakerSelect";
import { useLocation } from "react-router";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { AnalyzedMessage } from "../../../@types/index.d";
import { getDates } from "../../../module/common/getProperties";
import { setIsModalVisible } from "../../../store/reducer/dashboard/isModalVisibleSlice";
import { graphContentData } from "../../pages/DetailPage";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { FlexCenterDiv } from "../../atoms/FlexDiv";
import Paragraph from "../../atoms/Paragraph";

const ModalGraphBox = styled.div`
  padding: 20px 20px 30px 20px;
  width: 100%;
  height: 100%;
  background: ${(props) => props.theme.modalBackground};
  backdrop-filter: blur(80px);
  box-shadow: 2px 2px 8px -3px ${(props) => props.theme.mainBlack};
  border-radius: 15px;
  @media (max-width: 480px) {
    padding: 15px 10px 30px 10px;
  }
`;

const CloseModalIcon = styled(Icon)`
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 24px;
  color: ${(props) => props.theme.mainText};
  cursor: pointer;
`;

const ContentBox = styled.div`
  display: flex;
  gap: 15px;
  width: 100%;
  height: 100%;
`;

const GraphContentBox = styled.div`
  position: relative;
  width: 75%;
  height: 100%;
`;

const DescriptionBox = styled.div`
  width: 25%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 0px 10px 15px;
`;

const InfoContentBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const SubjectBox = styled(FlexCenterDiv)`
  justify-content: space-between;
  min-width: 177px;
  > * {
    display: flex;
    align-items: center;
    height: 40px;
  }
`;

const FlipModalGraphIcon = styled(Icon)`
  font-size: 24px;
  cursor: pointer;
`;

const SpeakerSelectBox = styled.div`
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;

  > * {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
  }
  > :nth-child(1) {
    margin-bottom: 5px;
  }
  > :nth-child(2) {
    > :nth-child(1) {
      display: none;
    }
  }
`;

const PeriodBox = styled.div`
  margin-bottom: 10px;
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  text-align: center;
  color: ${(props) => props.theme.mainText};
  border-top: 1px solid ${(props) => props.theme.mainGray};
  border-bottom: 1px solid ${(props) => props.theme.mainGray};
  font-weight: 500;
`;
const Description = styled.div<{
  fontSize?: string;
}>`
  width: 100%;
  height: 100%;
  > :first-child {
    font-size: ${(props) => props.fontSize || "2.6em"};
    margin-bottom: 15px;
    font-weight: 500;
  }
  > :nth-child(2) {
    font-size: ${(props) => props.fontSize || "1.8em"};
    margin-bottom: 25px;
  }
  > :last-child {
    font-size: ${(props) => props.fontSize || "1.6em"};
    font-weight: 300;
  }
`;
const CardContentBox = styled.div`
  padding: 15px 0;
  display: flex;
  flex-direction: column;
  text-align: start;
  color: ${(props) => props.theme.mainText};
  > :first-child {
    > :nth-child(2) {
      display: none;
    }
  }
`;

const ResponsiveContentBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 15px;
  > :nth-child(1) {
    flex: 1;
  }
  > :nth-child(2) {
    flex: 6;
  }
`;

const ResponsiveHeadBox = styled.div`
  padding: 0 12px;
  display: flex;
  align-items: center;
  height: 100%;
  > * {
    flex: 1;
    height: 100%;
  }
  > :nth-child(1) {
    align-items: start;
    justify-content: center;
    > :nth-child(1) {
      @media (max-width: 480px) {
        font-size: 16px;
      }
    }
    > :nth-child(2) {
      height: 60px;
      @media (max-width: 480px) {
        height: 22px;
      }
    }
  }
  > :nth-child(2) {
    display: flex;
    flex-direction: column;
    margin-left: auto;

    > :nth-child(1) {
      justify-content: end;
      width: 100%;
      margin-right: 12px;
      @media (max-width: 480px) {
        margin-bottom: 5px;
        margin-right: 0;
      }
    }
    > :nth-child(2) {
      justify-content: end;
      align-items: end;
      width: 100%;
      margin-right: 19px;

      @media (max-width: 480px) {
        margin: 0 auto;
      }
    }
    > * {
      > * {
        @media (max-width: 480px) {
          margin-left: 0 auto;
        }
      }
      @media (max-width: 480px) {
        margin: 0 auto;
      }
    }
  }
  /* @media (max-width: 480px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-left: 0 auto;
  } */
`;

const ResponsivePeriodBox = styled.div`
  font-size: 16px;
  margin-bottom: 5px;
`;

const ResponsiveSubjectBox = styled.div`
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  @media (max-width: 480px) {
    align-items: center;
  }
`;

const ResponsiveParagraphBox = styled.div`
  margin-left: 10px;
  padding: 0 12px;
  text-align: start;
`;

const ResponsiveGraphContentBox = styled.div`
  position: relative;
  height: calc(100% - 119px);
  width: 100%;
`;

interface ModalGraphProps {
  currentModalData: {
    id?: number;
    subject?: string;
    graph: any;
    h2: string;
    h3: string;
    p: string;
    fontSize?: any;
  };
  modalSetProps?: (data: any) => void;
}

const ModalGraph = ({ currentModalData, modalSetProps }: ModalGraphProps) => {
  const isDetailPage = useLocation().pathname.includes("detail");

  const dispatch = useDispatch();

  const { subject, graph, h2, h3, p } = currentModalData;

  const results = useSelector(
    (state: { analyzedMessagesSlice: AnalyzedMessage[] }) => state.analyzedMessagesSlice
  );
  const selectedChatRoomIndex = useSelector(
    (state: { selectedRoomIndexSlice: number }) => state.selectedRoomIndexSlice
  );
  const chatDates = getDates(results)[selectedChatRoomIndex];
  const datePickerPeriodData = [chatDates.flat()[0], chatDates.flat().slice(-1)[0]];

  const handleClickCloseModalButton = () => {
    setIsModalVisible && dispatch(setIsModalVisible(false));
  };

  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  const handleResize = () => {
    setScreenWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const findModalDataById = (id: number) => {
    if (id === 0) {
      return graphContentData.find((item) => item.id === graphContentData.length);
    } else if (id > graphContentData.length) {
      return graphContentData.find((item) => item.id === 1);
    } else {
      return graphContentData.find((item) => item.id === id);
    }
  };

  const handleClickFlipGraphButton = (nextId: number) => {
    const toFlipModalData = findModalDataById(nextId);
    if (modalSetProps && toFlipModalData) {
      modalSetProps(toFlipModalData);
    }
  };

  return (
    <ModalGraphBox className="GraphContentBox">
      {isDetailPage ? null : (
        <CloseModalIcon onClick={() => handleClickCloseModalButton()}>
          <MdClose />
        </CloseModalIcon>
      )}
      {screenWidth > 1200 ? (
        <ContentBox>
          <GraphContentBox className="GraphContentBox">{graph}</GraphContentBox>
          <DescriptionBox>
            <InfoContentBox>
              <SubjectBox>
                <FlipModalGraphIcon
                  onClick={() =>
                    currentModalData.id && handleClickFlipGraphButton(currentModalData.id - 1)
                  }
                >
                  {!isDetailPage && <BsChevronLeft />}
                </FlipModalGraphIcon>
                <Span fontSize="26px" fontWeight="500" textAlign="center">
                  {h2}
                </Span>
                <FlipModalGraphIcon
                  fontSize="24px"
                  onClick={() =>
                    currentModalData.id && handleClickFlipGraphButton(currentModalData.id + 1)
                  }
                >
                  {!isDetailPage && <BsChevronRight />}
                </FlipModalGraphIcon>
              </SubjectBox>
              {subject === "종합 비교" ? (
                <SpeakerSelectBox></SpeakerSelectBox>
              ) : (
                <SpeakerSelectBox>
                  <ChatRatioWithArrowGraph />
                  <SpeakerSelect />
                </SpeakerSelectBox>
              )}

              <PeriodBox>
                {datePickerPeriodData[0]} ~ {datePickerPeriodData[1]}
              </PeriodBox>
            </InfoContentBox>
            <CardContentBox>
              <Description>
                <Paragraph lineHeight="1.5em">{p}</Paragraph>
              </Description>
            </CardContentBox>
          </DescriptionBox>
        </ContentBox>
      ) : (
        <ResponsiveContentBox>
          <ResponsiveHeadBox>
            <ResponsiveSubjectBox>
              <ResponsivePeriodBox>
                {datePickerPeriodData[0]} ~ {datePickerPeriodData[1]}
              </ResponsivePeriodBox>
              <SubjectBox>
                <FlipModalGraphIcon
                  onClick={() =>
                    currentModalData.id && handleClickFlipGraphButton(currentModalData.id - 1)
                  }
                >
                  {!isDetailPage && <BsChevronLeft />}
                </FlipModalGraphIcon>
                <Span fontWeight="500" textAlign="center" fontSize="26px" responsiveFontSize="20px">
                  {h2}
                </Span>
                <FlipModalGraphIcon
                  onClick={() =>
                    currentModalData.id && handleClickFlipGraphButton(currentModalData.id + 1)
                  }
                >
                  {!isDetailPage && <BsChevronRight />}
                </FlipModalGraphIcon>
              </SubjectBox>
            </ResponsiveSubjectBox>

            {subject === "종합 비교" ? (
              <SpeakerSelectBox></SpeakerSelectBox>
            ) : (
              <SpeakerSelectBox>
                <ChatRatioWithArrowGraph />
                <SpeakerSelect />
              </SpeakerSelectBox>
            )}
          </ResponsiveHeadBox>
          <ResponsiveGraphContentBox className="GraphContentBox">{graph}</ResponsiveGraphContentBox>
          {/* <ResponsiveParagraphBox>
            <Span fontSize="18px">{p}</Span>
          </ResponsiveParagraphBox> */}
        </ResponsiveContentBox>
      )}
    </ModalGraphBox>
  );
};

export default ModalGraph;
