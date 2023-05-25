import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Span from "../atoms/Span";

const TempGraphBox = styled.div`
  height: 100%;
  padding: 10px;
  margin: 0 auto;
`;

type GraphBoxProps = {
  id: string;
  message: string;
  graph: JSX.Element;
};
const GraphBox = ({ data }: { data: GraphBoxProps }) => {
  const isAnalyzedMessagesExist = useSelector(
    (state: { isAnalyzedMessagesExistSlice: boolean }) => state.isAnalyzedMessagesExistSlice
  );
  return (
    <TempGraphBox key={data.id}>
      <Span>{data.message}</Span>
      {isAnalyzedMessagesExist && data.graph}
    </TempGraphBox>
  );
};

export default GraphBox;
