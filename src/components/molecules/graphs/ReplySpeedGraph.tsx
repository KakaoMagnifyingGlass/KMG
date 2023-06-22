import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Brush,
} from "recharts";
import { AnalyzedMessage } from "../../../@types/index.d";
import { getDates, getReplyTimes, getSpeakers } from "../../../module/common/getProperties";
import { ReplyTime } from "../../../@types/index.d";
import { reduceAPlusB } from "../../../module/common/reduceAPlusB";
import { colorsForGraphArray, customTickColor } from "../../../module/common/colorsForGraphArray";
import NavigatorContainer from "../NavigatorContainer";

type LineGraphData = {
  name: string;
  [key: string]: number | string | undefined;
};

const assignScore = (value: number) => {
  if (value >= 0 && value <= 5) {
    return (10 + value / 5).toFixed(2);
  } else if (value > 5 && value <= 10) {
    return (9 + value / 10).toFixed(2);
  } else if (value > 10 && value <= 30) {
    return (8 + value / 30).toFixed(2);
  } else if (value > 30 && value <= 60) {
    return (7 + value / 60).toFixed(2);
  } else if (value > 60 && value <= 60 * 2) {
    return (6 + value / (60 * 2)).toFixed(2);
  } else if (value > 60 * 2 && value <= 60 * 4) {
    return (5 + value / (60 * 4)).toFixed(2);
  } else if (value > 60 * 4 && value <= 60 * 7) {
    return (4 + value / (60 * 7)).toFixed(2);
  } else if (value > 60 * 7 && value <= 60 * 11) {
    return (3 + value / (60 * 11)).toFixed(2);
  } else if (value > 60 * 11 && value <= 60 * 15) {
    return (2 + value / (60 * 15)).toFixed(2);
  } else if (value > 60 * 15 && value <= 60 * 20) {
    return (1 + value / (60 * 20)).toFixed(2);
  } else if (value > 60 * 20 && value <= 60 * 30) {
    return (0 + value / (60 * 30)).toFixed(2);
  } else if (value > 60 * 30 && value <= 60 * 45) {
    return (-1 + value / (60 * 45)).toFixed(2);
  } else if (value > 60 * 45 && value <= 60 * 60 * 1) {
    return (-2 + value / (60 * 60 * 1)).toFixed(2);
  } else if (value > 60 * 60 * 1 && value <= 60 * 60 * 2) {
    return (-3 + value / (60 * 60 * 2)).toFixed(2);
  } else if (value > 60 * 60 * 2 && value <= 60 * 60 * 3) {
    return (-4 + value / (60 * 60 * 3)).toFixed(2);
  } else if (value > 60 * 60 * 3 && value <= 60 * 60 * 4) {
    return (-5 + value / (60 * 60 * 4)).toFixed(2);
  } else if (value > 60 * 60 * 4 && value <= 60 * 60 * 5) {
    return (-6 + value / (60 * 60 * 5)).toFixed(2);
  } else if (value > 60 * 60 * 5 && value <= 60 * 60 * 6) {
    return (-7 + value / (60 * 60 * 6)).toFixed(2);
  } else if (value > 60 * 60 * 6 && value <= 60 * 60 * 8) {
    return (-8 + value / (60 * 60 * 8)).toFixed(2);
  } else if (value > 60 * 60 * 8 && value <= 60 * 60 * 12) {
    return (-9 + value / (60 * 60 * 12)).toFixed(2);
  } else if (value > 60 * 60 * 12) {
    return -10;
  } else {
    return null;
  }
};

const createLineGraphData = (chatSpeakers: string[], chatDates: string[], replyTimes: ReplyTime[][]) => {
  const chatDatesSet = new Set(chatDates.flat());
  const NotDuplicatedChatDates = Array.from(chatDatesSet);
  const ReplySpeedGraphData: LineGraphData[] = [];

  for (let i = 0; i < NotDuplicatedChatDates.length; i++) {
    const date: any = { name: NotDuplicatedChatDates[i] };
    chatSpeakers.forEach((speaker: string, speakerIndex: number) => {
      const dateIndex: number = chatDates[speakerIndex].indexOf(NotDuplicatedChatDates[i]);
      const replyTimeDayData = replyTimes[speakerIndex][dateIndex];
      if (dateIndex !== -1) {
        const replyTime = Math.floor(replyTimeDayData.difference / replyTimeDayData.count || 0);
        date[speaker] = assignScore(replyTime);
        date["답장횟수"] = replyTimeDayData.count;
      }
    });
    if (Object.values(date).includes(0)) {
      continue;
    }
    ReplySpeedGraphData.push(date);
  }
  const sortedReplySpeedGraphData = ReplySpeedGraphData.sort((a, b) => Number(a.name) - Number(b.name));
  return sortedReplySpeedGraphData;
};

