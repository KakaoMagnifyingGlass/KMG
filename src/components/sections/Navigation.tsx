import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { setIsSideMenuChatRoom } from "../../store/reducer/isSideMenuChatRoomSelectSlice";
import NavHead from "../organisms/Navigation/NavHead";
import NavSideMenu from "../organisms/Navigation/NavSide";
import { darkTheme } from "../../style/Theme";

const NavigationContainer = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  color: ${(props) => props.theme.mainText};
  border-bottom: ${(props) => (props.theme === darkTheme ? "none" : `1px solid ${props.theme.border}`)};
  z-index: 999;
  user-select: none;
  background: ${(props) => props.theme.navBackground};
`;

export interface NavProps {
  closeMenu: () => void;
  isDarkMode: boolean;
  isAnalyzedMessagesExist: boolean;
}

const Navigation = () => {
  const dispatch = useDispatch();

  const isAnalyzedMessagesExist = useSelector(
    (state: { isAnalyzedMessagesExistSlice: boolean }) => state.isAnalyzedMessagesExistSlice
  );
  const isSideMenuChatRoom = useSelector(
    (state: { isSideMenuChatRoomSelectSlice: boolean }) => state.isSideMenuChatRoomSelectSlice
  );
  const isDarkMode = useSelector((state: { isDarkModeSlice: boolean }) => state.isDarkModeSlice);

  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 1024);

  const closeMenu = () => {
    dispatch(setIsSideMenuChatRoom(!isSideMenuChatRoom));
  };

  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth > 1024);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const navHeadProps = {
    closeMenu,
    isDarkMode,
    isAnalyzedMessagesExist,
  };

  const navSideProps = {
    ...navHeadProps,
    isWideScreen,
  };

  return (
    <NavigationContainer>
      <NavHead {...navHeadProps} />
      <NavSideMenu {...navSideProps} />
    </NavigationContainer>
  );
};

export default Navigation;
