import React from "react";
import styled from "styled-components";

const TopBarStyle = styled.div`
  background: #fff;
  height: 30px;
  display: flex;
  justify-content: flex-end;

  button {
    background: transparent;
    border: 0;
    padding: 0 20px;
    text-transform: uppercase;
    font-size: 66%;
    letter-spacing: 1.5px;
  }

`;

export const TopBar = ({ handleLogout }) => (
  <TopBarStyle>
    <button onClick={handleLogout}>Sign out</button>
  </TopBarStyle>
);