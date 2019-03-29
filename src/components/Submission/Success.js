import { Button } from "@material-ui/core";
import { Link } from "@reach/router";
import React from "react";

export const Success = ({ user }) => {
  const gameState = localStorage.getItem("submission-state");
  return (
    <div className="submission-success">
      <h2>Thanks {user && user.displayName}, your choices are locked in.</h2>
      <h3>Good luck!</h3>
      <Link to={`${gameState}/scoreboard`}><Button variant="contained" color="primary" style={{ marginTop: `20px` }}>Go to Scoreboard</Button></Link>
    </div>
  );
}
