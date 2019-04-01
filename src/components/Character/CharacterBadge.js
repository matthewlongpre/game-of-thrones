import React from "react";
import { Avatar } from "./Avatar";
import styled from "styled-components";
import { PointsBadge } from "./PointsBadge";

const CharacterBadgeStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const CharacterBadge = ({ name, id, points, size, result, hidePoints }) => (
  <CharacterBadgeStyle>
    <Avatar name={name} id={id} size={size} result={result} />
    {!hidePoints && <PointsBadge size={size} marginTop points={points} />}
  </CharacterBadgeStyle>
);