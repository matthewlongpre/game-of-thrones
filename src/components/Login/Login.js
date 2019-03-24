import React from "react";
import { FacebookButton } from "./FacebookButton";
import { GoogleButton } from "./GoogleButton";

export const Login = ({ user, handleLoginWithGoogleClick, handleLoginWithFacebookClick }) => {

  if (user) {
    return <div>Signed in as {user.displayName}.</div>
  }

  return (
    <div className="login-page">
      <GoogleButton handleClick={handleLoginWithGoogleClick}>Sign in with Google</GoogleButton>
      <FacebookButton handleClick={handleLoginWithFacebookClick}>Sign in with Facebook</FacebookButton>
    </div>
  );
}
