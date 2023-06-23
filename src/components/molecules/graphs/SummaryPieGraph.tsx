import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { getChatTimes, getReplyTimes, getSpeakers } from "../../../module/common/getProperties";
import { setSelectedChatRoomIndex } from "../../../store/reducer/dashboard/selectedRoomIndexSlice";
import {
  AnalyzedMessage,
  ChatTimes,
  NameValuePair,
  ReplyTime,
  StringNumberTuple,
} from "../../../@types/index.d";
import { setAverageReplyTime } from "../../../store/reducer/dashboard/averageReplyTimeSlice";
import { reduceAPlusB } from "../../../module/common/reduceAPlusB";
import { colorsForChatroomArray } from "../../../module/common/colorsForGraphArray";
import { lightTheme } from "../../../style/Theme";
import styled from "styled-components";
import Icon from "../../atoms/Icon";
import { setMostChattedTimes } from "../../../store/reducer/dashboard/mostChattedTimes";
import { BiLeftArrowCircle, BiRightArrowCircle } from "react-icons/bi";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const ArrowIcon = styled(Icon)`
  cursor: pointer;

  // const ChatRoomIndexArrowBox = styled.div
`;
//   position: absolute;
//   top: 50%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   display: flex;
//   justify-content: space-between;
//   width: 98%;
//   z-index: 1;
//   @media (max-width: 1024px) {
//     width: 80%;
//   }
//   > * {
//     cursor: pointer;
//     font-weight: 200;
//     font-size: 30px;
//   }
// `;

export const getTotalChatCounts = (chatTimes: ChatTimes[][][]) => {
  let totalChatCounts: number[] = [];
  for (const chatroom of chatTimes) {
    const times: ChatTimes[] = chatroom.flat();
    const timeSum: number[] = times.map((time: ChatTimes) => reduceAPlusB(Object.values(time)));
    totalChatCounts.push(reduceAPlusB(timeSum));
  }
  return totalChatCounts;
};

export const getTwoLettersFromSpeakers = (speakers: string[][]) => {
  let chatRoomNames: string[] = [];
  for (const chatroom of speakers) {
    chatRoomNames.push(chatroom.map((speakerName: string) => speakerName.slice(0, 2)).join());
  }
  return chatRoomNames;
};

const calculateMostChattedTime = (
  chatTimes: ChatTimes[],
  mostChattedTimeArray: ChatTimes[],
  chatroomIndex: number
) => {
  chatTimes.forEach((chatTime: ChatTimes) => {
    const chatTimeEntry = Object.entries(chatTime);
    for (let i = 0; i < chatTimeEntry.length; i++) {
      const hour: string = chatTimeEntry[i][0].slice(0, 2);
      const value: number = chatTimeEntry[i][1];
      const currentChatroom: ChatTimes = mostChattedTimeArray[chatroomIndex];
      currentChatroom[hour] ? (currentChatroom[hour] += value) : (currentChatroom[hour] = value);
    }
  });
};

export const getMostChattedTimes = (chatTimes: ChatTimes[][][]) => {
  const mostChattedTimeArray: ChatTimes[] = [];
  let chatroomIndex: number = 0;
  for (const chatroom of chatTimes) {
    mostChattedTimeArray.push({});
    const chatTimes: ChatTimes[] = chatroom.flat();
    calculateMostChattedTime(chatTimes, mostChattedTimeArray, chatroomIndex);
    chatroomIndex++;
  }
  const mostChattedTimes: StringNumberTuple[][] = mostChattedTimeArray.map((chatTimes: ChatTimes) => {
    return Object.entries(chatTimes).sort((a: StringNumberTuple, b: StringNumberTuple) => b[1] - a[1]);
  });
  return mostChattedTimes;
};

export const getAverageReplyTime = (replyTimes: ReplyTime[][][]) => {
  const averageReplyTimeArray: number[][] = [];
  for (const chatroom of replyTimes) {
    const averageReplyTime: number[] = chatroom.map((times: ReplyTime[]) => {
      const averageReplyTime: number = times.reduce(
        (acc: number, cur: ReplyTime) => acc + (cur.difference / cur.count || 0),
        times[0].difference / times[0].count || 0
      );
      return Math.floor(averageReplyTime / times.length);
    });
    averageReplyTimeArray.push(averageReplyTime);
  }
  return averageReplyTimeArray;
};

