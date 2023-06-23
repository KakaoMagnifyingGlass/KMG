import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import scrollToEvent from "../../../module/common/scrollToEvent";
import Icon from "../../atoms/Icon";
import { FiArrowUp } from "react-icons/fi";
import { BsShareFill } from "react-icons/bs";
import { lightTheme } from "../../../style/Theme";

const FloatingMenuContainer = styled.div<{ isFloatingMenuVisible?: boolean }>`
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  opacity: 0;
  visibility: hidden;
  transition: 0.3s;
  opacity: ${({ isFloatingMenuVisible }) => (isFloatingMenuVisible ? 1 : 0)};
  visibility: ${({ isFloatingMenuVisible }) => (isFloatingMenuVisible ? "visible" : "hidden")};
  z-index: 900;

  > * {
    padding: 10px;
    transition: 0.3s;
    border-radius: 25%;
    font-size: 24px;
    color: ${lightTheme.mainWhite};
    background: ${(props) => props.theme.mainBlue};
    cursor: pointer;
    &:hover {
      background: ${(props) => props.theme.mainBlueHover};
    }
  }
`;

const ShareIcon = styled(Icon)``;

const ScrollUpIcon = styled(Icon)``;

const copyClipBoard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    alert("클립보드에 주소가 복사되었어요.");
  } catch (err) {
    console.log(err);
  }
};

const handleClickCShareButton = () => {
  const url = "쥬희무쩅이넹~ㅇㅅㅇ~";
  copyClipBoard(url);
};

const FloatingMenu = () => {
  const [isFloatingMenuVisible, setIsFloatingMenuVisible] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setIsFloatingMenuVisible(true);
    } else {
      setIsFloatingMenuVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <FloatingMenuContainer isFloatingMenuVisible={isFloatingMenuVisible}>
      <ShareIcon onClick={() => handleClickCShareButton()} fontSize={"100px"}>
        <BsShareFill />
      </ShareIcon>
      <ScrollUpIcon onClick={() => scrollToEvent(0, "smooth")}>
        <FiArrowUp />
      </ScrollUpIcon>
    </FloatingMenuContainer>
  );
};

export default FloatingMenu;
