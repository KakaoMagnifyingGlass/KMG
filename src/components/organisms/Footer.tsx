import React from "react";
import styled from "styled-components";
import Span from "../atoms/Span";
import { BsGithub, BsEnvelope } from "react-icons/bs";
import Icon from "../atoms/Icon";
import Anchor from "../atoms/Anchor";

const FooterContainer = styled.div`
  width: 100%;
  background-color: ${(props) => props.theme.footerBackground};
  padding: 60px 0;
  @media (max-width: 768px) {
    padding: 40px 0;
  }
`;
const ContentBox = styled.div`
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  max-width: 1220px;
  min-width: 769px;
  @media (max-width: 768px) {
    width: calc(100%);
    min-width: 360px;
  }
`;

const DeveloperDescriptionBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  gap: 30px;
`;

const IconContainer = styled.div`
  display: flex;
  gap: 10px;
  color: ${(props) => props.theme.mainText};
`;

const DeveloperBox = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 5px;
`;

const ProjectNameBox = styled.div`
  padding-top: 10px;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <ContentBox>
        <DeveloperDescriptionBox>
          <DeveloperBox>
            <IconContainer>
              <Anchor href="https://github.com/youngentry">
                <Icon fontSize="22px">
                  <BsGithub />
                </Icon>
              </Anchor>
              <Anchor href="mailto:example@example.com">
                <Icon fontSize="22px">
                  <BsEnvelope />
                </Icon>
              </Anchor>
            </IconContainer>

            <Span fontSize="16px">youngentry</Span>
          </DeveloperBox>
          <DeveloperBox>
            <IconContainer>
              <Anchor href="https://github.com/juhee067">
                <Icon fontSize="22px">
                  <BsGithub />
                </Icon>
              </Anchor>
              <Anchor href="mailto:juhee067@gmail.com">
                <Icon fontSize="22px">
                  <BsEnvelope />
                </Icon>
              </Anchor>
            </IconContainer>
            <Span fontSize="16px">juhee067</Span>
          </DeveloperBox>
        </DeveloperDescriptionBox>
        <ProjectNameBox>
          <Span fontSize="14px" color="gray">
            카카오 돋보기(Kakao Magnifying Glass) 2023
          </Span>
        </ProjectNameBox>
      </ContentBox>
    </FooterContainer>
  );
};

export default Footer;
