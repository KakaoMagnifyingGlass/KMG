import React, { useState, useEffect } from "react";
import styled from "styled-components";
import AttachmentButton from "../../atoms/AttachmentButton";
import Paragraph from "../../atoms/Paragraph";
import OsList from "./OsList";
import { FlexCenterDiv, FlexColumnCenterDiv } from "../../atoms/FlexDiv";
import { borderRadius } from "../../../style/specifiedCss/borderRadius";
import BlueButton from "../../atoms/BlueButton";

const DropBox = styled(FlexColumnCenterDiv)`
  position: relative;
  width: 80%;
  height: 420px;
  padding: 8rem 2rem;
  margin: 0 auto 30px auto;
  width: 80%;
  border: 2px dashed var(--mainGray);
  border-radius: ${borderRadius.strong};

  > * {
    margin-bottom: 10px;
    font-weight: 300;
  }
`;

const OsListBox = styled.div`
  margin-bottom: 3rem;
`;

const TextContentBox = styled(FlexColumnCenterDiv)``;

const AttachGuide = styled(FlexColumnCenterDiv)`
  margin-bottom: 1.5rem;
`;

const AttachmentBox = styled(FlexCenterDiv)`
  margin-bottom: 1rem;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  gap: 5px;

  > * {
    width: calc(50% - 5px);
  }
`;

const Notice = styled(Paragraph)`
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--mainBlueHover);
`;

const DownloadTestFileButton = styled(FlexCenterDiv)`
  padding: 1.5rem 3rem;
  font-size: 1.6rem;
  font-weight: 500;
  color: #fff;
  background: var(--mainBlue);
  border-radius: ${borderRadius.weak};
  transition: background 0.3s;
  word-break: keep-all;
  cursor: pointer;

  &:hover {
    background: var(--mainBlueHover);
  }
`;

type DropZoneProps = {
  handleChangeFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const FileDrop = ({ handleChangeFile }: DropZoneProps) => {
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  const handleResize = () => {
    setScreenWidth(window.innerWidth);
  };

  const clickDownloadTestFile = (e: React.MouseEvent<HTMLAnchorElement>) => {
    var confirmed = window.confirm("테스트용 텍스트 파일(MacOS)을 다운로드하시겠습니까?");
    if (!confirmed) {
      e.preventDefault(); // 다운로드 취소
    } else {
      window.alert("파일 다운로드가 실행되었습니다.");
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <DropBox>
      <OsListBox>
        <OsList />
      </OsListBox>
      <TextContentBox>
        {screenWidth > 769 ? (
          <AttachGuide>
            <Paragraph>카카오톡 텍스트 파일을 드래그하여 끌어 놓거나,</Paragraph>
            <Paragraph>아래의 파일 첨부하기 버튼을 눌러 카카오톡 대화 파일을 첨부해주세요.</Paragraph>
          </AttachGuide>
        ) : (
          <AttachGuide>
            <Paragraph>아래의 파일 첨부하기 버튼을 눌러 카카오톡 대화 파일을 첨부해주세요.</Paragraph>
          </AttachGuide>
        )}
        <AttachmentBox>
          <DownloadTestFileButton
            as="a"
            href="https://docs.google.com/uc?export=download&id=1VOWOaMGSOnCS9_sIq0tsA1DdCcMIIkD4&confirm=t"
            onClick={clickDownloadTestFile}
          >
            다운로드 테스트 파일 (MacOS)
          </DownloadTestFileButton>
          <AttachmentButton onChange={handleChangeFile}>파일 첨부하기</AttachmentButton>
        </AttachmentBox>
      </TextContentBox>
      <Notice>* 올바른 운영체제를 선택하지 않으면 분석이 불가능합니다.</Notice>
    </DropBox>
  );
};

export default FileDrop;
