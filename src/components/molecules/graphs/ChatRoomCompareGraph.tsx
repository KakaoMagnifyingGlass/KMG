import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  getChatTimes,
  getDates,
  getReplyTimes,
  getSpeakers,
} from "../../../module/common/getProperties";
import { AnalyzedMessage, ChatTimes, ReplyTime } from "../../../@types/index.d";
import { getAverageReplyTime, getTotalChatCounts, getTwoLettersFromSpeakers } from "./SummaryPieGraph";
import { getNotDuplicatedChatDates } from "./ChatVolumeByPeriodGraph";
import { colorsForGraphArray, customTickColor } from "../../../module/common/colorsForGraphArray";
import { lightTheme } from "../../../style/Theme";
import { reduceAPlusB } from "../../../module/common/reduceAPlusB";

const radarSubjects = ["카톡 양", "답장속도", "인원", "기간", "이모티콘사진"];

const getDayDifference = (date1: Date, date2: Date) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const diffInMilliseconds = Math.abs(Number(date1) - Number(date2));
  const diffInDays = Math.round(diffInMilliseconds / oneDay);
  return diffInDays;
};

const getDateMilliseconds = (date: string) => {
  const dateNumber = Number(date);
  const year = 20 + dateNumber / 10000;
  const month = (dateNumber % 10000) / 100 - 1;
  const day = dateNumber % 100;
  return new Date(year, month, day);
};

const getRadarRankData = (radarData: number[][]) => {
  const radarValues = radarData.map((el) => Object.values(el));

  const subject: number[][] = Array.from({ length: 5 }, () => []);

  for (let j = 0; j < radarValues[0].length; j++) {
    for (let i = 0; i < radarValues.length; i++) {
      subject[j].push(radarValues[i][j]);
    }
  }

  const ranksData = [];
  for (let i = 0; i < subject.length; i++) {
    const sortedNumbers = subject[i]
      .map((value, index) => ({ value, index }))
      .sort((a, b) => b.value - a.value);

    let currentRank = subject[0].length + 1;
    let previousValue: number | null = null;
    const ranks: any[] = [];

    sortedNumbers.forEach((item) => {
      if (item.value !== previousValue) {
        currentRank -= 1;
      }
      ranks[item.index] = currentRank;
      previousValue = item.value;
    });
    ranksData.push(ranks);
  }

  const resultData = ranksData.map((ranks, index) => {
    const rankObject = ranks.reduce((obj, rank, chatRoomIndex) => {
      obj[chatRoomIndex] = rank;
      return obj;
    }, {});

    return {
      subject: radarSubjects[index],
      ...rankObject,
      fullMark: ranks.length,
    };
  });

  return resultData;
};

const ChatRoomCompareGraph = () => {
  const [fontSize, setFontSize] = useState(15);

  const analyzedMessages = useSelector(
    (state: { analyzedMessagesSlice: AnalyzedMessage[] }) => state.analyzedMessagesSlice
  );
  const selectedChatRoomIndex = useSelector(
    (state: { selectedRoomIndexSlice: number }) => state.selectedRoomIndexSlice
  );
  const nfKeywordCounts = useSelector(
    (state: { nfKeywordCountsSlice: number[][] }) => state.nfKeywordCountsSlice
  );
  const isDarkMode = useSelector((state: { isDarkModeSlice: boolean }) => state.isDarkModeSlice);

  const speakers: string[][] = getSpeakers(analyzedMessages);
  const chatRoomNames: string[] = getTwoLettersFromSpeakers(speakers);
  const chatTimes: ChatTimes[][][] = getChatTimes(analyzedMessages);
  const totalChatCounts: number[] = getTotalChatCounts(chatTimes);
  const replyTimes: ReplyTime[][][] = getReplyTimes(analyzedMessages);
  const averageReplyTime: number[][] = getAverageReplyTime(replyTimes);
  const dates: string[][] = getDates(analyzedMessages);
  const nfKeywordCountArray = nfKeywordCounts.map((nfCountArray: number[]) => {
    return reduceAPlusB(nfCountArray);
  });

  const getRadarData = () => {
    const radarData: any[] = [];

    for (let i = 0; i < totalChatCounts.length; i++) {
      const radarDatum: any = {};
      const notDuplicatedChatDates: string[] = getNotDuplicatedChatDates(dates[i]);
      const date1 = getDateMilliseconds(notDuplicatedChatDates[notDuplicatedChatDates.length - 1]);
      const date2 = getDateMilliseconds(notDuplicatedChatDates[0]);
      radarDatum["카톡 횟수"] = totalChatCounts[i];
      radarDatum["평균답장속도"] = reduceAPlusB(averageReplyTime[i]) / speakers[i].length;
      radarDatum["인원 수"] = speakers[i].length;
      radarDatum["기간"] = getDayDifference(date1, date2);
      radarDatum["이모티콘사진"] = Math.floor((nfKeywordCountArray[i] / totalChatCounts[i]) * 1000);
      radarData.push(radarDatum);
    }
    return radarData;
  };

  const radarRankData = getRadarRankData(getRadarData());
  // useEffect(() => {
  //   const handleResize = () => {
  //     const windowWidth = window.innerWidth;
  //     let calculatedFontSize = 15;

  //     // 여기에서 폰트 사이즈 계산 로직을 작성합니다.
  //     // 예를 들어, 윈도우 너비가 1200px 이하인 경우에는 10px로 설정할 수 있습니다.
  //     if (windowWidth <= 1200) {
  //       calculatedFontSize = 10;
  //     }
  //     setFontSize(calculatedFontSize);
  //   };

  //   // 창 크기 변경 이벤트에 대한 이벤트 리스너를 추가합니다.
  //   window.addEventListener("resize", handleResize);

  //   // 컴포넌트가 언마운트되면 이벤트 리스너를 제거합니다.
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart
        cx="50%"
        cy="50%"
        outerRadius="70%"
        data={radarRankData}
        margin={{
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}
      >
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" fontSize="1.8vh" tick={customTickColor(isDarkMode)} />
        <PolarRadiusAxis
          fontSize={10}
          angle={60}
          domain={[0, Object.keys(radarRankData[0]).length - 2]}
          tick={customTickColor(isDarkMode)}
        />
        {chatRoomNames.map((el: any, index: number) => {
          return (
            <Radar
              key={index}
              name={el.length > 20 ? `${el.slice(0, 22)}...` : el}
              dataKey={index.toString()}
              stroke={
                selectedChatRoomIndex === index
                  ? lightTheme.mainBlack
                  : colorsForGraphArray[index % colorsForGraphArray.length]
              }
              strokeWidth={selectedChatRoomIndex === index ? 2 : 1}
              fill={colorsForGraphArray[index % colorsForGraphArray.length]}
              fillOpacity={0.3}
            />
          );
        })}
        {/* <Legend iconType="line" /> */}
        <Tooltip contentStyle={{ fontSize: "1.6rem" }} />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default ChatRoomCompareGraph;
