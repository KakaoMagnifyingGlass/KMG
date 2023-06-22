import React from "react";
import styled from "styled-components";
import Span from "../../atoms/Span";

const HeaderContentBox = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  > :nth-child(2) {
    margin-top: 12px;
  }
`;

type headerContentProps = {
  headerTitle: string;
  headerContent: string;
};

const DashboardHeaderContent = ({ data }: { data: headerContentProps }) => {
  return (
    <HeaderContentBox>
      <Span color="#7e848a">{data.headerTitle}</Span>
      <Span fontSize="24px" fontWeight="700" textAlign="right">
        {data.headerContent}
      </Span>
    </HeaderContentBox>
  );
};

export default DashboardHeaderContent;