const SummaryPieGraph = () => {
  const dispatch = useDispatch();
  const analyzedMessages = useSelector(
    (state: { analyzedMessagesSlice: AnalyzedMessage[] }) => state.analyzedMessagesSlice
  );
  const selectedChatRoomIndex = useSelector(
    (state: { selectedRoomIndexSlice: number }) => state.selectedRoomIndexSlice
  );

  const [selectedChatRoomData, setSelectedChatRoomData] = useState<{
    totalChatCount: number;
    speakerCount: number;
    speakers: string[];
    mostChattedTimes: [string, number][];
    averageReplyTime: number[];
  } | null>(null);

  const speakers: string[][] = getSpeakers(analyzedMessages);
  const chatRoomNames: string[] = getTwoLettersFromSpeakers(speakers);
  const chatTimes: ChatTimes[][][] = getChatTimes(analyzedMessages);
  const totalChatCounts: number[] = getTotalChatCounts(chatTimes);
  const pieGraphData: NameValuePair[] = chatRoomNames.map((name, index) => {
    return {
      name: name,
      value: totalChatCounts[index],
    };
  });

  const mostChattedTimes: StringNumberTuple[][] = getMostChattedTimes(chatTimes);
  const replyTimes: ReplyTime[][][] = getReplyTimes(analyzedMessages);
  const averageReplyTime: number[][] = getAverageReplyTime(replyTimes);
  // const mostChattedTimesNumbers: number[] =
  //   mostChattedTimes[selectedChatRoomIndex]?.map(([_, number]) => number) || [];

  const handleClickChatRoom = (index: number) => {
    dispatch(setSelectedChatRoomIndex(index));
  };

  const handleClickChatRoomIndexArray = (changedIndex: number) => {
    if (changedIndex === chatRoomNames.length) {
      changedIndex = 0;
    }
    if (changedIndex === -1) {
      changedIndex = chatRoomNames.length - 1;
    }
    dispatch(setSelectedChatRoomIndex(changedIndex));
  };

  useEffect(() => {
    // setSelectedChatRoomData({
    //   totalChatCount: totalChatCounts[selectedChatRoomIndex],
    //   speakerCount: speakers[selectedChatRoomIndex].length,
    //   speakers: speakers[selectedChatRoomIndex],
    //   mostChattedTimes: mostChattedTimes[selectedChatRoomIndex],
    //   averageReplyTime: averageReplyTime[selectedChatRoomIndex],
    // });

    dispatch(setAverageReplyTime(averageReplyTime[selectedChatRoomIndex]));
    dispatch(setMostChattedTimes(mostChattedTimes[selectedChatRoomIndex]));
  }, [selectedChatRoomIndex]);

  // const [activeIndex, setActiveIndex] = useState<number>(0);

  // const handleClick = (data: any, index: number) => {
  //   setActiveIndex(index);
  //   handleClickChatRoom(index);
  // };

  return (
    <Container>
      {/* <ChatRoomIndexArrowBox></ChatRoomIndexArrowBox> */}
      <ArrowIcon
        onClick={() => handleClickChatRoomIndexArray(selectedChatRoomIndex - 1)}
        fontSize="3rem"
      >
        <BiLeftArrowCircle />
      </ArrowIcon>
      <ResponsiveContainer width="100%" height={"100%"}>
        <PieChart>
          <Pie
            data={pieGraphData}
            cx={"50%"}
            cy={"50%"}
            innerRadius={0}
            outerRadius={"100%"}
            dataKey="value"
          >
            {pieGraphData.map((_, index) => {
              return (
                <Cell
                  key={`cell-${index}`}
                  onClick={() => handleClickChatRoom(index)}
                  fill={colorsForChatroomArray[index % colorsForChatroomArray.length]}
                  stroke={selectedChatRoomIndex === index ? lightTheme.mainBlack : ""}
                  strokeWidth={selectedChatRoomIndex === index ? 1 : 1}
                  cursor="pointer"
                />
              );
            })}
          </Pie>
          <Tooltip contentStyle={{ fontSize: "1.6rem" }} />
        </PieChart>
      </ResponsiveContainer>{" "}
      <ArrowIcon
        onClick={() => handleClickChatRoomIndexArray(selectedChatRoomIndex + 1)}
        fontSize="3rem"
      >
        <BiRightArrowCircle />
      </ArrowIcon>
      {/* 
      <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" data={pieGraphData}>
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" />
          <Bar dataKey="value" onClick={handleClick}>
            {pieGraphData.map((entry, index) => (
              <Cell
                cursor="pointer"
                fill={index === activeIndex ? "#82ca9d" : "#8884d8"}
                key={`cell-${index}`}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer> */}
      {/* {selectedChatRoomData && (
        <div>
          <GraphInformation unit={"총 대화 수"} value={selectedChatRoomData.totalChatCount.toString()} />
          <GraphInformation unit={"대화자"} value={selectedChatRoomData.speakers.join(",")} />

          <GraphInformation unit={"대화자 수"} value={selectedChatRoomData.speakerCount.toString()} />
          <GraphInformation
            unit={"가장 많은 대화 시간대"}
            value={`${selectedChatRoomData.mostChattedTimes[0][0]}시 대화수: 
            ${selectedChatRoomData.mostChattedTimes[0][1]}개`}
          />
          {selectedChatRoomData.speakers.map((speaker: string, index: number) => {
            return (
              <GraphInformation
                key={index}
                unit={speaker}
                value={`${selectedChatRoomData.averageReplyTime[index]}초`}
              />
            );
          })}
        </div>
      )} */}
    </Container>
  );
};

export default SummaryPieGraph;
