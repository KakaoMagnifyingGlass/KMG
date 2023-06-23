import React from "react";
import styled from "styled-components";
import Paragraph from "../../atoms/Paragraph";
import Img from "../../atoms/Img";
import { useNavigate } from "react-router-dom";
import ScrollIndicator from "../../molecules/common/ScrollIndicator";
import BlueButton from "../../atoms/BlueButton";
import { useSelector } from "react-redux";
import { FlexCenterDiv } from "../../atoms/FlexDiv";
import FunctionCard from "./FunctionCard";

const MainVisualContainer = styled(FlexCenterDiv)`
  position: relative;
  width: 100%;
  max-width: 1200px;
  height: calc(100vh - 70px);
  text-align: start;

  @media (max-width: 768px) {
    padding: 50px 0 0;
    max-width: 808px;
    height: auto;
    flex-direction: column;
  }
  @media (max-width: 480px) {
    max-width: 520px;
  }
  @media (max-width: 320px) {
    max-width: 360px;
    padding: 30px 0 0;
  }
`;

const AsideBox = styled.div`
  width: 40%;
  margin-right: 30px;

  @media (max-width: 768px) {
    width: 100%;
    margin-right: 0;
    text-align: center;
  }
  > :nth-child(1) {
    margin-bottom: 80px;
  }
  > :nth-child(2) {
    display: inline-block;
    text-decoration: underline;
    text-underline-position: under;
    margin-bottom: 30px;
  }
  > :last-child {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    @media (max-width: 768px) {
      bottom: 0px;
    }
  }
`;

const ArticleBox = styled.div`
  width: 60%;
  @media (max-width: 768px) {
    margin-bottom: 40px;
    width: 100%;
  }
`;

const LogoBox = styled.div`
  margin-bottom: 20px;
  font-weight: 700;
`;

const MainTitle = styled(Paragraph)`
  margin-bottom: 20px;
`;

const SubTitle = styled(Paragraph)`
  margin-bottom: 20px;
`;

const ContentText = styled(Paragraph)``;

const MainVisualImgBox = styled.div``;

interface MainVisualProps {
  onMoveToFunctionCard: () => void;
}

const MainVisual = ({ onMoveToFunctionCard }: MainVisualProps) => {
  const navigate = useNavigate();

  const isDarkMode = useSelector((state: { isDarkModeSlice: boolean }) => state.isDarkModeSlice);

  return (
    <MainVisualContainer>
      <AsideBox>
        <LogoBox>
          <MainTitle fontSize="4.8rem" fontWeight="700">
            카카오돋보기 2080
          </MainTitle>
          <SubTitle fontSize="2.6rem">20대 카톡 80대까지 간다</SubTitle>
          <ContentText fontSize="1.6rem">
            분석된 정보는 시각적으로 나타내어지며 그래프, 차트 등의 형태로 사용자에게 제공됩니다.
          </ContentText>
        </LogoBox>
        <BlueButton onClick={() => navigate("/attachment")}>GET STARTED</BlueButton>
        <ScrollIndicator onClick={() => onMoveToFunctionCard()}>
          카카오 돋보기의 분석 기능
        </ScrollIndicator>
      </AsideBox>
      <ArticleBox>
        <MainVisualImgBox>
          {/* <Img
            src={
              isDarkMode
                ? `${process.env.PUBLIC_URL}/images/main/dashboardDark.png`
                : `${process.env.PUBLIC_URL}/images/main/dashboard.png`
            }
          /> */}
          <FunctionCard />
        </MainVisualImgBox>
      </ArticleBox>
    </MainVisualContainer>
  );
};

export default MainVisual;
