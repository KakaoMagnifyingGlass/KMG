import React, { useEffect } from "react";
import styled from "styled-components";
import scrollToEvent from "../../module/common/scrollToEvent";
import DashboardSection from "../sections/dashboard/DashboardSection";
import DashboardSideMenu from "../sections/dashboard/DashboardSideMenu";

const DashboardBox = styled.div`
  margin-top: 80px;
  display: flex;
  width: 100%;

  > :nth-child(1) {
    width: 15%;
  }
  > :nth-child(2) {
    width: 85%;
  }
`;

const DashboardPage = () => {
  useEffect(() => {
    scrollToEvent(0, "auto");
  }, []);

  return (
    <DashboardBox>
      <DashboardSideMenu />
      <DashboardSection />
    </DashboardBox>
  );
};

export default DashboardPage;
