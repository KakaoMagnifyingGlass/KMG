import React, { useEffect, useState } from "react";
import styled from "styled-components";
import SummaryPieGraph, {
  getTotalChatCounts,
  getTwoLettersFromSpeakers,
} from "../../molecules/graphs/SummaryPieGraph";
import { useDispatch, useSelector } from "react-redux";
import { AnalyzedMessage, ChatTimes } from "../../../@types/index.d";
import { getChatTimes, getSpeakers } from "../../../module/common/getProperties";
import Span from "../../atoms/Span";
import Paragraph from "../../atoms/Paragraph";
import { setSelectedChatRoomIndex } from "../../../store/reducer/dashboard/selectedRoomIndexSlice";
import { Link } from "react-router-dom";
import { setSelectedSpeakerIndex } from "../../../store/reducer/dashboard/selectedSpeakerIndexSlice";

import { setIsSideMenuChatRoom } from "../../../store/reducer/dashboard/isSideMenuChatRoomSelectSlice";

const DashboardLayoutBox = styled.div`
  position: sticky;
  top: 80px;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 15%;
  height: calc(100vh - 80px);
  @media (max-width: 1024px) {
    width: 100%;
    height: 100%;
  }
`;

const ChatroomMenuTitleBox = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;
  font-size: 18px;
  color: ${(props) => props.theme.mainText};
  letter-spacing: 0.05rem;
  border-bottom: 1px solid ${(props) => props.theme.border};
  background: ${(props) => props.theme.dashboardMenuBackground};
  @media (max-width: 1024px) {
    padding: 0;
  }
`;

const ChatroomGraphBox = styled.div`
  position: relative;
  padding: 15px;
  display: flex;
  height: 200px;
  border-bottom: 1px solid ${(props) => props.theme.border};
  background: ${(props) => props.theme.mainBackground};
  @media (max-width: 1100px) {
    height: 100px;
  }
  @media (max-width: 1024px) {
    height: 200px;
  }
`;

const ChatroomListTitleBox = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;
  font-size: 18px;
  color: ${(props) => props.theme.mainText};
  letter-spacing: 0.05rem;
  border-bottom: 1px solid ${(props) => props.theme.border};
  background: ${(props) => props.theme.dashboardMenuBackground};
  @media (max-width: 1024px) {
    display: none;
  }
`;

const ChatroomListBox = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  background-color: ${(props) => props.theme.mainBackground};
  @media (max-width: 1024px) {
    padding: 20px 20px;
    height: 200px;
    border-bottom: 1px solid ${(props) => props.theme.border};
  }
  &::-webkit-scrollbar {
    width: 6px; /* 스크롤바의 너비 */
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: ${(props) => props.theme.mainGray}; /* 스크롤바의 색상 */
  }
  &::-webkit-scrollbar-track {
    background: rgba(144, 144, 144, 0.2); /*스크롤바 뒷 배경 색상*/
  }
`;

const ChatRoomBox = styled.div`
  padding: 10px;
  border-radius: 5px;
  border: 1px solid ${(props) => props.theme.border};
  cursor: pointer;
  background: ${(props) => props.theme.mainWhite};
  &:hover {
    border: 1px solid ${(props) => props.theme.dashboardBackground};
  }
  &.active {
    border: 2px solid ${(props) => props.theme.mainGray};
  }
  > * {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const ChatRoomHead = styled.div`
  display: flex;
  justify-content: space-between;
`;

const DashboardSideMenu = () => {
  const dispatch = useDispatch();
  const analyzedMessages = useSelector(
    (state: { analyzedMessagesSlice: AnalyzedMessage[] }) => state.analyzedMessagesSlice
  );
  const selectedChatRoomIndex = useSelector(
    (state: { selectedRoomIndexSlice: number }) => state.selectedRoomIndexSlice
  );

  const speakers: string[][] = getSpeakers(analyzedMessages);
  const chatRoomNames: string[] = getTwoLettersFromSpeakers(speakers);
  const chatTimes: ChatTimes[][][] = getChatTimes(analyzedMessages);
  const totalChatCounts: number[] = getTotalChatCounts(chatTimes);

  const handleClickChatRoom = (index: number) => {
    dispatch(setSelectedChatRoomIndex(index));
    dispatch(setSelectedSpeakerIndex(-1));
  };

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isSideMenuChatRoom = useSelector(
    (state: { isSideMenuChatRoomSelectSlice: boolean }) => state.isSideMenuChatRoomSelectSlice
  );

  const closeMenu = () => {
    dispatch(setIsSideMenuChatRoom(!isSideMenuChatRoom));
  };
  return (
    <DashboardLayoutBox>
      <ChatroomMenuTitleBox>채팅방 대화 비율</ChatroomMenuTitleBox>
      <ChatroomGraphBox>
        <SummaryPieGraph />
      </ChatroomGraphBox>
      <ChatroomListTitleBox>채팅방 목록</ChatroomListTitleBox>
      <ChatroomListBox>
        {chatRoomNames.map((name, index) => {
          return (
            <ChatRoomBox
              key={index}
              className={`${selectedChatRoomIndex === index && "active"}`}
              onClick={() => {
                handleClickChatRoom(index);
              }}
            >
              <ChatRoomHead>
                <Paragraph fontWeight="500">
                  채팅방{index + 1} ({totalChatCounts[index]})
                </Paragraph>
              </ChatRoomHead>
              <Span>{name}</Span>
              <Span underline fontWeight="500">
                {window.innerWidth > 1024 ? (
                  <Link to={`/detail`}>상세보기 {">"}</Link>
                ) : (
                  <Link to={`/detail`} onClick={closeMenu}>
                    상세보기 {">"}
                  </Link>
                )}
              </Span>
            </ChatRoomBox>
          );
        })}
      </ChatroomListBox>
    </DashboardLayoutBox>
  );
};

export default DashboardSideMenu;
