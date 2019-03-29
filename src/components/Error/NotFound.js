import React from "react";
import styled from "styled-components";

const NotFoundStyled = styled.div`
  display: flex;
  padding: 40px;
  justify-content: center;
`;

export const NotFound = () => (
  <NotFoundStyled>Sorry, nothing here.</NotFoundStyled>
);
