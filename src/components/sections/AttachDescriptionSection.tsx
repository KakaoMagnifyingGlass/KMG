import React, { useState } from "react";
import styled from "styled-components";
import BlueButton from "../atoms/BlueButton";
import Paragraph from "../atoms/Paragraph";
import ThreeImages, { CardData } from "../organisms/ThreeImages";
import scrollToEvent from "../../module/common/scrollEvent";
import { FlexColumnCenterDiv } from "../atoms/FlexDiv";

const AttachDescriptionBox = styled(FlexColumnCenterDiv)`
  padding: 80px 0;

  > * {
    margin-bottom: 20px;
    font-weight: 300;
  }
`;

const WayParagraph = styled(Paragraph)`
  margin-bottom: 60px;

  @media (max-width: 480px) {
    font-size: 1.5em;
  }
`;

const ButtonBox = styled.div`
  padding-bottom: 60px;
  display: flex;
  gap: 30px;

  > * {
    @media (max-width: 480px) {
      padding: 15px 0;
      width: 140px;
    }
  }
`;

const mobileCardData = [
  {
    src: process.env.PUBLIC_URL + "/images/attachmentMethod/android_method01.png",
    text: "메뉴의 톱니바퀴를 클릭합니다.",
  },
  {
    src: process.env.PUBLIC_URL + "/images/attachmentMethod/android_method02.png",
    text: "대화내용 내보내기를 눌러 저장을 합니다.",
  },
  {
    src: process.env.PUBLIC_URL + "/images/attachmentMethod/android_method03.png",
    text: "파일에서 kakao를 검색하여 찾을 수 있습니다.",
  },
];

const pcCardData = [
  {
    src: process.env.PUBLIC_URL + "/images/attachmentMethod/pc_method01.png",
    text: "Mac OS: 메뉴 - 채팅방 설정 - 대화 내용 저장",
  },
  {
    src: process.env.PUBLIC_URL + "/images/attachmentMethod/pc_method02.png",
    text: "Window : 메뉴 - 대화내용 - 내보내기",
  },
  {
    src: process.env.PUBLIC_URL + "/images/attachmentMethod/pc_method03.png",
    text: "대화 내보내기 완료를 확인합니다.",
  },
];

const AttachmentDescriptionSection = () => {
  const [cardData, setCardData] = useState<CardData[]>(pcCardData);
  return (
    <AttachDescriptionBox id="attachMethod">
      <WayParagraph fontSize="24px">
        현재 실행하고 있는 기기에서 카카오톡 메시지 내보내기 방법 알아보기
      </WayParagraph>
      <ButtonBox>
        <BlueButton onClick={() => setCardData(pcCardData)}>PC</BlueButton>
        <BlueButton onClick={() => setCardData(mobileCardData)}>모바일</BlueButton>
      </ButtonBox>
      <ThreeImages srcAndText={cardData} />
      <BlueButton onClick={() => scrollToEvent(0, "smooth")}>분석하러 가기</BlueButton>
    </AttachDescriptionBox>
  );
};

export default AttachmentDescriptionSection;
