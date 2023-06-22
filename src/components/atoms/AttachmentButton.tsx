import React from "react";
import styled from "styled-components";
import BlueButton from "./BlueButton";

const AttachmentButtonBox = styled.div`
  display: inline-block;
`;

const Label = styled.label`
  border-radius: 30px;
`;

const FileInput = styled.input`
  display: none;
`;

const UnderlineP = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  background: ${(props) => props.theme.mainBlue};
  padding: 1.5rem 4rem;
  border-radius: 5px;
  transition: 0.3s;
  cursor: pointer;

  @media (max-width: 1024px) {
    padding: 1.5rem 3rem;
  }

  &:hover {
    background: ${(props) => props.theme.mainBlueHover};
  }
`;

interface AttachmentButtonProps {
  children: React.ReactNode; // children prop을 추가
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const AttachmentButton: React.FC<AttachmentButtonProps> = ({ children, onChange }) => {
  return (
    <AttachmentButtonBox>
      <Label>
        <FileInput type="file" id="file" onChange={onChange} multiple />
        <UnderlineP>{children}</UnderlineP>
      </Label>
    </AttachmentButtonBox>
  );
};

export default AttachmentButton;
