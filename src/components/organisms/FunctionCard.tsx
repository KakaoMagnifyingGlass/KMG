import React from "react";
import styled from "styled-components";
import CardContent from "../molecules/CardContent";
import Title from "../molecules/Title";
const Container = styled.div`
  width: 1200px;
  padding: 80px 0;
`;
const Card = styled.div`
  display: flex;
  border-radius: 10px;
  margin: 0 auto;
  width: 1000px;
  height: 500px;
  box-shadow: 2px 0px 10px 0px #ddd;
`;
const TextArea = styled.div`
  width: 50%;
  padding: 70px 60px;
`;
const ImgArea = styled.div`
  width: 50%;
  border-radius: 0 10px 10px 0;
  background: ${(props) => props.theme.mainBlue};
`;
const FunctionCard = () => {
  return (
    <Container>
      <Card>
        <TextArea>
          <Title />
          <CardContent />
        </TextArea>
        <ImgArea></ImgArea>
      </Card>
    </Container>
  );
};

export default FunctionCard;
