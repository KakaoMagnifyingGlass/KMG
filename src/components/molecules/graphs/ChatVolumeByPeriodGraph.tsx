import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
} from "recharts";
import { AnalyzedMessage, ChatTimes } from "../../../@types/index.d";
import { getChatTimes, getDates, getSpeakers } from "../../../module/common/getProperties";
import { colorsForGraphArray, customTickColor } from "../../../module/common/colorsForGraphArray";
import NavigatorContainer from "../NavigatorContainer";

type StackBarData = {
  name: string;
  [key: string]: number | string | undefined;
};

export const getNotDuplicatedChatDates = (chatDates: string[]) => {
  const chatDatesSet = new Set(chatDates.flat());
  const notDuplicatedChatDates = Array.from(chatDatesSet).sort(
    (a: string, b: string) => Number(a) - Number(b)
  );
  return notDuplicatedChatDates;
};

const ChatVolumeByPeriodGraph = () => {
  const results = useSelector(
    (state: { analyzedMessagesSlice: AnalyzedMessage[] }) => state.analyzedMessagesSlice
  );
  const selectedChatRoomIndex = useSelector(
    (state: { selectedRoomIndexSlice: number }) => state.selectedRoomIndexSlice
  );
  const selectedSpeakerIndex = useSelector(
    (state: { selectedSpeakerIndexSlice: number }) => state.selectedSpeakerIndexSlice
  );
  const isDarkMode = useSelector((state: { isDarkModeSlice: boolean }) => state.isDarkModeSlice);

  // const selectedChatRoomData = results[selectedChatRoomIndex];
  // const speakerTotalChatCounts: Record<string, number> = {};
  // Object.values(selectedChatRoomData).forEach((chatroom) => {
  //   Object.values(chatroom).forEach((chat: { chatTimes: any; speaker: string; date: string }) => {
  //     const speaker = chat.speaker;
  //     const chatDays = chat.date;
  //     if (!speakerTotalChatCounts[speaker]) {
  //       speakerTotalChatCounts[speaker] = 0;
  //     }
  //   });
  // });

  const sumChatCountsDay = (chatCountsDay: ChatTimes) => {
    let chatCounts = 0;
    for (const key in chatCountsDay) {
      chatCounts += chatCountsDay[key];
    }
    return chatCounts;
  };

  const createStackBarData = (chatSpeakers: string[], chatDates: string[], chatTimes: ChatTimes[][]) => {
    const notDuplicatedChatDates = getNotDuplicatedChatDates(chatDates);
    const stackBarData: StackBarData[] = [];

    for (let i = 0; i < notDuplicatedChatDates.length; i++) {
      const date: any = { name: notDuplicatedChatDates[i] };
      chatSpeakers.forEach((speaker: string, speakerIndex: number) => {
        const dateIndex: number = chatDates[speakerIndex].indexOf(notDuplicatedChatDates[i]);
        if (dateIndex !== -1) {
          date[speaker] = sumChatCountsDay(chatTimes[speakerIndex][dateIndex]);
        }
      });
      stackBarData.push(date);
    }
    return stackBarData;
  };

  const [data, setData] = useState<StackBarData[]>([]);
  let chatSpeakers = getSpeakers(results)[selectedChatRoomIndex];
  const chatDates = getDates(results)[selectedChatRoomIndex];
  const chatTimes = getChatTimes(results)[selectedChatRoomIndex];

  const parentRef = useRef<any>(null);

  let isParentGraphContentBox;
  if (parentRef?.current?.current) {
    isParentGraphContentBox =
      parentRef?.current?.current.offsetParent.className.includes("GraphContentBox");
  }

  useEffect(() => {
    setData(createStackBarData(chatSpeakers, chatDates, chatTimes));
  }, [selectedChatRoomIndex]);

  // +누르면 보여주는 기준점의 수를 줄이고
  // -누르면 보여주는 기준점의 수를 늘린다

  // 날짜제한

  return (
    <>
      <ResponsiveContainer width="100%" height={"100%"} ref={parentRef}>
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 0,
            right: 5,
            left: -20,
            bottom: -10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" fontSize={12} tick={customTickColor(isDarkMode)} />
          <YAxis fontSize={12} tick={customTickColor(isDarkMode)} />
          <Tooltip contentStyle={{ fontSize: "1.6rem" }} />
          {/* <Legend /> */}
          {chatSpeakers.map((speaker: string, index: number) => {
            return (
              <Bar
                key={index}
                dataKey={speaker}
                stackId="a"
                stroke={colorsForGraphArray[index % colorsForGraphArray.length]}
                strokeWidth={selectedSpeakerIndex === -1 ? 1 : 0}
                fill={colorsForGraphArray[index % colorsForGraphArray.length]}
                fillOpacity={
                  selectedSpeakerIndex === -1 ? 0.85 : selectedSpeakerIndex === index ? 1 : 0.4
                }
              />
            );
          })}
          {isParentGraphContentBox && (
            <Brush
              fill={isDarkMode ? "#00000010" : "#ffffff10"}
              height={65}
              startIndex={Math.floor(data.length * 0.75)}
              stroke={isDarkMode ? "#ccc" : "#666"}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
      {isParentGraphContentBox && (
        <NavigatorContainer>
          <ResponsiveContainer width="100%" height={101}>
            <BarChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 16,
                right: 5,
                left: -20,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} tick={customTickColor(isDarkMode)} />
              <YAxis fontSize={12} tick={customTickColor(isDarkMode)} />
              <Tooltip />
              {/* <Legend /> */}
              {chatSpeakers.map((speaker: string, index: number) => {
                return (
                  <Bar
                    key={index}
                    dataKey={speaker}
                    stackId="a"
                    stroke={colorsForGraphArray[index % colorsForGraphArray.length]}
                    strokeWidth={selectedSpeakerIndex === -1 ? 1 : 0}
                    fill={colorsForGraphArray[index % colorsForGraphArray.length]}
                    fillOpacity={
                      selectedSpeakerIndex === -1 ? 0.85 : selectedSpeakerIndex === index ? 1 : 0.4
                    }
                    style={{ transition: "ease-in-out 0.7s" }}
                  />
                );
              })}
            </BarChart>
          </ResponsiveContainer>
        </NavigatorContainer>
      )}
    </>
  );
};

export default ChatVolumeByPeriodGraph;
