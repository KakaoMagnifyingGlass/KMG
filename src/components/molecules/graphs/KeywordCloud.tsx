import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { TagCloud } from "react-tagcloud";
import { AnalyzedMessage, ValueCountPair } from "../../../@types/index.d";
import { ChangeEvent, FormEvent, useState } from "react";
import { getKeywordCounts, getSpeakers } from "../../../module/common/getProperties";
import { KeywordCounts } from "../../../@types/index.d";
import styled from "styled-components";
import { setNfKeywordCount } from "../../../store/reducer/dashboard/nfKeywordCountSlice";
import { setSpeakersTopNKeywords } from "../../../store/reducer/dashboard/speakersTopNKeywordsSlice";

// const KeywordList = styled.li`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   margin-bottom: 10px;
//   width: 100%;
// `;

/**
 * 모든 키워드에서 상위 N개의 키워드를 가져옵니다.
 * @param {KeywordCounts} allKeywords - 모든 키워드의 카운트입니다.
 * @param {number} n - 가져올 상위 키워드의 수입니다.
 * @returns {ValueCountPair[]} 상위 N개의 키워드입니다.
 */
const getAllTopNKeywords = (allKeywords: KeywordCounts, n: number) => {
  const keywordsEntries: ValueCountPair[] = Object.entries(allKeywords).map(([text, value]) => ({
    text,
    value,
  }));
  const sortedKeywordsEntries: ValueCountPair[] = keywordsEntries.sort(
    (a: ValueCountPair, b: ValueCountPair) => b.value - a.value
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
 * 키워드 데이터에서 중복되는 키워드를 가져옵니다.
 * @param {any[]} keywordData - 키워드 데이터 배열입니다.
 * @returns {string[]} 중복되는 키워드 배열입니다.
 */

// const getOverlappedKeyword = (keywordData: any[]) => {
//   const overlappedKeyword: any = {};
//   keywordData.forEach((keywords) => {
//     keywords.forEach((keyword: any) => {
//       overlappedKeyword[keyword.text] = Number(overlappedKeyword[keyword.text] || 0) + 1;
//     });
//   });
//   const filteredKeyword = [];
//   for (const keyword in overlappedKeyword) {
//     overlappedKeyword[keyword] === 2 && filteredKeyword.push(keyword);
//   }
//   return filteredKeyword;
// };

/**
 * 현재 키워드 카운트 배열에서 speaker별로 상위 키워드를 가져옵니다.
 * @param {KeywordCounts[][]} currentKeywordCounts - 현재 키워드 카운트 배열입니다.
 * @returns {ValueCountPair[][]} speaker별로 상위 키워드입니다.
 */
export const getHighKeywords = (
  currentKeywordCounts: KeywordCounts[][],
  displayKeywordCount: number,
  keywordToFilter: string[] = []
) => {
  const highKeywords: ValueCountPair[][] = [];
  for (const keywordsArray of currentKeywordCounts) {
    highKeywords.push(getSpeakersTopNKeywords(keywordsArray, displayKeywordCount));
  }
  const spaceFilteredHighKeyword = highKeywords.map((keywordArray) =>
    keywordArray.filter((keyword) => keyword.text !== "")
  );

  const filteredHighKeyword = spaceFilteredHighKeyword.map((keywordArray: ValueCountPair[]) =>
    keywordArray.filter(
      (keyword: ValueCountPair) => !keywordToFilter.some((el: any) => keyword.text.includes(el))
    )
  );
  return filteredHighKeyword;
};

/**
 * 키워드 수를 기반으로 채팅방별 "사진,이모티콘,동영상" 키워드 수를 가져옵니다.
 * @param {KeywordCounts[][][]} keywordCounts - 키워드 수 배열
 * @returns {number[]} chatRoomsNFKeywordCounts - 채팅방별 "사진,이모티콘,동영상" 키워드 수 배열
 */
const getChatRoomsNFKeywordCounts = (keywordCounts: KeywordCounts[][][]) => {
  const keywordsToCheck = ["이모티콘", "사진", "동영상"];

  const chatRoomsNFKeywordCounts = [];
  for (let i = 0; i < keywordCounts.length; i++) {
    const keywordCount = keywordCounts[i];
    const keywordData = getHighKeywords(keywordCount, Infinity);
    const nFFilteredData = keywordData.map((keywordArray: ValueCountPair[]) => {
      return keywordArray.filter((keyword: ValueCountPair) => {
        return keywordsToCheck.some((checker: string) => checker === keyword.text);
      });
    });
    const nFKeywordCount = nFFilteredData.map((nfArray: ValueCountPair[]) => {
      return nfArray.reduce((a: number, b: ValueCountPair) => a + b.value, 0);
    });
    chatRoomsNFKeywordCounts.push(nFKeywordCount);
  }
  return chatRoomsNFKeywordCounts;
};

const KeywordCloud = () => {
  const dispatch = useDispatch();

  const analyzedMessages = useSelector(
    (state: { analyzedMessagesSlice: AnalyzedMessage[] }) => state.analyzedMessagesSlice
  );
  const selectedRoomIndex = useSelector(
    (state: { selectedRoomIndexSlice: number }) => state.selectedRoomIndexSlice
  );
  // const selectedSpeakerIndex = useSelector(
  //   (state: { selectedSpeakerIndexSlice: number }) => state.selectedSpeakerIndexSlice
  // );
  // const isDarkMode = useSelector((state: { isDarkModeSlice: boolean }) => state.isDarkModeSlice);

  // const [numberInput, setNumberInput] = useState<number>(50);
  const [displayKeywordCount, setDisplayKeywordCount] = useState<number>(50);
  const [keywordToFilter, setKeywordToFilter] = useState<string[]>([]);

  // const speaker: string[] = getSpeakers(analyzedMessages)[selectedRoomIndex];
  const keywordCounts: KeywordCounts[][][] = getKeywordCounts(analyzedMessages);
  const currentKeywordCounts: KeywordCounts[][] = keywordCounts[selectedRoomIndex];
  const keywordData: ValueCountPair[][] = getHighKeywords(currentKeywordCounts, displayKeywordCount);
  // const overlappedKeyword = getOverlappedKeyword(keywordData);
  const chatRoomsNFKeywordCounts = getChatRoomsNFKeywordCounts(keywordCounts);
  // const handleChangeNumberInput = (e: ChangeEvent<HTMLInputElement>) => {
  //   setNumberInput(Number(e.target.value));
  // };

  // const handleSubmitNumber = (e: ChangeEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setDisplayKeywordCount(numberInput);
  // };

  // const handClickExceptEmoticon = () => {
  //   const keywordsToCheck = ["이모티콘", "사진", "동영상"];
  //   if (!keywordsToCheck.some((keyword) => keywordToFilter.includes(keyword))) {
  //     setKeywordToFilter([...keywordToFilter, ...keywordsToCheck]);
  //   }
  // };
  // const handClickExceptLaughter = () => {
  //   const keywordsToCheck = ["ㅋ", "ㅎ"];
  //   if (!keywordsToCheck.some((keyword) => keywordToFilter.includes(keyword))) {
  //     setKeywordToFilter([...keywordToFilter, ...keywordsToCheck]);
  //   }
  // };

  // const handleClickDeleteKeyword = (index: number) => {
  //   const copiedFilterKeyword = [...keywordToFilter];
  //   copiedFilterKeyword.splice(index, 1);
  //   setKeywordToFilter(copiedFilterKeyword);
  // };

  // const [filterKeywordInput, setFilterKeywordInput] = useState<string>("");

  // const handleFilterKeywordInput = (e: ChangeEvent<HTMLInputElement>) => {
  //   setFilterKeywordInput(e.target.value);
  // };

  // const handleFilterKeywordForm = (e: FormEvent, keywordToFilter: string[]) => {
  //   e.preventDefault();
  //   if (!keywordToFilter.includes(filterKeywordInput)) {
  //     setFilterKeywordInput("");
  //     setKeywordToFilter([...keywordToFilter, filterKeywordInput]);
  //   } else {
  //     window.alert("이미 포함되어있는 문구입니다.");
  //   }
  // };

  dispatch(setNfKeywordCount(chatRoomsNFKeywordCounts));
  dispatch(setSpeakersTopNKeywords(keywordData));

  useEffect(() => {
    console.log(keywordToFilter);
  }, [keywordToFilter]);

  return (
    <ul>
      {/* 키워드
      <form action="" onSubmit={(e) => handleFilterKeywordForm(e, keywordToFilter)}>
        <div onClick={handClickExceptEmoticon}>이모티콘,사진,동영상 제외하기</div>
        <div onClick={handClickExceptLaughter}>ㅋ,ㅎ 제외하기</div>
        <label htmlFor="">특정 문자를 포함한 키워드 제외하기</label>
        <input type="text" onChange={(e) => handleFilterKeywordInput(e)} value={filterKeywordInput} />
        <button>제외하기</button>
      </form>
      <div>
        <span>제외된 키워드:</span>
        {keywordToFilter.map((keyword: string, index: number) => (
          <div key={index}>
            {keyword}
            <span onClick={() => handleClickDeleteKeyword(index)}>X</span>
          </div>
        ))}
      </div>
      <form action="" onSubmit={handleSubmitNumber}>
        <label>내 카톡 습관, 몇 개나 모아서 볼래?</label>
        <input name="" type="number" id="" value={numberInput} onChange={handleChangeNumberInput} />
        <button>확인</button>
      </form>
      {keywordData.length &&
        keywordData.map((data: ValueCountPair[], index: number) => {
          if (selectedSpeakerIndex === index) {
            return (
              <KeywordList key={index}>
                {speaker[index]}
                <TagCloud minSize={14} maxSize={50} tags={data} />
              </KeywordList>
            );
          }
          return null;
        })}
      <div>키워드 중에서 겹치는 말버릇 모아보기 {overlappedKeyword && overlappedKeyword.join(", ")}</div> */}
    </ul>
  );
};

export default KeywordCloud;
