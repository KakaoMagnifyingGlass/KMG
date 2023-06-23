import React, { useState, useEffect } from "react";
import styled from "styled-components";
import AttachmentButton from "../atoms/AttachmentButton";
import Paragraph from "../atoms/Paragraph";
import Span from "../atoms/Span";
import OsList from "./OsList";
import { useDispatch } from "react-redux";
import { pushNewlyAttachedFiles } from "../../store/reducer/attachedFileListSlice";
import { FlexColumnCenterDiv } from "../atoms/FlexDiv";

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
  margin-bottom: 3rem;
  display: flex;
  gap: 5px;
`;

const TextContentBox = styled(FlexColumnCenterDiv)``;

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
          <Span fontSize="18px">카카오톡 텍스트 파일을 드래그하여 끌어 놓거나</Span>
          <AttachmentBox>
            <AttachmentButton onChange={handleChangeFile}>첨부하기</AttachmentButton>
            <Paragraph fontSize="18px">버튼을 클릭하세요.</Paragraph>
          </AttachmentBox>
        </TextContentBox>
      ) : (
        <TextContentBox>
          <Span fontSize="18px">카카오톡 텍스트 파일</Span>
          <AttachmentBox>
            <AttachmentButton onChange={handleChangeFile}>첨부하기</AttachmentButton>
          </AttachmentBox>
        </TextContentBox>
      )}
      <Span fontSize="15px">* 올바른 운영체제를 선택하지 않으면 분석이 불가능합니다.</Span>
    </DropBox>
  );
};

export default FileDrop;
