import React from "react";
import Span from "../../atoms/Span";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedOsIndex } from "../../../store/reducer/selectedOsIndexSlice";
import { AiFillWindows, AiFillApple, AiFillAndroid } from "react-icons/ai";
import { SiIos } from "react-icons/si";
import Icon from "../../atoms/Icon";
import { lightTheme } from "../../../style/Theme";

const OsListBox = styled.ul`
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 2.5rem;

  @media (max-width: 1200px) {
    flex-wrap: nowrap;
  }
  @media (max-width: 520px) {
    flex-wrap: wrap;
    margin: 0 auto;
    width: 80%;
    max-width: 480px;
    gap: 1.5rem;
  }

  /* > :nth-child(2) {
    > :first-child {
      transform: scale(98%) translateY(-3px);
    }
  }
  > :nth-child(3) {
    > :first-child {
      transform: scale(96%);
    }
  } */
`;

const OsIconBox = styled.li<{ size?: string; color?: string; fontSize?: string }>`
  padding: 1rem;
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
  flex-direction: column;
  border-radius: 5px;
  transition: 0.2s;
  cursor: pointer;

  @media (max-width: 520px) {
    padding: 0.25rem;
  }

  /* > :nth-child(2) {
  } */

  > :first-child {
    width: ${(props) => props.size || "6.5rem"};
    font-size: ${(props) => props.fontSize || "6rem"};
    @media (max-width: 520px) {
      width: ${(props) => props.size || "6.5rem"};
      font-size: ${(props) => props.fontSize || "5rem"};
    }
  }

  &:hover {
    color: ${(props) => props.theme.mainBlueHover};
    box-shadow: 0px 0px 9px 3px ${(props) => props.theme.mainBlue};
  }

  &.active {
    color: ${(props) => props.theme.mainBlue};
    box-shadow: 0px 0px 7px 1px ${(props) => props.theme.mainBlue};
  }

  &.dark {
    &:hover {
      box-shadow: none;
      color: #fff;
      background: #888888;
    }

    &.active {
      box-shadow: none;
      color: #fff;
      background: #555555;
    }
  }
`;

const OsRowBox = styled.div`
  display: flex;
  gap: 2.5rem;
  @media (max-width: 520px) {
    gap: 1.5rem;
  }
`;

const OsIcon = styled(Icon)``;

const osData = [
  {
    id: 1,
    icon: <AiFillWindows />,
    os: "Window",
  },
  {
    id: 2,
    icon: <AiFillApple />,
    os: "MacOS",
  },
  {
    id: 3,
    icon: <AiFillAndroid />,
    os: "Android",
  },
  {
    id: 4,
    icon: <SiIos />,
    os: "IOS",
  },
];
interface OsData {
  id: number;
  icon: JSX.Element;
  os: string;
}

type OsListProps = {
  color?: string;
};

const OsList = ({ color }: OsListProps) => {
  const dispatch = useDispatch();

  const selectedOsIndex = useSelector(
    (state: { selectedOsIndexSlice: number }) => state.selectedOsIndexSlice
  );
  const isDarkMode = useSelector((state: { isDarkModeSlice: boolean }) => state.isDarkModeSlice);

  return (
    <OsListBox>
      <OsRowBox>
        {osData.slice(0, 2).map((data: OsData) => {
          return (
            <OsIconBox
              key={data.id}
              className={`${selectedOsIndex === data.id ? "active" : ""} ${isDarkMode ? "dark" : ""}`}
              color={color}
              onClick={() => dispatch(setSelectedOsIndex(data.id))}
            >
              <OsIcon color={`${selectedOsIndex === data.id ? lightTheme.mainBlue : ""}`}>
                {data.icon}
              </OsIcon>
              <Span>{data.os}</Span>
            </OsIconBox>
          );
        })}
      </OsRowBox>
      <OsRowBox>
        {osData.slice(2, 4).map((data: OsData) => {
          return (
            <OsIconBox
              key={data.id}
              className={`${selectedOsIndex === data.id ? "active" : ""} ${isDarkMode ? "dark" : ""}`}
              color={color}
              onClick={() => dispatch(setSelectedOsIndex(data.id))}
            >
              <OsIcon color={`${selectedOsIndex === data.id ? lightTheme.mainBlue : ""}`}>
                {data.icon}
              </OsIcon>
              <Span>{data.os}</Span>
            </OsIconBox>
          );
        })}
      </OsRowBox>
    </OsListBox>
  );
};

export default OsList;
