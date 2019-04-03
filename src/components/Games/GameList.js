import React from "react";
import { CardStyle } from "../Player/Card";
import { PageHeadingRow } from "./../Scoreboard/Styles";

export const GameList = ({ games, handleGameChange }) => {
  const gameRows = games.map(game => <CardStyle key={game.id}><button onClick={() => handleGameChange(game.id)}>{game.displayName}</button></CardStyle>);
  return (
    <div>
      <PageHeadingRow>
        <h2>Games</h2>
      </PageHeadingRow>
      {gameRows}
    </div>
  );
}
