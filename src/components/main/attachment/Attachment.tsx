import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getMessageData, readAsDataURL } from "../../../module/core/getMessageData";
import { breakdownTxtFile } from "../../../module/core/breakdownTxtFile";
import { useDispatch } from "react-redux";
import { setAnalyzedMessages } from "../../../store/reducer/messageSlice";
import DateForm from "../../datePicker/dateForm";

const AttachmentBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const List = styled.ul``;

const FileArray = styled.div`
  margin-bottom: 10px;
  padding: 10px;
  display: flex;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const EachFile = styled.span`
  margin-right: 5px;
`;

const Label = styled.label``;

const FileInput = styled.input`
  display: none;
`;

const AttachmentButton = styled.div`
  margin: 0 auto;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--yellow);
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background: var(--yellow-hover);
  }
`;

const PlusIcon = styled.i`
  padding: 10px;
  font-size: 20px;
`;

const DeleteButton = styled.div`
  transform: scale(1.5);
  cursor: pointer;
  &:hover {
    background: #ddd;
  }
`;

const AnalyzeButton = styled.button``;

interface FileObject {
  lastModified: number;
  lastModifiedDate: Date;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: string;
}

const Attachment = () => {
  const dispatch = useDispatch();

  const [attachedFiles, setAttachedFiles] = useState<any[]>([]);

  const pushNewlyAttachedFiles = (files: FileObject[]) => {
    if (attachedFiles.length) {
      return setAttachedFiles([...attachedFiles, [...files]]);
    }
    setAttachedFiles([[...files]]);

  };

  const handleChangeFile = (event: any) => {
    if (event.target.files.length) {
      pushNewlyAttachedFiles([...event.target.files]);
    }
  };

  const deleteAttachedFileArray = (fileArrayIndex: number) => {
    const filteredFileList = [...attachedFiles].filter((_, index) => index !== fileArrayIndex);
    setAttachedFiles(filteredFileList);
  };

  const analyzedMessages: any[] = [];

  const analyzeMessage = async () => {
    for (let i = 0; i < attachedFiles.length; i++) {
      const filteredMessages: any[] = [];

      for (let j = 0; j < attachedFiles[i].length; j++) {
        const base64 = await readAsDataURL(attachedFiles[i][j]);
        base64 && filteredMessages.push(breakdownTxtFile(base64));
      }
      const messageData = getMessageData(filteredMessages.flat());
      analyzedMessages.push([...messageData]); 
      
    }
   

    const result = analyzedMessages.map((chatRooms: any) => {
      return chatRooms.map((chatRoom: any) => {
        const speaker = chatRoom.speaker;
        const dates = chatRoom.dates;
        return dates.map((date: any) => {
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

    dispatch(setAnalyzedMessages(result));

  };

  useEffect(() => {}, [attachedFiles]);

  return (
    <AttachmentBox>
      <DateForm />
      <List>
        {attachedFiles.map((files: File[], fileArrayIndex) => {
          return (
            <FileArray key={fileArrayIndex}>
              {files.map((file, fileIndex) => {
                return (
                  <EachFile key={fileIndex}>
                    {file.name}
                    {fileIndex !== files.length - 1 && ","}
                  </EachFile>
                );
              })}
              <DeleteButton onClick={() => deleteAttachedFileArray(fileArrayIndex)}>X</DeleteButton>
            </FileArray>
          );
        })}
      </List>
      <Label>
        <FileInput type="file" id="file" onChange={handleChangeFile} multiple />
        <AttachmentButton>
          <PlusIcon>대화 추가하기</PlusIcon>
        </AttachmentButton>
      </Label>
      <AnalyzeButton onClick={analyzeMessage} disabled={!attachedFiles.length}>
        분석하기
      </AnalyzeButton>
    </AttachmentBox>
  );
};

export default Attachment;
