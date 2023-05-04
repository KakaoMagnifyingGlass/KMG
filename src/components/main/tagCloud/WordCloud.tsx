import { useSelector } from "react-redux";
import { TagCloud } from "react-tagcloud";
import { AnalyzedMessage, ValueCountPair } from "../../../@types/index.d";
import { ChangeEvent, useState } from "react";
import { getKeywordCounts, getSpeakers } from "../../../module/common/getProperties";
import { KeywordCounts } from "../../../@types/index.d";
import styled from "styled-components";

const KeywordList = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  width: 500px;
  background: #f3f0ff;
`;

/**
 * 모든 키워드에서 상위 N개의 키워드를 가져옵니다.
 * @param {KeywordCounts} allKeywords - 모든 키워드의 카운트입니다.
 * @param {number} n - 가져올 상위 키워드의 수입니다.
 * @returns {ValueCountPair[]} 상위 N개의 키워드입니다.
 */
const getAllTopNKeywords = (allKeywords: KeywordCounts, n: number) => {
  const keywordsEntries: ValueCountPair[] = Object.entries(allKeywords).map(([value, count]) => ({
    value,
    count,
  }));
  const sortedKeywordsEntries: ValueCountPair[] = keywordsEntries.sort(
    (a: ValueCountPair, b: ValueCountPair) => b.count - a.count
  );
  const topNKeywords: ValueCountPair[] = sortedKeywordsEntries.slice(0, n + 1);
  return topNKeywords;
};

/**
 * 각 speaker의 키워드 배열에서 상위 N개의 키워드를 가져옵니다.
 * @param {KeywordCounts[]} keywordsArray - speaker 키워드 배열입니다.
 * @returns {ValueCountPair[]} 상위 N개의 키워드입니다.
 */
const getSpeakersTopNKeywords = (keywordsArray: KeywordCounts[], displayKeywordCount: number) => {
  const allKeywords: KeywordCounts = {};
  keywordsArray.forEach((keywords: KeywordCounts) => {
    for (const key in keywords) {
      allKeywords[key] ? (allKeywords[key] += keywords[key]) : (allKeywords[key] = keywords[key]);
    }
  });

  const topNKeywords: ValueCountPair[] = getAllTopNKeywords(allKeywords, displayKeywordCount);
  return topNKeywords;
};

/**
 * 현재 키워드 카운트 배열에서 speaker별로 상위 키워드를 가져옵니다.
 * @param {KeywordCounts[][]} currentKeywordCounts - 현재 키워드 카운트 배열입니다.
 * @returns {ValueCountPair[][]} speaker별로 상위 키워드입니다.
 */
const getHighKeywords = (
  currentKeywordCounts: KeywordCounts[][],
  displayKeywordCount: number,
  keywordsToFilter: string[],
  isLaughterFiltered: boolean
) => {
  const highKeywords: ValueCountPair[][] = [];
  for (const keywordsArray of currentKeywordCounts) {
    highKeywords.push(getSpeakersTopNKeywords(keywordsArray, displayKeywordCount));
  }
  const filteredKeyword = filterSpecificKeywords(highKeywords, keywordsToFilter);
  const laughterFilteredKeyword = filterLaughterKeywords(filteredKeyword);
  return isLaughterFiltered ? laughterFilteredKeyword : filteredKeyword;
};

/**
 * 상위 키워드에서 특정 키워드를 필터링합니다.
 * @param {ValueCountPair[][]} highKeywords - 상위 키워드 배열입니다.
 * @param {string[]} keywordsToFilter - 필터링할 키워드 배열입니다.
 * @returns {ValueCountPair[][]} 필터링된 상위 키워드 배열입니다.
 */
const filterSpecificKeywords = (highKeywords: ValueCountPair[][], keywordsToFilter: string[]) => {
  const filteredKeyword = highKeywords.map((keywordArray: ValueCountPair[]) =>
    keywordArray.filter((keyword: ValueCountPair) => !keywordsToFilter.includes(keyword.value))
  );
  return filteredKeyword;
};

/**
 * 상위 키워드에서 "ㅋ" 또는 "ㅎ"를 포함하는 키워드를 필터링합니다.
 * @param {ValueCountPair[][]} highKeywords - 상위 키워드 배열입니다.
 * @returns {ValueCountPair[][]} 필터링된 상위 키워드 배열입니다.
 */
const filterLaughterKeywords = (highKeywords: ValueCountPair[][]) => {
  const filteredKeyword = highKeywords.map((keywordArray: ValueCountPair[]) =>
    keywordArray.filter((keyword: ValueCountPair) => !keyword.value.includes("ㅋ" || "ㅎ"))
  );
  return filteredKeyword;
};

/**
 * 키워드 데이터에서 중복되는 키워드를 가져옵니다.
 * @param {any[]} keywordData - 키워드 데이터 배열입니다.
 * @returns {string[]} 중복되는 키워드 배열입니다.
 */
const getOverlappedKeyword = (keywordData: any[]) => {
  const overlappedKeyword: any = {};
  keywordData.forEach((keywords) => {
    keywords.forEach((keyword: any) => {
      overlappedKeyword[keyword.value] = Number(overlappedKeyword[keyword.value] || 0) + 1;
    });
  });
  const filteredKeyword = [];
  for (const keyword in overlappedKeyword) {
    overlappedKeyword[keyword] === 2 && filteredKeyword.push(keyword);
  }
  filteredKeyword.shift();
  return filteredKeyword;
};

const WordCloud = () => {
  const analyzedMessages = useSelector(
    (state: { analyzedMessagesSlice: AnalyzedMessage[] }) => state.analyzedMessagesSlice
  );
  const selectedRoomIndex = useSelector(
    (state: { selectedRoomIndexSlice: number }) => state.selectedRoomIndexSlice
  );
  const [numberInput, setNumberInput] = useState<number>(50);
  const [displayKeywordCount, setDisplayKeywordCount] = useState<number>(50);
  const [keywordsToFilter, setKeywordsToFilter] = useState<string[]>([]);
  const [isLaughterFiltered, setIsLaughterFiltered] = useState<boolean>(false);

  const speaker: string[] = getSpeakers(analyzedMessages)[selectedRoomIndex];

  const keywordCounts: KeywordCounts[][][] = getKeywordCounts(analyzedMessages);
  const currentKeywordCounts: KeywordCounts[][] = keywordCounts[selectedRoomIndex];
  const keywordData: ValueCountPair[][] = getHighKeywords(
    currentKeywordCounts,
    displayKeywordCount,
    keywordsToFilter,
    isLaughterFiltered
  );

  const overlappedKeyword = getOverlappedKeyword(keywordData);

  const handleChangeNumberInput = (e: ChangeEvent<HTMLInputElement>) => {
    setNumberInput(Number(e.target.value));
  };

  const handleSubmitNumber = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDisplayKeywordCount(numberInput);
  };

  const handClickExceptEmoticon = () => {
    setKeywordsToFilter([...keywordsToFilter, "이모티콘", "사진", "동영상"]);
  };
  const handClickExceptLaughter = () => {
    setIsLaughterFiltered(!isLaughterFiltered);
  };

  return (
    <ul>
      <div onClick={handClickExceptEmoticon}>이모티콘,사진,동영상 제외하기</div>
      <div onClick={handClickExceptLaughter}>ㅋ,ㅎ 제외하기</div>
      <form action="" onSubmit={handleSubmitNumber}>
        <label>내 카톡 습관, 몇 개나 모아서 볼래?</label>
        <input name="" type="number" id="" value={numberInput} onChange={handleChangeNumberInput} />
        <button>확인</button>
      </form>
      {keywordData.length &&
        keywordData.map((data: ValueCountPair[], index: number) => {
          return (
            <KeywordList key={index}>
              {speaker[index]}
              <TagCloud minSize={14} maxSize={100} tags={data} />
            </KeywordList>
          );
        })}
      <div>키워드 중에서 겹치는 말버릇 모아보기 {overlappedKeyword && overlappedKeyword.join(", ")}</div>
    </ul>
  );
};

export default WordCloud;
