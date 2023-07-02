import styled, { css } from "styled-components";

interface BlueButtonProps {
  inactive?: boolean;
  disabled?: boolean;
  darkMode?: boolean;
}

const BlueButton = styled.button<BlueButtonProps>`
  margin: 0 auto;
  padding: 1.7rem 3.4rem;
  display: flex;
  justify-content: center;
  text-align: center;
  width: 18.5rem;
  font-size: 1.6rem;
  font-weight: 500;
  letter-spacing: 0.05rem;
  color: #fff;
  background: ${(props) => props.theme.mainBlue};
  border-radius: 3rem;
  transition: 0.3s;
  border: none;
  cursor: pointer;

  &:hover {
    background: ${(props) => props.theme.mainBlueHover};
    color: #fff;
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
  ${(props) =>
    props.inactive &&
    css`
      box-sizing: border-box;
      background: ${(props) => props.theme.mainWhite};
      color: ${props.darkMode ? "#fff" : props.theme.mainBlue};
      box-shadow: ${props.darkMode ? "" : "inset 0 0 0 1px " + props.theme.mainBlue};
      &:hover {
        background: ${props.darkMode && props.theme.mainGray};
      }
    `};
`;

export default BlueButton;
