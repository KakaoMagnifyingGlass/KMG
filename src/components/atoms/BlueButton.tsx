import { ReactNode } from "react";
import styled, { css } from "styled-components";

const BlueButtonStyle = styled.button`
  margin: 0 auto;
  padding: 1.7rem 3.4rem;
  display: flex;
  justify-content: center;
  text-align: center;
  width: 18rem;
  font-size: 1.5rem;
  font-weight: 500;
  letter-spacing: 0.05rem;
  color: #fff;
  background: ${(props) => props.theme.mainBlue};
  border-radius: 3rem;
  transition: 0.3s;
  border: none;
  cursor: pointer;

  @media (max-width: 1024px) {
    width: 170px;
    font-size: 14px;
  }
  &:hover {
    background: ${(props) => props.theme.mainBlueHover};
  }

  ${(props) =>
    props.disabled &&
    css`
      background: ${props.theme.mainGray};
      cursor: not-allowed;

      &:hover {
        background: ${(props) => props.theme.mainBlack};
      }
    `}
`;

interface BlueButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children: ReactNode;
  // 필요한 다른 속성 추가
}

const BlueButton: React.FC<BlueButtonProps> = ({ onClick, disabled = false, children }) => {
  return (
    <BlueButtonStyle onClick={onClick} disabled={disabled}>
      {children}
    </BlueButtonStyle>
  );
};

export default BlueButton;
