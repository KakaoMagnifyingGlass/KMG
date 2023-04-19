type MessageData = {
  day: string;
  hour: string;
  minute: string;
  month: string;
  speaker: string;
  year: string;
  keywords: string[];
};

type DateInfo = {
  date: string;
  data: {
    chatTimes: Record<string, number>;
    keywordCounts: Record<string, number>;
    replyTime: {
      previous: number;
      difference: number;
      count: number;
    };
  };
};

export const getMessageData = (results: MessageData[]) => {
  const messageData = [];
  let rightBeforeSpeaker;
  let rightBeforeMessageTime;

  console.log(results, "result");
  for (const result of results) {
    const { year, month, day, hour, minute, speaker, keywords } = result;
    const todayDate = `${year}${month}${day}`;
    const currentTime = `${hour}:${minute}`;

    // speaker 찾기. 없다면? speaker와 date배열 추가하기
    let speakerIndex = messageData.findIndex((item) => item.speaker === speaker);
    if (speakerIndex === -1) {
      messageData.push({ speaker, date: [] });
      speakerIndex = messageData.length - 1;
    }

    // date에 current message date 있는지 찾기. 없다면? current message date, chatTimes: {} ,keywordCounts:{},replyTime:{} 추가하기
    let dates: DateInfo[] = messageData[speakerIndex].date;
    const lastMessageDate = dates.length && Object.values(dates[dates.length - 1])[0];
    if (lastMessageDate !== todayDate) {
      dates.push({ date: todayDate, data: { chatTimes: {}, keywordCounts: {}, replyTime: { previous: 0, difference: 0, count: 0 } } });
    }

    // date정보의 마지막 요소에 current chat time있는지 찾기. 없다면? chatTimes object 추가하기, 있다면? chatTimes count++
    const todayDateValue = dates[dates.length - 1].data;
    const lastChatTime = todayDateValue.chatTimes[currentTime];
    lastChatTime ? todayDateValue.chatTimes[currentTime]++ : (todayDateValue.chatTimes[currentTime] = 1);

    // keywordCount있는지 찾기. 없다면? keywordCounts object 추가하기. 있다면? 키워드 또는 카운트 추가하기
    const keywordCountObject = todayDateValue.keywordCounts;
    for (const keyword of keywords) {
      keywordCountObject[keyword] ? keywordCountObject[keyword]++ : (keywordCountObject[keyword] = 1);
    }

    // 직전의 메시지가 현재 메시지와 다른사람일 경우, 현재 메시지 - 직전의 메시지 시간을 더하고 count++
    const minuteTime = parseInt(hour) * 60 + parseInt(minute);
    const replyTimeObject = todayDateValue.replyTime;

    if (rightBeforeSpeaker && rightBeforeSpeaker !== speaker) {
      const difference = minuteTime - (rightBeforeMessageTime || 0);
      replyTimeObject.difference += difference >= 0 ? difference : 0;
      replyTimeObject.previous = minuteTime;
      replyTimeObject.count++;
    }
    rightBeforeSpeaker = messageData[speakerIndex].speaker;
    rightBeforeMessageTime = minuteTime;
  }

  return messageData;
};
