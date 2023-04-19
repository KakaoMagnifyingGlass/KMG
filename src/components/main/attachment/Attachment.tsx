import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getMessageData } from "../../../module/core/getMessageData";
import { breakdownTxtFile, utf8Decode } from "../../../module/core/breakdownTxtFile";

const AttachmentBox = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 20px;
`;

const List = styled.ul``;
const Label = styled.label``;
const FileInput = styled.input``;
const AttachmentButton = styled.div``;
const CancelButton = styled.div``;

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
        console.log(attachedFiles[i][j], "attachedFiles[i][j]");
        const base64 = await readAsDataURL(attachedFiles[i][j]);
        if (base64) {
          const decodedTextFile = utf8Decode(base64.toString());
          filteredMessages.push(breakdownTxtFile(decodedTextFile));
          console.log(breakdownTxtFile(decodedTextFile), "decodedTextFile");
        }
      }

      console.log(filteredMessages, "filteredMessages");
      const messageData = getMessageData(filteredMessages.flat());
      final.push([...messageData]);
    }
    setMessages(final);
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
        <Label>
          <FileInput type="file" id="file" onChange={handleChangeFile} multiple />
          <AttachmentButton>첨부</AttachmentButton>
        </Label>
        <CancelButton>X</CancelButton>
        <button onClick={analyzeMessage}>분석하기</button>
        {/* <div>
          {messages &&
            messages.map((data: any, index: number) => {
              return (
                <div key={index}>
                  <span>{data.speaker}</span>
                  <span>
                    {data.date.map((item: any, index: number) => {
                      const { chatTimes, keywordCounts, replyTime } = item.data;
                      const { count, difference, previous } = replyTime;
                      return (
                        <div key={index}>
                          {item.date}
                          {Object.keys(chatTimes)}
                          {Object.keys(keywordCounts)}
                          {count}
                          {difference}
                          {previous}
                        </div>
                      );
                    })}
                  </span>
                </div>
              );
            })}
        </div> */}
      </List>
    </AttachmentBox>
  );
};

export default Attachment;
