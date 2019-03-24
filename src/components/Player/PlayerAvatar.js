import React from "react";
import styled from "styled-components";

const PlayerAvatarContainer = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;

  img {
    max-width: 100%;
  }
`;

export const PlayerAvatar = ({ name, photoURL }) => (
  <PlayerAvatarContainer>
    <img alt={name} src={photoURL} />
  </PlayerAvatarContainer>
);
