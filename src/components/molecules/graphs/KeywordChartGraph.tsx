import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AnalyzedMessage, KeywordCounts, ValueCountPair } from "../../../@types/index.d";
import { customTickColor, setRotationColor } from "../../../module/common/colorsForGraphArray";
import { getKeywordCounts } from "../../../module/common/getProperties";
import { getHighKeywords } from "./KeywordCloud";

import WordCloud from "react-d3-cloud";
import { useLocation } from "react-router";

const CloudBox = styled.div`
  position: absolute;
  top: 0;
  left: 5%;
  width: 95%;
  height: 95.5%;
  overflow: hidden;
  z-index: -1;
`;

const getAllKeywordData = (keywordData: ValueCountPair[]) => {
  const resultArray: ValueCountPair[] = [];

  keywordData.flat().forEach((item) => {
    const existingItem = resultArray.find((i) => i.text === item.text);
    if (existingItem) {
      existingItem.value += item.value;
    } else {
      resultArray.push({ text: item.text, value: item.value });
    }
  });
  return resultArray;
};

const KeywordChartGraph = () => {
  const isDetailPage = useLocation().pathname.includes("detail");

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

  const containerRef = useRef<any>(null);

  const [DISPLAY_KEYWORD_COUNT, setDISPLAY_KEYWORD_COUNT] = useState<number>(10);
  const [currentSpeakerIndex, setCurrentSpeakerIndex] = useState<number>(selectedSpeakerIndex);

  const keywordCounts: KeywordCounts[][][] = getKeywordCounts(results);
  const currentKeywordCounts: KeywordCounts[][] = keywordCounts[selectedChatRoomIndex];
  const keywordData: ValueCountPair[][] = getHighKeywords(currentKeywordCounts, DISPLAY_KEYWORD_COUNT);
  const allKeywordData: ValueCountPair[] = getAllKeywordData(keywordData.flat()).sort(
    (a, b) => Number(b.value) - Number(a.value)
  );

  useEffect(() => {
    setCurrentSpeakerIndex(selectedSpeakerIndex + 1);
  }, [selectedSpeakerIndex]);

  function truncateValue(value: string) {
    if (value.length > 7) {
      return value.substring(0, 6) + "...";
    }
    return value;
  }

  useEffect(() => {
    if (containerRef?.current?.current.offsetLeft === 0) {
      setDISPLAY_KEYWORD_COUNT(20);
    }
  }, [containerRef]);

  let dataForCloud: any;

  if (isDetailPage) {
    dataForCloud =
      selectedSpeakerIndex === -1
        ? JSON.parse(
            JSON.stringify(
              getHighKeywords(currentKeywordCounts, 100)
                .flat()
                .sort((a, b) => Number(b.value) - Number(a.value))
                .slice(0, 100)
            )
          )
        : JSON.parse(JSON.stringify(getHighKeywords(currentKeywordCounts, 100)[selectedSpeakerIndex]));
  }

  return (
    <>
      {isDetailPage && (
        <CloudBox>
          <WordCloud
            data={dataForCloud}
            font="Times"
            fontStyle="italic"
            fontWeight="bold"
            fontSize={20}
            spiral="rectangular"
            padding={10}
            random={Math.random}
          />
        </CloudBox>
      )}
      <ResponsiveContainer width="100%" height={"100%"} ref={containerRef}>
        <BarChart
          layout="vertical"
          data={
            selectedSpeakerIndex === -1
              ? allKeywordData.slice(0, DISPLAY_KEYWORD_COUNT)
              : keywordData[selectedSpeakerIndex]
          }
          margin={{
            top: 0,
            right: 5,
            left: -10,
            bottom: -5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" fontSize={12} tick={customTickColor(isDarkMode)} />
          <YAxis
            type="category"
            dataKey="text"
            tickFormatter={truncateValue}
            fontSize={12}
            tick={customTickColor(isDarkMode)}
          />
          <Tooltip contentStyle={{ fontSize: "1.6rem" }} />
          <Bar dataKey="value" fill={setRotationColor(currentSpeakerIndex)} opacity={0.85} />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default KeywordChartGraph;
