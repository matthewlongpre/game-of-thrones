import React from "react";
import { Scoreboard } from "../Scoreboard/Scoreboard";
import { Submission } from "../Submission/Submission";

export class Game extends React.Component {
  render() {
    const { user, gameId, currentGame, userGamesChecked, isInvite } = this.props;

    if (!userGamesChecked) return <></>

    if (currentGame && !isInvite) {
      return <Scoreboard user={user} gameId={gameId} />
    }

    return <Submission user={user} gameId={gameId} />

  }
}
