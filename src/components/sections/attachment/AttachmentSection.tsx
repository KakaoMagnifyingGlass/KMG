import React, { useRef } from "react";
import styled from "styled-components";
import AttachedFileList from "../../molecules/attachment/AttachedFileList";
import BlueButton from "../../atoms/BlueButton";
import ScrollIndicator from "../../molecules/common/ScrollIndicator";
import FileDrop from "../../organisms/attachment/FileDrop";
import {
  AnalyzedMessage,
  Chatroom,
  FileObject,
  MessageInfo,
  OriginMessageData,
} from "../../../@types/index.d";

import {
  breakdownTxtFileAndroid,
  breakdownTxtFileIOS,
  breakdownTxtFileMacOS,
  breakdownTxtFileWindow,
  readAsDataURL,
} from "../../../module/core/breakdownTxtFile";
import { getMessageData } from "../../../module/core/getMessageData";
import { useDispatch, useSelector } from "react-redux";
import { setAnalyzedMessages } from "../../../store/reducer/dashboard/analyzedMessagesSlice";
import Span from "../../atoms/Span";
import { useNavigate } from "react-router";
import scrollToEvent from "../../../module/common/scrollToEvent";
import { pushNewlyAttachedFiles } from "../../../store/reducer/attachment/attachedFileListSlice";
import { setIsAnalyzedMessagesExist } from "../../../store/reducer/dashboard/isAnalyzedMessagesExistSlice";
import Paragraph from "../../atoms/Paragraph";
import { FlexColumnCenterDiv } from "../../atoms/FlexDiv";
import OsList from "../../organisms/attachment/OsList";

const AttachmentSectionBox = styled(FlexColumnCenterDiv)`
  margin: 80px auto 0 auto;
  padding: 80px 0;
  max-width: 1220px;

  > * + * {
    margin-top: 30px; /* 첫 번째 자식 컴포넌트를 제외한 나머지 자식 컴포넌트에 적용될 간격 */
  }
  @media (max-width: 768px) {
    margin: 60px auto 0 auto;
  }
`;

const ButtonBox = styled.div`
  margin-bottom: 50px;

  > :first-child {
    margin-bottom: 20px;
  }
`;

const OsListBox = styled.div`
  margin: 0 auto;
  padding: 10rem 20px;
  width: 80%;
  max-width: 970px;
  border: 3px dashed ${(props) => props.theme.mainGray};
  border-radius: 30px;
  @media (max-width: 480px) {
    padding: 50px 20px;
  }
  > :nth-child(1) {
    margin-bottom: 30px;
    @media (max-width: 768px) {
      font-size: 1.3em;
    }
    @media (max-width: 480px) {
      font-size: 1.2em;
    }
  }
  > :nth-child(2) {
    margin-bottom: 30px;
  }
  > :nth-child(3) {
    color: ${(props) => props.theme.mainGray};
  }
`;

/**
 * 텍스트 파일을 메시지 데이터로 디코딩합니다.
 * @param {any[]} attachedFileList - 첨부된 파일 배열
 * @returns {Promise<any[]>} - 디코딩된 메시지 데이터 배열을 포함하는 프로미스 객체
 */
const decodeTxtFileIntoMessageData = async (attachedFileList: any[], osIndex: number | null) => {
  const analyzedMessages: MessageInfo[][] = [];
  for (const fileGroup of attachedFileList) {
    const filteredMessages: OriginMessageData[][] = await Promise.all(
      fileGroup.map(async (file: File) => {
        const base64 = await readAsDataURL(file);
        // 여기서 분기점
        // return base64 && breakdownTxtFile(base64);
        if (osIndex === 1) {
          return base64 && breakdownTxtFileWindow(base64);
        }
        if (osIndex === 2) {
          return base64 && breakdownTxtFileMacOS(base64);
        }
        if (osIndex === 3) {
          return base64 && breakdownTxtFileAndroid(base64);
        }
        if (osIndex === 4) {
          return base64 && breakdownTxtFileIOS(base64);
        }
      })
    );
    const messageData = getMessageData(filteredMessages.flat());
    analyzedMessages.push([...messageData]);
  }
  return analyzedMessages;
};

