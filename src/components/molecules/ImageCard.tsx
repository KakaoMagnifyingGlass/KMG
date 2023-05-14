import React, { ReactNode } from "react";
import styled from "styled-components";
import Img from "../atoms/Img";
import Paragraph from "../atoms/Paragraph";

const ImageCardBox = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 500px;

  > :first-child {
    margin-bottom: 10px;
  }

  > :nth-child(2) {
    margin-bottom: 10px;
  }
`;

interface ImageCardProps {
  src: string;
  children: ReactNode;
}

const ImageCard = ({ children, src }: ImageCardProps) => {
  return (
    <ImageCardBox>
      <Img src={src} />
      <Paragraph>{children}</Paragraph>
    </ImageCardBox>
  );
};

export default ImageCard;