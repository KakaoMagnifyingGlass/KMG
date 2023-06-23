import React from "react";
import styled from "styled-components";
import ImageCard from "../molecules/ImageCard";

const ThreeImagesBox = styled.div`
  padding: 0 10px;
  display: flex;
  gap: 30px;
  justify-content: center;
  align-items: center;
  max-width: 1220px;
  height: 100%;
  text-align: center;
  > * {
    justify-content: center;
  }
  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

export interface CardData {
  src: string;
  text: string;
}

interface ThreeImagesProps {
  srcAndText: CardData[];
}

const ThreeImages = ({ srcAndText }: ThreeImagesProps) => {
  return (
    <ThreeImagesBox>
      {srcAndText.map((item) => {
        return <ImageCard src={item.src}>{item.text}</ImageCard>;
      })}
    </ThreeImagesBox>
  );
};

export default ThreeImages;
