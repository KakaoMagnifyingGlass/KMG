import React from "react";
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
import { getNotDuplicatedChatDates } from "./ChatVolumeGraph";
import colorsForGraphArray from "../../../module/common/colorsForGraphArray";
import { lightTheme } from "../../../style/Theme";

const radarSubjects = ["양", "속도", "인원", "기간", "nf력"];

const getDayDifference = (date1: Date, date2: Date) => {
  const oneDay = 24 * 60 * 60 * 1000; // 1일은 24시간, 60분, 60초, 1000밀리초로 구성됩니다.
  const diffInMilliseconds = Math.abs(Number(date1) - Number(date2)); // 두 날짜 사이의 밀리초 차이를 계산합니다.
  const diffInDays = Math.round(diffInMilliseconds / oneDay); // 밀리초를 일수로 변환합니다.
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

const RadarGraph = () => {
  const analyzedMessages = useSelector(
    (state: { analyzedMessagesSlice: AnalyzedMessage[] }) => state.analyzedMessagesSlice
  );
  const selectedChatRoomIndex = useSelector(
    (state: { selectedRoomIndexSlice: number }) => state.selectedRoomIndexSlice
  );
  const nfKeywordCounts = useSelector(
    (state: { nfKeywordCountsSlice: number[][] }) => state.nfKeywordCountsSlice
  );

  const speakers: string[][] = getSpeakers(analyzedMessages);
  const chatRoomNames: string[] = getTwoLettersFromSpeakers(speakers);
  const chatTimes: ChatTimes[][][] = getChatTimes(analyzedMessages);
  const totalChatCounts: number[] = getTotalChatCounts(chatTimes);
  const replyTimes: ReplyTime[][][] = getReplyTimes(analyzedMessages);
  const averageReplyTime: number[][] = getAverageReplyTime(replyTimes);
  const dates: string[][] = getDates(analyzedMessages);
  const nfKeywordCountArray = nfKeywordCounts.map((nfCountArray: number[]) => {
    return nfCountArray.reduce((a: number, b: number) => a + b, 0);
  });

  const getRadarData = () => {
    const radarData: any[] = [];

    for (let i = 0; i < totalChatCounts.length; i++) {
      const radarDatum: any = {};
      const notDuplicatedChatDates: string[] = getNotDuplicatedChatDates(dates[i]);
      const date1 = getDateMilliseconds(notDuplicatedChatDates[notDuplicatedChatDates.length - 1]);
      const date2 = getDateMilliseconds(notDuplicatedChatDates[0]);
      radarDatum["totalMessageCount"] = totalChatCounts[i];
      radarDatum["averageReplySpeed"] =
        averageReplyTime[i].reduce((a: number, b: number) => a + b, 0) / speakers[i].length;
      radarDatum["peopleCount"] = speakers[i].length;
      radarDatum["chatPeriod"] = getDayDifference(date1, date2);
      radarDatum["nfKeywordCountArray"] = Math.floor(
        (nfKeywordCountArray[i] / totalChatCounts[i]) * 1000
      );
      radarData.push(radarDatum);
    }
    return radarData;
  };

  const radarRankData = getRadarRankData(getRadarData());

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarRankData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" fontSize={15} />
        <PolarRadiusAxis
          fontSize={10}
          angle={60}
          domain={[0, Object.keys(radarRankData[0]).length - 2]}
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
              fillOpacity={0.4}
            />
          );
        })}
        {/* <Legend iconType="line" /> */}
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default RadarGraph;
