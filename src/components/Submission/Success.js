import React from "react";

const Success = ({ user }) => (
  <div className="submission-success">
    <h2>Thanks {user && user.displayName}, your choices are locked in.</h2>
    <h3>Good luck!</h3>
  </div>
);

export default Success;
