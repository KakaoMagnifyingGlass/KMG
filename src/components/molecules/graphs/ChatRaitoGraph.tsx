import React from "react";
import { useSelector } from "react-redux";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { AnalyzedMessage } from "../../../@types/index.d";
import { reduceAPlusB } from "../../../module/common/reduceAPlusB";

const COLORS = ["#FF414D", "#FF8991", "#F7ABB1"];

const ChatRatioGraph = () => {
  const results = useSelector(
    (state: { analyzedMessagesSlice: AnalyzedMessage[] }) => state.analyzedMessagesSlice
  );
  const selectedChatRoomIndex = useSelector(
    (state: { selectedRoomIndexSlice: number }) => state.selectedRoomIndexSlice
  );

  const selectedChatRoomData = results[selectedChatRoomIndex];
  const speakerTotalChatCounts: Record<string, number> = {};
  Object.values(selectedChatRoomData).forEach((chatroom) => {
    Object.values(chatroom).forEach((chat: { chatTimes: any; speaker: string }) => {
      const speaker = chat.speaker;
      if (!speakerTotalChatCounts[speaker]) {
        speakerTotalChatCounts[speaker] = 0;
      }
      const chatTimes = chat.chatTimes;
      const chatCounts = chatTimes ? Object.values(chatTimes) : [];
      const totalChatCount = reduceAPlusB(chatCounts);
      speakerTotalChatCounts[speaker] += Number(totalChatCount);
    });
  });

  const totalChatCount = reduceAPlusB(Object.values(speakerTotalChatCounts));
  const data = Object.entries(speakerTotalChatCounts).map(([name, value]) => ({
    name,
    value: Number(((value / totalChatCount) * 100).toFixed(0)),
  }));

  return (
    <>
      <ResponsiveContainer width="100%" height={"100%"}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={20}
            outerRadius={40}
            dataKey="value"
            labelLine
            // label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          {/* <Legend layout="horizontal" /> */}
        </PieChart>
      </ResponsiveContainer>
    </>
  );
};

export default ChatRatioGraph;