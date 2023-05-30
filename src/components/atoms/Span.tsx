import styled from "styled-components";

const SpanComponent = styled.span<{
  fontSize?: string;
  fontWeight?: string;
  textAlign?: string;
  padding?: string;
}>`
  font-size: ${(props) => props.fontSize || "16px"};
  font-weight: ${(props) => props.fontWeight || "400"};
  color: ${(props) => props.color || props.theme.mainText};
  text-align: ${(props) => props.textAlign || "left"};
  padding: ${(props) => props.padding || "0"};
`;

interface SpanProps {
  children: React.ReactNode;
  fontWeight?: string;
  fontSize?: string;
  color?: string;
  textAlign?: string;
  padding?: string;
}

const Span: React.FC<SpanProps> = ({ children, fontSize, fontWeight, color, textAlign, padding }) => {
  return (
    <SpanComponent
      textAlign={textAlign}
      fontSize={fontSize}
      fontWeight={fontWeight}
      color={color}
      padding={padding}
    >
      {children}
    </SpanComponent>
  );
};

export default Span;
