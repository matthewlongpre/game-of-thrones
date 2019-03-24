import { Link } from "@reach/router";
import React from "react";

export const GameList = ({ games }) => {
  const gameRows = games.map(game => <li key={game.id}><Link to={`${game.id}/scoreboard`}>{game.displayName}</Link></li>);
  return (
    <div>
      <ul>
        {gameRows}
      </ul>
    </div>
  );
}
