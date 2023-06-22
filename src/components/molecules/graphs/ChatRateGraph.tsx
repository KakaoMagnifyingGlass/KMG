import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import {
  ResponsiveContainer,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Area,
  Tooltip,
  Brush,
} from "recharts";
import { AnalyzedMessage, ChatTimes, StackBarData } from "../../../@types/index.d";
import { getChatTimes, getDates, getSpeakers } from "../../../module/common/getProperties";
import { getNotDuplicatedChatDates } from "./ChatVolumeByPeriodGraph";
import { colorsForGraphArray, customTickColor } from "../../../module/common/colorsForGraphArray";
import styled from "styled-components";
import NavigatorContainer from "../dashboard/GraphNavigatorContainer";

const TooltipBox = styled.div`
  border: 1px solid #ddd;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  background: #fff;

  > ul {
    > li {
      margin-bottom: 5px;
    }
  }
`;

const sumChatCountsDay = (chatCountsDay: ChatTimes) => {
  return Object.values(chatCountsDay).reduce((sum, count) => sum + count, 0);
};

const toPercent = (decimal: number, fixed = 0) => `${decimal * 100}%`;

const getPercent = (value: number, total: number) => {
  const ratio = total > 0 ? value / total : 0;
  return toPercent(ratio, 2);
};

const createStackBarData = (chatSpeakers: string[], chatDates: string[], chatTimes: ChatTimes[][]) => {
  const notDuplicatedChatDates = getNotDuplicatedChatDates(chatDates);
  return notDuplicatedChatDates.map((date) => {
    const stackBarData: StackBarData = { name: date };
    chatSpeakers.forEach((speaker, speakerIndex) => {
      const dateIndex = chatDates[speakerIndex].indexOf(date);
      const chatCounts = dateIndex !== -1 ? sumChatCountsDay(chatTimes[speakerIndex][dateIndex]) : 0;
      stackBarData[speaker] = chatCounts;
    });
    return stackBarData;
  });
};

const renderTooltipContent = (o: any) => {
  const { payload, label } = o;
  const total = payload.reduce((result: any, entry: { value: any }) => result + entry.value, 0);
  return (
    <TooltipBox className="customized-tooltip-content" style={{ fontSize: "1.6rem" }}>
      <p className="total">{`${label} (Total: ${total})`}</p>
      <ul className="list">
        {payload.map((entry: { color: any; name: any; value: number }, index: any) => (
          <li key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}(${getPercent(entry.value, total).slice(0, 2)})`}
          </li>
        ))}
      </ul>
    </TooltipBox>
  );
};

const ChatRateGraph = () => {
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

  const [data, setData] = useState<StackBarData[]>([]);
  const chatSpeakers = getSpeakers(results)[selectedChatRoomIndex];
  const chatDates: string[] = getDates(results)[selectedChatRoomIndex];
  const chatTimes: ChatTimes[][] = getChatTimes(results)[selectedChatRoomIndex];

  const parentRef = useRef<any>(null);

  let isParentGraphContentBox;
  if (parentRef?.current?.current) {
    isParentGraphContentBox =
      parentRef?.current?.current.offsetParent.className.includes("GraphContentBox");
  }

  useEffect(() => {
    setData(createStackBarData(chatSpeakers, chatDates, chatTimes));
  }, [selectedChatRoomIndex]);

  return (
    <>
      <ResponsiveContainer width="100%" height="100%" ref={parentRef}>
        <AreaChart
          data={data}
          stackOffset="expand"
          margin={{
            top: 0,
            right: 5,
            left: -20,
            bottom: -5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" fontSize={12} tick={customTickColor(isDarkMode)} />
          <YAxis tickFormatter={toPercent} fontSize={12} tick={customTickColor(isDarkMode)} />
          <Tooltip content={renderTooltipContent} />
          {chatSpeakers.map((speaker: string, index: number) => {
            return (
              <Area
                key={index}
                type="monotone"
                dataKey={speaker}
                stackId="1"
                stroke={colorsForGraphArray[index % colorsForGraphArray.length]}
                fill={colorsForGraphArray[index % colorsForGraphArray.length]}
                strokeWidth={selectedSpeakerIndex === -1 ? 1 : selectedSpeakerIndex === index ? 0 : 0.3}
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
        </AreaChart>
      </ResponsiveContainer>
      {isParentGraphContentBox && (
        <NavigatorContainer>
          <ResponsiveContainer width="100%" height={101}>
            <AreaChart
              width={500}
              height={400}
              data={data}
              stackOffset="expand"
              margin={{
                top: 12,
                right: 5,
                left: -20,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} tick={customTickColor(isDarkMode)} />
              <YAxis tickFormatter={toPercent} fontSize={12} tick={customTickColor(isDarkMode)} />
              <Tooltip content={renderTooltipContent} />
              {chatSpeakers.map((speaker: string, index: number) => {
                return (
                  <Area
                    key={index}
                    type="monotone"
                    dataKey={speaker}
                    stackId="1"
                    stroke={colorsForGraphArray[index % colorsForGraphArray.length]}
                    fill={colorsForGraphArray[index % colorsForGraphArray.length]}
                    strokeWidth={
                      selectedSpeakerIndex === -1 ? 1 : selectedSpeakerIndex === index ? 0 : 0.3
                    }
                    fillOpacity={
                      selectedSpeakerIndex === -1 ? 1 : selectedSpeakerIndex === index ? 1 : 0.4
                    }
                    style={{ transition: "ease-in-out 0.7s" }}
                  />
                );
              })}
            </AreaChart>
          </ResponsiveContainer>
        </NavigatorContainer>
      )}
    </>
  );
};

export default ChatRateGraph;