const createLineGraphDataWeekly = (
  chatSpeakers: string[],
  chatDates: string[],
  replyTimes: ReplyTime[][]
) => {
  const chatDatesSet = new Set(chatDates.flat());
  const NotDuplicatedChatDates = Array.from(chatDatesSet);
  const ReplySpeedGraphData: LineGraphData[] = [];

  for (let i = 0; i < NotDuplicatedChatDates.length; i += 7) {
    const date: any = { name: NotDuplicatedChatDates[i] };

    // 1개씩 출력한 결과 너무 튀는 경우가 있으므로, 이를 개선하기 위해 7개 메시지 단위로 합산한 결과를 반영한다.
    for (let j = i; j < i + 7 && j < NotDuplicatedChatDates.length; j++) {
      chatSpeakers.forEach((speaker: string, speakerIndex: number) => {
        const dateIndex: number = chatDates[speakerIndex].indexOf(NotDuplicatedChatDates[j]);
        const replyTimeDayData = replyTimes[speakerIndex][dateIndex];
        if (dateIndex !== -1) {
          const replyTime = Math.floor(replyTimeDayData.difference / replyTimeDayData.count) || 0;
          date[speaker] = (date[speaker] || 0) + assignScore(replyTime);
          date["답장횟수"] = (date["답장횟수"] || 0) + replyTimeDayData.count;
        }
      });
    }
    ReplySpeedGraphData.push(date);
  }
  const sortedReplySpeedGraphData = ReplySpeedGraphData.sort((a, b) => Number(a.name) - Number(b.name));
  return sortedReplySpeedGraphData;
};

const getAverageReplyTime = (displayData: Record<string, number>[]) => {
  const averageDaily = displayData.map((data: Record<string, number>) => {
    const { 답장횟수, ...newData } = data;
    const values = Object.values(newData);
    const averageDaily = reduceAPlusB(values.slice(1)) / (values.length - 1);
    return averageDaily;
  });
  const averageReplyTime = reduceAPlusB(averageDaily) / displayData.length;
  return averageReplyTime;
};

const countKeysLessThanAverage = (displayData: Record<string, number>[], averageReplyTime: number) => {
  const keyCounts: Record<string, number> = {};
  for (let i = 0; i < displayData.length; i++) {
    const keys = Object.keys(displayData[i]);

    for (let j = 0; j < keys.length; j++) {
      if (keys[j] !== "답장횟수" && keys[j] !== "name" && displayData[i][keys[j]] > averageReplyTime) {
        keyCounts[keys[j]] = keyCounts[keys[j]] + 1 || 1;
      }
    }
  }
  return keyCounts;
};

