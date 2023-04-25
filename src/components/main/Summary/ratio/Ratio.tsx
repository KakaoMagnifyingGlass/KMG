import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { getChatTimes, getSpeakers } from "../../../../module/common/getNames";
import { AnalyzedMessage } from "../../Main";

const COLORS = ["#FF414D", "#FF8991", "#F7ABB1"];

const Ratio = () => {
  const results = useSelector(
    (state: { analyzedMessagesSlice: AnalyzedMessage[] }) =>
      state.analyzedMessagesSlice
  );
  const speakers = getSpeakers(results);
  const chatTimes = getChatTimes(results);
  // 현재 채팅방 총 대화 수

  const totalConversation = (chatTimes: any) => {
    let chatTimesMergeNewObj = chatTimes.map((arr: any) => {
      return arr.reduce((acc: any, obj: any) => {
        return { ...acc, ...obj };
      }, {});
    });

    const chatsArray = Object.values(chatTimesMergeNewObj[0]);
    let sum = 0;
    chatsArray.forEach((chat: any) => {
      sum += chat;
    });
    return sum;
  };
  const totalSum = totalConversation(chatTimes);
  console.log(totalSum);
  // useEffect(() => {
  //   console.log(chatTimes, "speakersspeakersspeakers");
  // }, [results]);
  let data = [
    { name: speakers[0][0], value: 400 },
    { name: speakers[0][1], value: 300 },
  ];

  return (
    <PieChart width={400} height={400}>
      <Pie
        data={data}
        cx={200}
        cy={200}
        innerRadius={0}
        outerRadius={100}
        dataKey="value"
        labelLine
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend layout="horizontal" />
    </PieChart>
  );
};

export default Ratio;
