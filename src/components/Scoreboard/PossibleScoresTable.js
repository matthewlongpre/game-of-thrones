import React from "react";
import { CardStyle, ListLabel } from "../Player/Card";
import { EpisodeRowStyled } from "./Styles";

export const PossibleScoresTable = ({ players }) => {
  players.sort((a, b) => a.playerPossiblePoints.totalPossibleRemainingPoints < b.playerPossiblePoints.totalPossibleRemainingPoints ? 1 : -1);

  const playerCards = players.map(player => {
    const { name, playerPossiblePoints: { playerBetsStillPossiblePoints, playerDeathsStillPossiblePoints, playerPossibleThronePoints, playerSurvivorsStillPossiblePoints, totalPossibleRemainingPoints } } = player;
    return (
      <CardStyle grid>
        <div>{name}</div>
        <ListLabel>Plot</ListLabel>
        {playerBetsStillPossiblePoints}
        <ListLabel>Deaths</ListLabel>
        {playerDeathsStillPossiblePoints}
        <ListLabel>Survivors</ListLabel>
        {playerSurvivorsStillPossiblePoints}
        <ListLabel>Throne</ListLabel>
        {playerPossibleThronePoints}
        <ListLabel>Total</ListLabel>
        {totalPossibleRemainingPoints}
      </CardStyle>
    );
  });
  return (
    <EpisodeRowStyled>
      {playerCards}
    </EpisodeRowStyled>
  )
}