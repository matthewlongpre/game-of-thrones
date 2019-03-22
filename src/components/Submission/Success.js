import React from "react";

export const Success = ({ user }) => (
  <div className="submission-success">
    <h2>Thanks {user && user.displayName}, your choices are locked in.</h2>
    <h3>Good luck!</h3>
  </div>
);
