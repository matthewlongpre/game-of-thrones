import React from "react";
import { Link } from "@reach/router";

export const Success = ({ user }) => {
  const gameState = localStorage.getItem("game-state");
  return (
  <div className="submission-success">
    <h2>Thanks {user && user.displayName}, your choices are locked in.</h2>
    <h3>Good luck!</h3>
    <Link to={`${gameState}/scoreboard`}>Go to Scoreboard</Link>
  </div>
);
}
