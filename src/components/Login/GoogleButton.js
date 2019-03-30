import React from "react";
import styled from "styled-components";

import * as google from "./../../assets/google.png";

const GoogleButtonStyled = styled.button`
  background: none;
  border: 0;
  margin: auto auto 20px;

  img {
    height: 46px;
  }
`;

export const GoogleButton = ({ handleClick }) => (
  <GoogleButtonStyled onClick={handleClick}>
    <img src={google} alt="Sign in with Google"/>
  </GoogleButtonStyled>
);