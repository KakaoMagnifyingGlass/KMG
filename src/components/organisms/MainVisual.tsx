import React from "react";
import Logo from "../atoms/Logo";
import Definition from "../atoms/Definition";
import styled from "styled-components";
import MainVisualButton from "../molecules/MainVisualButton";
import Paragraph from "../atoms/Paragraph";
import Span from "../atoms/Span";

const Container = styled.div`
  width: 1200px;
  padding: 80px 0;

  > :nth-child(2) {
    > * {
      margin-bottom: 10px;
    }
  }
`;
const MainVisual = () => {
  return (
    <div>
      <Container>
        <Logo />
        <Paragraph>
          <Span fontSize="22px">사용자가 선택한 기간 동안의 카카오톡 채팅방 대화 내용을 분석하여,</Span>
          <Span fontSize="22px">주요단어 및 키워드를 추출해 보여주는 웹 어플리케이션입니다.</Span>
          <Span fontSize="22px">이를 통해 사용자는 대화 내용을 한 눈에 파악하고,</Span>
          <Span fontSize="22px">효과적인 의사소통에 도움을 받을 수 있습니다.</Span>
        </Paragraph>
        {/* <Definition content="사용자가 선택한 기간 동안의 카카오톡 채팅방 대화 내용을 분석하여," />
        <Definition content="주요단어 및 키워드를 추출해 보여주는 웹 어플리케이션입니다." />
        <Definition content="이를 통해 사용자는 대화 내용을 한 눈에 파악하고," />
        <Definition content="효과적인 의사소통에 도움을 받을 수 있습니다." /> */}
        <MainVisualButton />
      </Container>
    </div>
  );
};

export default MainVisual;
