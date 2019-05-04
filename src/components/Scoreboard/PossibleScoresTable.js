import React from "react";
import { CardStyle } from "../Player/Card";
import { PageHeadingRow } from "./Styles";

export const PossibleScoresTable = ({ players, leaderPoints }) => {
  const playersSortedByPossiblePoints = [...players];
  playersSortedByPossiblePoints.sort((a, b) => a.playerPossiblePoints.totalPossibleRemainingPoints < b.playerPossiblePoints.totalPossibleRemainingPoints ? 1 : -1);

  const playerRows = playersSortedByPossiblePoints.map(player => {
    const { name, overallTotal, playerPossiblePoints: { playerBetsStillPossiblePoints, playerDeathsStillPossiblePoints, playerPossibleThronePoints, playerSurvivorsStillPossiblePoints, totalPossibleRemainingPoints } } = player;
    return (
      <tr className="player-row" key={player.userId}>
        <td className="player-name">
          {name}
          <table className="nested-table w-100 possible-points-details">
            <thead>
              <tr>
                <th className="text-center">Plot</th>
                <th className="text-center">Deaths</th>
                <th className="text-center">Survivors</th>
                <th className="text-center">Throne</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-center">{playerBetsStillPossiblePoints}</td>
                <td className="text-center">{playerDeathsStillPossiblePoints}</td>
                <td className="text-center">{playerSurvivorsStillPossiblePoints}</td>
                <td className="text-center">{playerPossibleThronePoints}</td>
              </tr>
            </tbody>
          </table>


        </td>
        <td className="text-center valign-middle possible-totals">{totalPossibleRemainingPoints}</td>
        <td className="text-center valign-middle current-totals">{leaderPoints - overallTotal}</td>
      </tr>
    );
  });
  return (

      <>
        <PageHeadingRow>
          <h2>Possible Points</h2>
        </PageHeadingRow>
  
        <CardStyle fullWidth noPadding>
          <div className="scoreboard-container">
            <table className="scoreboard possible-points-scoreboard">
              <thead>
                <tr className="heading-row">
                  <th className="player-name heading-sm">Player</th>
                  <th className="text-center heading-sm possible-totals">Possible</th>
                  <th className="text-center heading-sm current-totals">Behind Leader</th>
                </tr>
              </thead>
              <tbody>
                {playerRows}
              </tbody>
            </table>
          </div>
        </CardStyle>
      </>

  )
}