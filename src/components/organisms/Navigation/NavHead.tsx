import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Img from "../../atoms/Img";
import { useDispatch } from "react-redux";
import { setIsDarkMode } from "../../../store/reducer/common/isDarkModeSlice";
import { HiMenu } from "react-icons/hi";
import Icon from "../../atoms/Icon";
import { NavProps } from "../../sections/navigation/Navigation";
import { FlexCenterDiv } from "../../atoms/FlexDiv";
import { setIsModalVisible } from "../../../store/reducer/dashboard/isModalVisibleSlice";
import DarkModeButton from "../../molecules/navigation/DarkModeButton";

const NavHeadContainer = styled.div`
  margin: 0 auto;
  padding: 0 20px;
  max-width: 1240px;
  display: flex;
  justify-content: space-between;
  font-weight: 500;
  line-height: 80px;

  > * {
    flex: 1;
  }
  @media (max-width: 1200px) {
    line-height: 70px;
  }
`;

const H1 = styled.h1`
  display: flex;
  height: 40px;
  &.active {
    width: 120px;
    transform: translateY(-22px);
  }
  @media (max-width: 1200px) {
    justify-content: center;
  }
`;

const MenuBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 4.5rem;
`;

const Menus = styled(FlexCenterDiv)`
  font-size: 2.2rem;
  gap: 4.5rem;
  @media (max-width: 1200px) {
    display: none;
  }
`;

const MobileMenuBox = styled.div`
  display: none;

  @media (max-width: 1200px) {
    display: flex;
    transform: translateY(4px);
  }
`;

const MobileMenuIcon = styled(Icon)`
  font-size: 3rem;
  cursor: pointer;
`;

interface NavHeadProps extends NavProps {}

const NavHead: React.FC<NavHeadProps> = ({ closeMenu, isDarkMode, isAnalyzedMessagesExist }) => {
  const dispatch = useDispatch();

  const debounceTimeoutRef = useRef<number | null>(null);

  const [theme, setTheme] = useState("light");

  const switchTheme = "light" === theme ? "dark" : "light";

  const handleClickDarkModeButton = () => {
    if (debounceTimeoutRef.current === null) {
      setTheme(switchTheme);
      dispatch(setIsDarkMode(!isDarkMode));

      debounceTimeoutRef.current = window.setTimeout(() => {
        debounceTimeoutRef.current = null;
      }, 300);
    }
  };

  const handleClickMenu = () => {
    dispatch(setIsModalVisible(false));
    closeMenu();
  };

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  return (
    <NavHeadContainer>
      <MobileMenuBox>
        <MobileMenuIcon onClick={handleClickMenu}>
          <HiMenu />
        </MobileMenuIcon>
      </MobileMenuBox>
      <H1>
        <Link to="/">
          <Img
            src={`${process.env.PUBLIC_URL}/images/logo/${isDarkMode ? "logoGray" : "logoBlack"}.png`}
          />
        </Link>
      </H1>
      <MenuBox>
        <Menus>
          <Link to="/attachment">분석하기</Link>
          {isAnalyzedMessagesExist && <Link to="/dashboard">대시보드</Link>}
          {isAnalyzedMessagesExist && <Link to="/detail">상세보기</Link>}
          <Link to="/users">로그인</Link>
          <Link to="/posts">게시판</Link>
        </Menus>
        <DarkModeButton isDarkMode={isDarkMode} handleClickDarkModeButton={handleClickDarkModeButton} />
      </MenuBox>
    </NavHeadContainer>
  );
};

export default NavHead;
