import { AnalyzedMessage } from "../../components/main/Main";

const extractProperty = (property: string) => {
  return (results: AnalyzedMessage[]) => {
    return results.map((chatroom: any) => {
      return chatroom.map((messages: any) => {
        return messages.map((message: any) => {
          return message[property];
        });
      });
    });
  };
};
// 대화자 이름
export const getSpeakers = (results: AnalyzedMessage[]) => {
  return results.map((chatroom: any) => {
    return chatroom.map((messages: any) => {
      return messages[0].speaker;
    });
  });
};
// chatTime 수
export const getChatTimes = (results: AnalyzedMessage[]) => {
  return results.map((chatroom: any) => {
    return chatroom.map((messages: any) => {
      return messages[0].chatTimes;
    });
  });
};

export const getDates = extractProperty("date");

export const getKeywordCounts = extractProperty("keywordCounts");
export const getReplyTimes = extractProperty("replyTime");
