import { createGlobalStyle } from "styled-components";
import PretendardThin from "../fonts/PretendardThin.woff2";
import PretendardLight from "../fonts/PretendardLight.woff2";
import PretendardRegular from "../fonts/PretendardRegular.woff2";
import PretendardMedium from "../fonts/PretendardMedium.woff2";
import PretendardBold from "../fonts/PretendardBold.woff2";
import PretendardBlack from "../fonts/PretendardBlack.woff2";

const GlobalStyle = createGlobalStyle`
  @font-face {
    src: local('PretendardThin'), local('PretendardThin'), url(${PretendardThin}) format('woff2');
    font-family: '100';
    font-style: normal;
    
  }
  @font-face {
    src: local('PretendardLight'), local('PretendardLight'), url(${PretendardLight}) format('woff2');
    font-family: '300';
    font-style: normal;
    
  }
  @font-face {
    src: local('PretendardRegular'), local('PretendardRegular'), url(${PretendardRegular}) format('woff2');
    font-family: '400';
    font-style: normal;
    
  }
  @font-face {
    src: local('PretendardMedium'), local('PretendardMedium'), url(${PretendardMedium}) format('woff2');
    font-family: '500';
    font-style: normal;
    
  }
  @font-face {
    src: local('PretendardBold'), local('PretendardBold'), url(${PretendardBold}) format('woff2');
    font-family: '700';
    font-style: normal;
    
  }
  @font-face {
    src: local('PretendardBlack'), local('PretendardBlack'), url(${PretendardBlack}) format('woff2');
    font-family: '900';
    font-style: normal;
    
  }

html {
  box-sizing: border-box;
  font-size: 10px;
  background: ${(props) => props.theme.mainBackground};
  @media (max-width: 768px) {
	font-size: 8px;
  }
}

*,
*:before,
*:after {
  box-sizing: inherit;
}


body {
  font-family: "400";
  margin: 0;
  padding: 0;
  font-weight: normal;
  line-height: 1;
  letter-spacing: -0.025em;
}

ul,
ol,
li,
dl,
dt,
dd {
  margin: 0;
  padding: 0;
  list-style: none;
}

p,
h1,
h2,
h3,
h4,
h5,
h6,
figure {
  margin: 0;
  padding: 0;
  font-size: inherit;
  font-weight: inherit;
}

a {
  color: inherit;
  text-decoration: none;
}

img {
  border: 0;
  vertical-align: middle;
  font-size: 0;
  max-width: 100%;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
}

select,
input,
textarea,
button {
  font-size: inherit;
  font-family: "Noto Sans KR";
  font-weight: inherit;
  margin: 0;
}

select,
input,
button {
  vertical-align: middle;
}

b,
strong {
  font-weight: normal;
}

address,
em,
i {
  font-style: normal;
}

hr {
  margin: 0;
  padding: 0;
  border: none;
  display: block;
}

header,
footer,
article,
section,
aside,
nav,
main {
  display: block;
}

button,
input,
select,
textarea {
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  margin: 0;
}

/* screen reader only */
.sr-only,
.hidden,
.blind,
.IR {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

/* Skip to content */
.skip-to {
  position: absolute;
  top: -99px;
  left: 0;
  background: #333;
  color: #fff;
  width: 100%;
  padding: 10px 0;
  text-align: center;
  text-decoration: none;
  z-index: 999;
}

.skip-to:hover,
.skip-to:focus,
.skip-to:active {
  display: block;
  top: 0;
}

.row:after,
.row:before {
  content: "";
  display: block;
}

.row:after {
  clear: both;
}

`;
export default GlobalStyle;
