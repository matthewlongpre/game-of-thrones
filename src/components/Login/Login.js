import React from "react";
import { firebase } from "./../../shared/firebase";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

export const Login = ({ user, uiConfig }) => (
  <div className="login-page">
    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
  </div>
);
