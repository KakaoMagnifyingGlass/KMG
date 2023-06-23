import React from "react";
import styled from "styled-components";
import Span from "../atoms/Span";
import { BsGithub, BsEnvelope } from "react-icons/bs";
import Icon from "../atoms/Icon";
import Anchor from "../atoms/Anchor";
import { FlexCenterDiv, FlexColumnCenterDiv } from "../atoms/FlexDiv";

const FooterContainer = styled.div`
  background: ${(props) => props.theme.footerBackground};
  padding: 6rem 0;
`;

const ContentBox = styled(FlexColumnCenterDiv)`
  margin: 0 auto;
  max-width: 1220px;
`;

const DeveloperDescriptionBox = styled(FlexCenterDiv)`
  width: 100%;
  gap: 30px;
`;

const IconContainer = styled.div`
  display: flex;
  gap: 10px;
  color: ${(props) => props.theme.mainText};
`;

const AnchorIcon = styled(Icon)`
  font-size: 22px;
`;

const DeveloperBox = styled(FlexColumnCenterDiv)`
  margin-bottom: 30px;
  gap: 5px;
`;

const ProjectNameBox = styled.div``;

const Footer = () => {
  return (
    <FooterContainer>
      <ContentBox>
        <DeveloperDescriptionBox>
          <DeveloperBox>
            <IconContainer>
              <Anchor href="https://github.com/youngentry">
                <AnchorIcon>
                  <BsGithub />
                </AnchorIcon>
              </Anchor>
              <Anchor href="mailto:example@example.com">
                <AnchorIcon>
                  <BsEnvelope />
                </AnchorIcon>
              </Anchor>
            </IconContainer>

            <Span fontSize="16px">youngentry</Span>
          </DeveloperBox>
          <DeveloperBox>
            <IconContainer>
              <Anchor href="https://github.com/juhee067">
                <AnchorIcon>
                  <BsGithub />
                </AnchorIcon>
              </Anchor>
              <Anchor href="mailto:juhee067@gmail.com">
                <AnchorIcon>
                  <BsEnvelope />
                </AnchorIcon>
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
