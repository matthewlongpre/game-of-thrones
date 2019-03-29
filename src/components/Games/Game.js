import React from "react";
import { Scoreboard } from "../Scoreboard/Scoreboard";
import { Submission } from "../Submission/Submission";

export class Game extends React.Component {
  render() {
    const { user, gameId, currentGame, userGamesChecked } = this.props;

    if (!userGamesChecked) return <></>

    if (currentGame) {
      return <Scoreboard user={user} gameId={gameId} />
    }

    console.log("no current game", currentGame)
    return <Submission user={user} gameId={gameId} />

  }
}
