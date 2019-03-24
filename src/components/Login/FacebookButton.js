import React from "react";
import styled from "styled-components";

const FacebookButtonStyled = styled.button`
  background: #4267b2;
  color: #fff;
  border: 0;
  display: flex;
  align-items: center;
  margin: auto;
  padding: 10px;
  border-radius: 2px;
  max-width: 280px;
  min-width: initial;
  width: 100%;

  svg {
    margin-right: 10px;
  }
  
  span {
    margin: 0 10px;
  }

`;

export const FacebookButton = ({ handleClick }) => (
<FacebookButtonStyled onClick={handleClick}>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 216 216" width="24" height="24" color="#FFFFFF"><path fill="#FFFFFF" d="
  M204.1 0H11.9C5.3 0 0 5.3 0 11.9v192.2c0 6.6 5.3 11.9 11.9
  11.9h103.5v-83.6H87.2V99.8h28.1v-24c0-27.9 17-43.1 41.9-43.1
  11.9 0 22.2.9 25.2 1.3v29.2h-17.3c-13.5 0-16.2 6.4-16.2
  15.9v20.8h32.3l-4.2 32.6h-28V216h55c6.6 0 11.9-5.3
  11.9-11.9V11.9C216 5.3 210.7 0 204.1 0z"></path></svg>
  <span>Sign in with Facebook</span>
</FacebookButtonStyled>
);
