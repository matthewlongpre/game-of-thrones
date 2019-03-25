import React from "react";
import { FacebookButton } from "./FacebookButton";
import { GoogleButton } from "./GoogleButton";
import { CardStyle } from "./../Player/Card";

export const Login = ({ user, handleLoginWithGoogleClick, handleLoginWithFacebookClick }) => {

  if (user) {
    return <div>Signed in as {user.displayName}.</div>
  }

  return (
    <CardStyle>
      <div style={{ textAlign: `center` }}>
        <h2>Welcome</h2>
        <p style={{ marginBottom: `40px` }}>Please sign in to get started.</p>
      </div>
      <GoogleButton handleClick={handleLoginWithGoogleClick}>Sign in with Google</GoogleButton>
      <FacebookButton handleClick={handleLoginWithFacebookClick}>Sign in with Facebook</FacebookButton>
    </CardStyle>
  );
}
