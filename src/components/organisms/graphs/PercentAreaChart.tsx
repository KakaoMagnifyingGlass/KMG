import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Area, Tooltip } from "recharts";
import { AnalyzedMessage, ChatTimes, StackBarData } from "../../../@types/index.d";
import { getChatTimes, getDates, getSpeakers } from "../../../module/common/getProperties";
import { getNotDuplicatedChatDates } from "./ChatVolumeGraph";
import colorsForGraphArray from "../../../module/common/colorsForGraphArray";

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
      stackBarData[speaker[0]] = chatCounts;
    });
    return stackBarData;
  });
};

const renderTooltipContent = (o: any) => {
  const { payload, label } = o;
  const total = payload.reduce((result: any, entry: { value: any }) => result + entry.value, 0);
  return (
    <div className="customized-tooltip-content">
      <p className="total">{`${label} (Total: ${total})`}</p>
      <ul className="list">
        {payload.map((entry: { color: any; name: any; value: number }, index: any) => (
          <li key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}(${getPercent(entry.value, total)})`}
          </li>
        ))}
      </ul>
    </div>
  );
};

const PercentAreaChart = () => {
  const results = useSelector(
    (state: { analyzedMessagesSlice: AnalyzedMessage[] }) => state.analyzedMessagesSlice
  );
  const selectedChatRoomIndex = useSelector(
    (state: { selectedRoomIndexSlice: number }) => state.selectedRoomIndexSlice
  );

  const [data, setData] = useState<StackBarData[]>([]);
  const chatSpeakers = getSpeakers(results)[selectedChatRoomIndex];
  const chatDates: string[] = getDates(results)[selectedChatRoomIndex];
  const chatTimes: ChatTimes[][] = getChatTimes(results)[selectedChatRoomIndex];

  const chatSpeakersColorPair = chatSpeakers.map((speaker: string, index: number) => {
    return [speaker, colorsForGraphArray[index % colorsForGraphArray.length]];
  });

  useEffect(() => {
    setData(createStackBarData(chatSpeakersColorPair, chatDates, chatTimes));
  }, [selectedChatRoomIndex]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        width={500}
        height={400}
        data={data}
        stackOffset="expand"
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={toPercent} fontSize={12} />

        <Tooltip content={renderTooltipContent} />
        {chatSpeakersColorPair.map((speaker: string, index: number) => {
          return (
            <Area
              key={index}
              type="monotone"
              dataKey={speaker[0]}
              stackId="1"
              stroke="#dddddd"
              fill={speaker[1]}
            />
          );
        })}
        {/* <Area type="monotone" dataKey="a" stackId="1" stroke="#8884d8" fill="#8884d8" />
        <Area type="monotone" dataKey="b" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
        <Area type="monotone" dataKey="c" stackId="1" stroke="#ffc658" fill="#ffc658" /> */}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default PercentAreaChart;
