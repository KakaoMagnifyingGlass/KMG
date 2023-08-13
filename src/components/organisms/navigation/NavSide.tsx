import React, { useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Img from "../../atoms/Img";
import { HiMenu } from "react-icons/hi";
import Icon from "../../atoms/Icon";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import DashboardSideMenu from "../../sections/dashboard/DashboardSideMenu";
import { useSelector } from "react-redux";
import { NavProps } from "../../sections/navigation/Navigation";
import { FlexCenterDiv, FlexColumnDiv, FlexRowDiv } from "../../atoms/FlexDiv";
import Paragraph from "../../atoms/Paragraph";
import { zIndex } from "../../../style/specifiedCss/zIndex";
import { UserData } from "../../../@types/index.d";
import LogOutButton from "../login/LogOutButton";

const NavSideBox = styled(FlexColumnDiv)<{ isSideMenuChatRoom: boolean }>`
  position: absolute;
  top: 0;
  left: ${(props) => (props.isSideMenuChatRoom ? "0" : "-100%")};
  width: 30%;
  min-width: 260px;
  height: 100vh;
  background: var(--mainWhite);
  overflow: ${(props) => (props.isSideMenuChatRoom ? "hidden" : "auto")};
  transition: left 0.3s;
  z-index: ${zIndex.navSide};
`;


const TopContent = styled.div`
  padding: 0 20px 0 20px;
  display: flex;
  align-items: center;
  line-height: 7rem;
  border-bottom: 1px solid var(--border);
`;


const NavMenuIcon = styled(Icon)`
  display: none;
  width: 50%;
  font-size: 3rem;

  > * {
    cursor: pointer;
  }
  @media (max-width: 1200px) {
    display: flex;
  }
`;


const H2 = styled.div`
  width: 120px;
  transform: translateX(-50%);
`;


const PageLink = styled(FlexColumnDiv)`
  width: 100%;
  font-size: 2rem;
  text-align: center;
  line-height: 5rem;

  > * {
    border-bottom: 1px solid var(--border);
    &:hover {
      background: var(--border);
    }
  }
  @media (max-width: 768px) {
    line-height: 5rem;
  }
`;


const UserBox = styled(FlexCenterDiv)`
height: 60px;
justify-content: center;
font-size: 1.5rem;
font-weight: 500;
background-color: #f3f3f3;
`;





const LogOutAuth = styled(FlexRowDiv)`
align-items: center;
gap:10px;
overflow:hidden;  
`;


const Profile = styled.img`
 width: 40px;
 height:40px;
 border: 1px solid #ddd;
 border-radius: 40px;
`;




const AnalysisBox = styled(FlexCenterDiv)`
  padding: 15px 0;
  gap: 10px;
`;


const AnalysisMenu = styled(Paragraph)`
  font-weight: 700;
  font-size: 2.2rem;
`;


const NavSideContainer = styled.div<{ isWideScreen?: Boolean }>`
  display: ${(props) => (props.isWideScreen ? "none" : "block")};
`;


const NavSideShadow = styled.div<{ isSideMenuVisible?: Boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  background: var(--mainBlack);
  visibility: ${(props) => (props.isSideMenuVisible ? "visible" : "hidden")};
  opacity: ${(props) => (props.isSideMenuVisible ? "0.6" : "0")};
  z-index: ${zIndex.navSideShadow};
`;


interface NavSideMenuProps extends NavProps {
  isWideScreen: boolean;
}

const scrollY = window.scrollY;
const bodyStyle = document.body.style;

const NavSide: React.FC<NavSideMenuProps> = ({
  closeMenu,
  isWideScreen,
  isDarkMode,
  isAnalyzedMessagesExist,
}) => {
  const userData = useSelector((state: { userLoginDataSlice: UserData }) => state.userLoginDataSlice);

  const isSideMenuChatRoom = useSelector(
    (state: { isSideMenuChatRoomSelectSlice: boolean }) => state.isSideMenuChatRoomSelectSlice
  );

  const handleClickGoToDescription = () => {
    closeMenu();
  };

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

  const isSideMenuVisible = !isWideScreen && isSideMenuChatRoom;

  return (
    <NavSideContainer isWideScreen={isWideScreen}>
      <NavSideBox isSideMenuChatRoom={isSideMenuChatRoom}>
        <TopContent>
          <NavMenuIcon>
            <HiMenu onClick={closeMenu} />
          </NavMenuIcon>
          <H2 as="h2">
            <Link to="/" onClick={closeMenu}>
              <Img
                src={`${process.env.PUBLIC_URL}/images/logo/${
                  isDarkMode ? "logoGray" : "logoBlack"
                }.png`}
              />
            </Link>
          </H2>
        </TopContent>
        <PageLink>
          
         
          <Link to="/attachment#analysis" onClick={closeMenu}>
            <AnalysisBox>
              <AnalysisMenu>분석하기</AnalysisMenu>
              <BsFillArrowRightCircleFill />
            </AnalysisBox>
          </Link>
          <Link to="/" onClick={closeMenu}>
            메인
          </Link>
          <Link to={`/attachment#description`} onClick={handleClickGoToDescription}>
            첨부방법
          </Link>
          {isAnalyzedMessagesExist && (
            <Link to="/dashboard" onClick={closeMenu}>
              대시보드
            </Link>
          )}
          {isAnalyzedMessagesExist && (
            <Link to="/detail" onClick={closeMenu}>
              상세보기
            </Link>
          )}
        </PageLink>
        {isAnalyzedMessagesExist && !isWideScreen && <DashboardSideMenu isSideMenu />}

        <UserBox>
              {userData.userId ? (
                 <LogOutAuth onClick={closeMenu}>
                 <Profile src={`${process.env.PUBLIC_URL}/images/user.jpg`} className="w-40 h-40" alt="" />
                 <LogOutButton />
                 </LogOutAuth>
              ) : (
                <Link to="/users/login" onClick={closeMenu}>
                    로그인
                  </Link>
              )}
            </UserBox>
      </NavSideBox>
      <NavSideShadow onClick={closeMenu} isSideMenuVisible={isSideMenuVisible} />
    </NavSideContainer>
  );
};

export default NavSide;
