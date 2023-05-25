import React, { ReactNode } from "react";
import styled, { keyframes } from "styled-components";
import Paragraph from "../atoms/Paragraph";
import { lightTheme } from "../../style/Theme";

const IndicatorBox = styled.div`
  text-align: center;
  margin: 0 auto;
  width: 300px;
  color: ${(props) => props.theme.mainGray};
  cursor: pointer;

  > :first-child {
    margin-bottom: 5px;
  }
`;

const MotionBox = styled.div`
  height: 30px;
`;

const scrollAnimation = keyframes`
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(100%);
  }
`;

const AnimatedIcon = styled.i`
  display: inline-block;
  animation: ${scrollAnimation} 1s linear infinite;
`;

interface ScrollIndicatorProps {
  children: ReactNode;
  onClick: () => void; // 클릭 이벤트 핸들러 타입 정의
}

const ScrollIndicator = ({ children, onClick }: ScrollIndicatorProps) => {
  return (
    <IndicatorBox onClick={onClick}>
      <Paragraph color={lightTheme.mainGray}>{children}</Paragraph>
      <MotionBox>
        <AnimatedIcon>V</AnimatedIcon>
      </MotionBox>
    </IndicatorBox>
  );
};
export default ScrollIndicator;
