import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import BlueButton from "../../atoms/BlueButton";
import Paragraph from "../../atoms/Paragraph";
import ThreeImages, { CardData } from "../../organisms/attachment/ThreeImages";
import scrollToEvent from "../../../module/common/scrollToEvent";
import { FlexCenterDiv, FlexColumnCenterDiv } from "../../atoms/FlexDiv";

import { useLocation } from "react-router";

const AttachDescriptionBox = styled(FlexColumnCenterDiv)`
  padding: 80px 0;
`;

const OsButtonBox = styled(FlexCenterDiv)`
  gap: 30px;
  margin-bottom: 30px;
  @media (max-width: 480px) {
    width: calc(100% - 20px);
    gap: 10px;
  }
`;

const TitleParagraph = styled(Paragraph)`
  margin-bottom: 30px;
  padding: 0 10px;
`;

const ThreeImagesBox = styled.div`
  margin-bottom: 15px;
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

  const location = useLocation();
  const isDescriptionIndex = location.hash.includes("description");

  const AttachDescriptionBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDescriptionIndex && AttachDescriptionBoxRef.current) {
      setTimeout(() => {
        scrollToEvent(AttachDescriptionBoxRef.current!.offsetTop - 50, "smooth");
      }, 10);
    }
  }, [location, isDescriptionIndex]);

  return (
    <AttachDescriptionBox id="attachMethod" ref={AttachDescriptionBoxRef}>
      <TitleParagraph fontSize="24px">
        현재 실행하고 있는 기기에서 카카오톡 메시지 내보내기 방법 알아보기
      </TitleParagraph>
      <OsButtonBox>
        <BlueButton onClick={() => setCardData(pcCardData)}>PC</BlueButton>
        <BlueButton onClick={() => setCardData(mobileCardData)}>모바일</BlueButton>
      </OsButtonBox>
      <ThreeImagesBox>
        <ThreeImages srcAndText={cardData} />
      </ThreeImagesBox>
      <BlueButton onClick={() => scrollToEvent(0, "smooth")}>분석하러 가기</BlueButton>
    </AttachDescriptionBox>
  );
};

export default AttachmentDescriptionSection;
