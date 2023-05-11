import React from "react";
import styled from "styled-components";
const TitleText = styled.div<{ fontSize?: string }>`
  font-size: ${(props) => props.fontSize};
  color: ${(props) => props.theme.mainGrey};
  margin-bottom: 50px;
`;
const SubTitle = ({ title }: { title: string }) => {
  return <TitleText fontSize="20px">{title}</TitleText>;
};

export default SubTitle;