const ReplySpeedGraph = () => {
  const analyzedMessages = useSelector(
    (state: { analyzedMessagesSlice: AnalyzedMessage[] }) => state.analyzedMessagesSlice
  );
  const selectedChatRoomIndex = useSelector(
    (state: { selectedRoomIndexSlice: number }) => state.selectedRoomIndexSlice
  );
  const selectedSpeakerIndex = useSelector(
    (state: { selectedSpeakerIndexSlice: number }) => state.selectedSpeakerIndexSlice
  );
  const isDarkMode = useSelector((state: { isDarkModeSlice: boolean }) => state.isDarkModeSlice);

  const [displayData, setDisplayData] = useState<any[]>([]);
  const [countKeysLessThanData, setCountKeysLessThanData] = useState<Record<string, number>>({});

  const replyTimes = getReplyTimes(analyzedMessages)[selectedChatRoomIndex];
  const chatSpeakers = getSpeakers(analyzedMessages)[selectedChatRoomIndex];
  const chatDates = getDates(analyzedMessages)[selectedChatRoomIndex];
  const averageReplyTime = getAverageReplyTime(displayData);

  const parentRef = useRef<any>(null);

  let isParentGraphContentBox;
  if (parentRef?.current?.current) {
    isParentGraphContentBox =
      parentRef?.current?.current.offsetParent.className.includes("GraphContentBox");
  }

  useEffect(() => {
    setDisplayData(createLineGraphData(chatSpeakers, chatDates, replyTimes));
    setCountKeysLessThanData(countKeysLessThanAverage(displayData, averageReplyTime));
  }, [selectedChatRoomIndex]);

  return (
    <>
      {/* <div onClick={() => setDisplayData(createLineGraphData(chatSpeakers, chatDates, replyTimes))}>
        일간 답장 속도
      </div> */}
      {/* <div
        onClick={() => setDisplayData(createLineGraphDataWeekly(chatSpeakers, chatDates, replyTimes))}
      >
        주간 답장 속도
      </div> */}
      {/* <div>
        {Object.entries(countKeysLessThanAverage(displayData, getAverageReplyTime(displayData))).map(
          ([key, value]) => (
            <div key={key}>{`평균보다 더 답장을 빨리한 횟수 ${key}: ${value}회`}</div>
          )
        )}
      </div> */}
      <ResponsiveContainer width="100%" height={"100%"} ref={parentRef}>
        <ComposedChart
          width={500}
          height={300}
          data={displayData}
          margin={{
            top: 0,
            right: -10,
            left: -20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" fontSize={12} tick={customTickColor(isDarkMode)} />
          <YAxis yAxisId="left" fontSize={12} tick={customTickColor(isDarkMode)} />
          <YAxis yAxisId="right" orientation="right" fontSize={12} tick={customTickColor(isDarkMode)} />

          <Tooltip contentStyle={{ fontSize: "1.6rem" }} />
          {/* <Legend /> */}
          <Bar yAxisId="right" dataKey="답장횟수" barSize={20} fill="#8884d8" fillOpacity={0.85} />
          <ReferenceLine
            y={getAverageReplyTime(displayData)}
            yAxisId="left"
            label="평균답장속도"
            stroke="orange"
          />
          {chatSpeakers.map((speaker: string, index: number) => {
            return (
              <Line
                dot={false}
                key={index}
                yAxisId="left"
                type="monotone"
                dataKey={speaker}
                stroke={colorsForGraphArray[index % colorsForGraphArray.length]}
                strokeWidth={selectedSpeakerIndex === -1 ? 1 : selectedSpeakerIndex === index ? 2 : 0.2}
                style={{ transition: "ease-in-out 0.7s" }}
              />
            );
          })}
          {isParentGraphContentBox && (
            <Brush
              fill={isDarkMode ? "#00000010" : "#ffffff10"}
              height={65}
              startIndex={Math.floor(displayData.length * 0.75)}
              stroke={isDarkMode ? "#ccc" : "#666"}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
      {isParentGraphContentBox && (
        <NavigatorContainer>
          <ResponsiveContainer width="100%" height={101}>
            <ComposedChart
              width={500}
              height={300}
              data={displayData}
              margin={{
                top: 0,
                right: -10,
                left: -20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} tick={customTickColor(isDarkMode)} />
              <YAxis yAxisId="left" fontSize={12} tick={customTickColor(isDarkMode)} />
              <YAxis
                yAxisId="right"
                orientation="right"
                fontSize={12}
                tick={customTickColor(isDarkMode)}
              />

              <Tooltip />
              {/* <Legend /> */}
              <Bar yAxisId="right" dataKey="답장횟수" barSize={20} fill="#8884d8" />
              <ReferenceLine y={getAverageReplyTime(displayData)} yAxisId="left" stroke="orange" />
              {chatSpeakers.map((speaker: string, index: number) => {
                return (
                  <Line
                    dot={false}
                    key={index}
                    yAxisId="left"
                    type="monotone"
                    dataKey={speaker}
                    stroke={colorsForGraphArray[index % colorsForGraphArray.length]}
                    strokeWidth={
                      selectedSpeakerIndex === -1 ? 1 : selectedSpeakerIndex === index ? 2 : 0.2
                    }
                    style={{ transition: "ease-in-out 0.7s" }}
                  />
                );
              })}
            </ComposedChart>
          </ResponsiveContainer>
        </NavigatorContainer>
      )}
    </>
  );
};

export default ReplySpeedGraph;
