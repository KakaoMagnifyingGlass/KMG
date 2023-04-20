import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getMessageData } from "../../../module/core/getMessageData";
import { breakdownTxtFile, utf8Decode } from "../../../module/core/breakdownTxtFile";

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

interface FileObject {
  lastModified: number;
  lastModifiedDate: Date;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: string;
}

const Attachment = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [attachedFiles, setAttachedFiles] = useState<any[]>([]);

  const addAttachedFiles = (files: FileObject[]) => {
    if (attachedFiles.length) {
      return setAttachedFiles([...attachedFiles, [...files]]);
    }
    setAttachedFiles([[...files]]);
  };

  const handleChangeFile = (event: any) => {
    // 채팅방 별로 첨부된 파일들을 array에 담기
    if (event.target.files.length) {
      addAttachedFiles([...event.target.files]);
    }
  };

  const final: any[] = [];

  const analyzeMessage = async () => {
    for (let i = 0; i < attachedFiles.length; i++) {
      const filteredMessages: any[] = [];

      for (let j = 0; j < attachedFiles[i].length; j++) {
        const base64 = await readAsDataURL(attachedFiles[i][j]);
        if (base64) {
          const decodedTextFile = utf8Decode(base64.toString());
          console.log(filteredMessages);
          filteredMessages.push(breakdownTxtFile(decodedTextFile));
        }
      }

      const messageData = getMessageData(filteredMessages.flat());
      final.push([...messageData]);
    }
    setMessages(final);
  };

  const deleteAttachedFileArray = (fileArrayIndex: number) => {
    const filteredFileList = [...attachedFiles].filter((_, index) => index !== fileArrayIndex);
    setAttachedFiles(filteredFileList);
  };

  const readAsDataURL = (file: File) => {
    return new Promise<string | null>((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => resolve(reader.result as string | null);
    });
  };

  useEffect(() => {
    console.log(messages, "messages");
  }, [messages]);

  useEffect(() => {
    console.log(attachedFiles, "attachedFiles");
  }, [attachedFiles]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch(process.env.PUBLIC_URL + "/ad.txt");
  //       const data = await response.text();
  //       console.log(data); // 파일의 내용 출력
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  return (
    <AttachmentBox>
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
      <button onClick={analyzeMessage} disabled={!attachedFiles.length}>
        분석하기
      </button>
    </AttachmentBox>
  );
};

export default Attachment;