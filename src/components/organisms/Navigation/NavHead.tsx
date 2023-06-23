import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Img from "../../atoms/Img";
import { useDispatch } from "react-redux";
import { darkTheme, lightTheme } from "../../../style/Theme";
import { setIsDarkMode } from "../../../store/reducer/common/isDarkModeSlice";
import { BsFillBrightnessHighFill, BsFillMoonStarsFill } from "react-icons/bs";
import { HiMenu } from "react-icons/hi";
import Icon from "../../atoms/Icon";
import { NavProps } from "../../sections/navigation/Navigation";

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
  @media (max-width: 1024px) {
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
  @media (max-width: 1024px) {
    justify-content: center;
    width: 120px;
  }
`;

const MenuBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 20px;
`;

const PcMenu = styled.div`
  display: flex;
  gap: 60px;
  align-items: center;
  font-size: 2.2rem;
  @media (max-width: 1024px) {
    display: none;
  }
`;

const DarkModeButton = styled.div`
  position: relative;
  width: 80px;
  height: 40px;
  cursor: pointer;

  > * {
    color: ${lightTheme.navBackground};
    background: ${darkTheme.navBackground};
    pointer-events: none;
  }
  &.active {
    > * {
      color: ${darkTheme.navBackground};
      background: ${lightTheme.navBackground};
    }
    > :nth-child(1) {
      left: 44px;
      background: ${darkTheme.navBackground};
      @media (max-width: 1024px) {
        left: 37px;
      }
    }
  }
  @media (max-width: 1024px) {
    width: 66px;
    height: 33px;
  }
`;

const ToggleCircle = styled.div`
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 5px;
  width: calc(50% - 8px);
  border-radius: 50%;
  z-index: 1;
  background: #fff;
`;

const IconBox = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: 25px;
  font-size: 2rem;
  > * {
    flex: 1;
  }
`;

const PageLink = styled.div`
  display: flex;
  gap: 60px;
`;

// const NoticeBox = styled(FlexCenterDiv)`
//   display: none;
//   position: absolute;
//   top: 110%;
//   left: 50%;
//   padding: 0px;
//   width: 220%;
//   height: 60%;
//   font-size: 14px;
//   font-weight: 500;
//   transform: translateX(-50%);
// `;

const MobileMenuBox = styled.div`
  display: none;

  @media (max-width: 1024px) {
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
  // const isDetailPage = useLocation().pathname.includes("detail");
  // const isDashboardPage = useLocation().pathname.includes("dashboard");

  const handleClickDarkModeButton = () => {
    dispatch(setIsDarkMode(!isDarkMode));
  };

  return (
    <NavHeadContainer>
      <MobileMenuBox>
        <MobileMenuIcon onClick={closeMenu}>
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
        <PcMenu>
          <PageLink>
            <Link to="/attachment">분석하기</Link>
            {isAnalyzedMessagesExist && <Link to="/dashboard">결과화면</Link>}
          </PageLink>
        </PcMenu>
        <DarkModeButton className={`${isDarkMode && "active"}`} onClick={handleClickDarkModeButton}>
          <ToggleCircle></ToggleCircle>
          <IconBox>
            <BsFillBrightnessHighFill />
            <BsFillMoonStarsFill />
          </IconBox>
          {/* {(isDetailPage || isDashboardPage) && <NoticeBox>다크모드로 볼 때 더 잘보여요.</NoticeBox>} */}
        </DarkModeButton>
      </MenuBox>
    </NavHeadContainer>
  );
};

export default NavHead;
