import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { Link } from "react-router-dom";
import Img from "../atoms/Img";
import { useDispatch, useSelector } from "react-redux";
import { HiMenu } from "react-icons/hi";
import Icon from "../atoms/Icon";
import DashboardSideMenu from "./DashboardSideMenu";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import Span from "../atoms/Span";
import { setIsSideMenuChatRoom } from "../../store/reducer/isSideMenuChatRoomSelectSlice";


const NavSideBox = styled.div<{ isSideMenuChatRoom: boolean }>`
  position: absolute;
  top: 0;
  left: ${(props) => (props.isSideMenuChatRoom ? "0" : "-100%")};
  display: flex;
  flex-direction: column;
  width: 40%;
  height: 100vh;
  background: ${(props) => props.theme.mainWhite};
  overflow: ${(props) => (props.isSideMenuChatRoom ? "hidden" : "auto")};
  transition: left 0.3s;
  z-index: 999;

  @media (max-width: 768px) {
    width: 50%;
  }

  @media (max-width: 480px) {
    width: 70%;
  }

  @media (max-width: 320px) {
    width: 80%;
  }
`;

const TopContent = styled.div`
  padding: 0 20px 0 20px;
  display: flex;
  align-items: center;
  line-height: 70px;
`;


const NavMenuIcon = styled(Icon)`
  display: none;
  width: 50%;
  font-size: 3rem;

  > * {
    cursor: pointer;
  }
  @media (max-width: 1024px) {
    display: flex;
  }
`;

const H1 = styled.h1`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  transform: translateX(-50%);
`;

const PageLink = styled.div`
  display: flex;
  gap: 60px;

  @media (max-width: 1024px) {
    width: 100%;
    flex-direction: column;
    gap: 0;
    font-size: 2rem;
    text-align: center;
    > * {
      line-height: 3em;
      border-bottom: 1px solid ${(props) => props.theme.border};
      &:hover {
        background: ${(props) => props.theme.border};
      }
    }
    > :first-child {
      border-top: 1px solid ${(props) => props.theme.border};
    }
  }
`;

const AnalysisBox = styled.div`
  padding: 15px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;


const NavSide = ({ isWideScreen }: { isWideScreen: boolean }) => {
  const dispatch = useDispatch();

  const isAnalyzedMessagesExist = useSelector(
    (state: { isAnalyzedMessagesExistSlice: boolean }) => state.isAnalyzedMessagesExistSlice
  );

  const isDarkMode = useSelector((state: { isDarkModeSlice: boolean }) => state.isDarkModeSlice);

  const isSideMenuChatRoom = useSelector(
    (state: { isSideMenuChatRoomSelectSlice: boolean }) => state.isSideMenuChatRoomSelectSlice
  );

  const closeMenu = () => {
    dispatch(setIsSideMenuChatRoom(!isSideMenuChatRoom));
  };


  const scrollY = window.scrollY;
  const bodyStyle = document.body.style;
  useEffect(() => {
    if (isSideMenuChatRoom) {
      bodyStyle.position = "fixed";
      bodyStyle.top = `-${scrollY}px`;
      bodyStyle.overflowY = "scroll";
      bodyStyle.width = "100%";

      if (isWideScreen) {
        bodyStyle.cssText = "";
      }

      return () => {
        bodyStyle.cssText = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isSideMenuChatRoom, isWideScreen]);

  return (
    <>
      <NavSideBox isSideMenuChatRoom={isSideMenuChatRoom}>
        <TopContent>
          <NavMenuIcon>
            <HiMenu onClick={closeMenu} />
          </NavMenuIcon>
          <H1>
            <Link to="/" onClick={closeMenu}>
              <Img
                src={`${process.env.PUBLIC_URL}/images/logo/${
                  isDarkMode ? "logoGray" : "logoBlack"
                }.png`}
              />
            </Link>
          </H1>
        </TopContent>
        <PageLink>
          <Link to="/attachment" onClick={closeMenu}>
            <AnalysisBox>
              <Span fontWeight="700">분석하기</Span>
              <BsFillArrowRightCircleFill />
            </AnalysisBox>
          </Link>
          <Link to="/" onClick={closeMenu}>
            메인
          </Link>
          <Link to="/attachment" onClick={closeMenu}>
            첨부방법
          </Link>
          {isAnalyzedMessagesExist && (
            <Link to="/detail" onClick={closeMenu}>
              결과화면
            </Link>
          )}
          {isAnalyzedMessagesExist && <DashboardSideMenu />}
        </PageLink>
      </NavSideBox>
    </>
  );
};

export default NavSide;
