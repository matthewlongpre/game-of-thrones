import { Link } from "@reach/router";
import React from "react";
import { CardStyle } from "../Player/Card";
import { PageHeadingRow } from "./../Scoreboard/Styles";

export const GameList = ({ games }) => {
  const gameRows = games.map(game => <CardStyle key={game.id}><Link to={`${game.id}`}>{game.displayName}</Link></CardStyle>);
  return (
    <div>
      <PageHeadingRow>
        <h2>Games</h2>
      </PageHeadingRow>
      {gameRows}
    </div>
  );
}