/**
 * 메시지 데이터를 테이블 형태로 변환합니다.
 * @param {any[]} analyzedMessages - 분석된 메시지 데이터 배열
 * @returns {AnalyzedMessage[][][]} - 테이블 형태로 변환된 분석된 메시지 데이터
 */
const transformIntoTableForm = (analyzedMessages: any[]) => {
  const analyzedMessageData: AnalyzedMessage[][][] = analyzedMessages.map((chatRooms: Chatroom[]) => {
    return chatRooms.map((chatRoom: Chatroom) => {
      const { speaker, dates } = chatRoom;
      return dates.map((date: MessageInfo) => {
        return {
          speaker: speaker,
          date: date.date,
          chatTimes: date.data.chatTimes,
          keywordCounts: date.data.keywordCounts,
          replyTime: date.data.replyTime,
        };
      });
    });
  });
  return analyzedMessageData;
};

/**
 * 메시지를 분석합니다.
 * @param {any[]} attachedFileList - 첨부된 파일 배열
 * @returns {Promise<AnalyzedMessage[][][]>} - 분석된 메시지 데이터 배열을 포함하는 프로미스 객체
 */
const analyzeMessage = async (attachedFileList: FileObject[][], osIndex: number | null) => {
  const analyzedMessages: MessageInfo[][] = await decodeTxtFileIntoMessageData(
    attachedFileList,
    osIndex
  );
  const analyzedMessageData: AnalyzedMessage[][][] = transformIntoTableForm(analyzedMessages);
  return analyzedMessageData;
};

// 파일 확장자 허용 타입
export const isAllowedFileType = (file: File): boolean => {
  const allowedExtensions = [".txt", ".csv"];
  const fileType = file.name.substring(file.name.lastIndexOf("."));
  return allowedExtensions.includes(fileType);
};

const AttachmentSection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const selectedOsIndex = useSelector(
    (state: { selectedOsIndexSlice: number }) => state.selectedOsIndexSlice
  );
  const attachedFileList = useSelector(
    (state: { attachedFileListSlice: FileObject[][] }) => state.attachedFileListSlice
  );

  const attachmentSectionRef = useRef<HTMLDivElement | null>(null);

  const handleChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files: FileList | null = event.target.files;
    if (files && files.length) {
      dispatch(pushNewlyAttachedFiles(Array.prototype.slice.call(files)));
    }
  };

  const dispatchAnalyzedMessages = async (attachedFileList: FileObject[][]) => {
    try {
      const analyzedMessage: AnalyzedMessage[][][] = await analyzeMessage(
        attachedFileList,
        selectedOsIndex
      );
      dispatch(setAnalyzedMessages(analyzedMessage));
      dispatch(setIsAnalyzedMessagesExist(true));
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickAnalyzeButton = () => {
    dispatchAnalyzedMessages(attachedFileList);
    const windowWidth = window.innerWidth;
    if (windowWidth > 1024) {
      navigate("/dashboard");
    } else {
      navigate("/detail");
    }
  };

  const handleScrollDown = () => {
    if (attachmentSectionRef.current) {
      scrollToEvent(
        attachmentSectionRef.current.offsetTop + attachmentSectionRef.current.offsetHeight - 30,
        "smooth"
      );
    }
  };

  return (
    <AttachmentSectionBox ref={attachmentSectionRef}>
      {!selectedOsIndex ? (
        <OsListBox>
          <Paragraph fontSize="24px">자신의 운영체제 아이콘을 선택해 주세요.</Paragraph>
          <OsList />
          <Span fontSize="15px">* 올바른 운영체제를 선택하지 않으면 분석이 불가능합니다.</Span>
        </OsListBox>
      ) : (
        <>
          <FileDrop handleChangeFile={handleChangeFile}></FileDrop>
          <AttachedFileList />
          <ButtonBox>
            <BlueButton onClick={handleClickAnalyzeButton} disabled={!attachedFileList.length}>
              분석하기
            </BlueButton>
            {!attachedFileList.length && <Span fontSize="14px">* 파일을 첨부해 주세요</Span>}
          </ButtonBox>
          <ScrollIndicator onClick={handleScrollDown}>카카오톡 메시지 내보내기 방법은?</ScrollIndicator>
        </>
      )}
    </AttachmentSectionBox>
  );
};

export default AttachmentSection;
