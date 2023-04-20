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

const Attachment = () => {
  const [messageData, setMessageData] = useState<any>("");

  const handleChangeFile = (event: any) => {
    console.log(event.target.files);
    for (var i = 0; i < event.target.files.length; i++) {
      if (event.target.files[i]) {
        let reader = new FileReader();
        reader.readAsDataURL(event.target.files[i]);
        reader.onloadend = () => {
          const base64 = reader.result;
          if (base64) {
            const base64Sub = utf8Decode(base64.toString());
            const filteredMessages = breakdownTxtFile(base64Sub);
            const messageData = getMessageData(filteredMessages);
            setMessageData(messageData);
          }
        };
      }
    }
  };

  useEffect(() => {
    console.log(messageData);
  }, [messageData]);

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
        <div>
          {messageData &&
            messageData.map((data: any, index: number) => {
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
        </div>
      </List>
    </AttachmentBox>
  );
};

export default Attachment;
