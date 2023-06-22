import React, { useState, useEffect } from "react";
import styled from "styled-components";
import AttachmentButton from "../../atoms/AttachmentButton";
import Paragraph from "../../atoms/Paragraph";
import Span from "../../atoms/Span";
import OsList from "./OsList";
import { FlexColumnCenterDiv } from "../../atoms/FlexDiv";

const DropBox = styled(FlexColumnCenterDiv)`
  position: relative;
  width: 80%;
  padding: 8rem 0;
  margin: 0 auto;
  border: 3px dashed ${(props) => props.theme.mainGray};
  border-radius: 30px;

  > * {
    margin-bottom: 10px;
    font-weight: 300;
  }
  > :nth-child(1) {
    margin-bottom: 3rem;
  }
  > :last-child {
    color: ${(props) => props.theme.mainGray};
    margin-bottom: 0px;
  }
  @media (max-width: 768px) {
    padding: 4rem 3rem;
  }
`;

const AttachmentBox = styled.div`
  margin-bottom: 1rem;
  display: flex;
  gap: 5px;
`;

const TextContentBox = styled(FlexColumnCenterDiv)``;

const AttachGuide = styled(FlexColumnCenterDiv)`
  margin-bottom: 1.5rem;
`;

const DragFile = styled(FlexColumnCenterDiv)`
  /* position: absolute; */
  display: flex;
  width: 100%;
  height: 100%;
  gap: 20px;
  background: #f00;
`;

type DropZoneProps = {
  handleChangeFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const FileDrop = ({ handleChangeFile }: DropZoneProps) => {
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

  return (
    <DropBox>
      <OsList />
      {screenWidth > 769 ? (
        <TextContentBox>
          <AttachGuide>
            <Paragraph>카카오톡 텍스트 파일을 드래그하여 끌어 놓거나,</Paragraph>
            <Paragraph>아래의 파일 첨부하기 버튼을 눌러 카카오톡 대화 파일을 첨부해주세요.</Paragraph>
          </AttachGuide>

          <AttachmentBox>
            <AttachmentButton onChange={handleChangeFile}>파일 첨부하기</AttachmentButton>
          </AttachmentBox>
        </TextContentBox>
      ) : (
        <TextContentBox>
          <AttachGuide>
            <Paragraph>아래의 파일 첨부하기 버튼을 눌러 카카오톡 대화 파일을 첨부해주세요.</Paragraph>
          </AttachGuide>
          <AttachmentBox>
            <AttachmentButton onChange={handleChangeFile}>파일 첨부하기</AttachmentButton>
          </AttachmentBox>
        </TextContentBox>
      )}
      <Span fontSize="15px">* 올바른 운영체제를 선택하지 않으면 분석이 불가능합니다.</Span>
    </DropBox>
  );
};

export default FileDrop;
