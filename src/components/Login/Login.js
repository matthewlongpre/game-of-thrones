import React from "react";
import styled from "styled-components";
import { CardStyle } from "./../Player/Card";
import { FacebookButton } from "./FacebookButton";
import { GoogleButton } from "./GoogleButton";

const LoginStyled = styled.div`
  display: flex;
  padding: 40px;
  justify-content: center;
`;

export const Login = ({ user, handleLoginWithGoogleClick, handleLoginWithFacebookClick }) => {

  if (user) {
    return <LoginStyled>Signed in as {user.displayName}.</LoginStyled>
  }

  return (
    <CardStyle>
      <div style={{ textAlign: `center` }}>
        <h2>Welcome</h2>
        <p style={{ marginBottom: `40px` }}>Please sign in to get started.</p>
        <GoogleButton handleClick={handleLoginWithGoogleClick}>Sign in with Google</GoogleButton>
        <FacebookButton handleClick={handleLoginWithFacebookClick}>Sign in with Facebook</FacebookButton>
      </div>
    </CardStyle>
  );
}
