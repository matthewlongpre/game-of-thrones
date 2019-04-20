import { Button } from "@material-ui/core";
import React from "react";
import { CardStyle } from "../Player/Card";
import { PageHeadingRow } from "./../Scoreboard/Styles";

export const GameList = ({ games, handleGameChange }) => {
  const gameRows = games.map(game =>
    <CardStyle key={game.id}>
      <Button variant="contained" color="primary" onClick={() => handleGameChange(game.id)}>{game.displayName}</Button>
    </CardStyle>
  );
  return (
    <div>
      <PageHeadingRow>
        <h2>Games</h2>
      </PageHeadingRow>
      {gameRows}
    </div>
  );
}
