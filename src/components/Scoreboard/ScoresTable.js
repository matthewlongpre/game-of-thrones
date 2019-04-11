import React from "react";
import { airdates, episodes } from "../../shared/constants";
import { CardStyle } from "../Player/Card";
import { PageContainerStyled, PageHeadingRow } from "./Styles";

export const ScoresTable = props => {
  const { scoreService, possiblePointsPerEpisode, seriesFinished, allActualCharacterSurviversPoints, actualThronePoints, players, filters } = props;

  const sortedPlayers = players.sort((a, b) => a.overallTotal > b.overallTotal ? -1 : 1);

  let currentRank = 0;
  let currentHighScore = 0;
  
  const rankedResults = sortedPlayers.map(result => {
    if (currentRank === 0) {
      currentRank++;
      result.rank = currentRank;
      currentHighScore = result.overallTotal;
      return result;
    } else if (result.overallTotal === currentHighScore) {
      result.rank = currentRank;
      return result;
    } else {
      currentRank++;
      result.rank = currentRank;
      return result;
    }
  });

  const playerRows = rankedResults.map((player, index) => {
    const playerCells = player.pointsPerEpisode.map((points, index) => <td key={`${player.name}--${index}`} className="text-center">{points}</td>)
    return (
      <tr key={player.userId}>
        <td className="text-center rank">{player.rank}</td>
        <td className="player-name sticky-left">{player.name}</td>
        {playerCells}
        {seriesFinished && <td className="text-center">{player.survivingCharacterPoints}</td>}
        {seriesFinished && <td className="text-center">{player.throneChoicePoints}</td>}
        <td className="text-center sticky-right">{player.overallTotal}</td>
      </tr>
    );
  });

  const possiblePointsForTotal = possiblePointsPerEpisode.map(points => points === `--` ? 0 : points);
  const overallPossiblePointsTotal = possiblePointsForTotal.reduce(scoreService.sumPoints, 0);

  const possiblePointsRows = possiblePointsPerEpisode.map((points, index) => <td key={`possible-${index}`} className="text-center">{points}</td>)

  const airdatesRow = airdates.map(airdate => <th key={airdate} className="text-center">{airdate}</th>);

  const headings = episodes.map(episode => <th key={`heading--${episode}`} className="heading--episode-number text-center">{episode}</th>);

  return (
    <PageContainerStyled>

      <PageHeadingRow>
        <h2>Scoreboard</h2>
      </PageHeadingRow>

      {filters}

      <CardStyle fullWidth>
        <div className="scoreboard-container">
          <table className="scoreboard">
            <thead>
              <tr>
                <th colSpan="2" className="shaded"></th>
                <th colSpan="6" className="heading--episodes">Episodes</th>
                <th colSpan="3" className="shaded"></th>
              </tr>
              <tr className="heading--airdates">
                <th className="rank"></th>
                <th className="sticky-left"></th>
                {airdatesRow}
                <th className="sticky-right"></th>
              </tr>
              <tr className="headings">
                <th className="rank">Rank</th>
                <th className="sticky-left">Player</th>
                {headings}
                {seriesFinished && <th className="text-center">Surviver Pts</th>}
                {seriesFinished && <th className="text-center">Throne Pts</th>}
                <th className="text-center sticky-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {playerRows}
              <tr className="possible-points">
                <td></td>
                <td className="sticky-left">Possible Points</td>
                {possiblePointsRows}
                {seriesFinished && <td className="text-center">{allActualCharacterSurviversPoints}</td>}
                {seriesFinished && <td className="text-center">{actualThronePoints}</td>}
                <td className="text-center sticky-right">{overallPossiblePointsTotal}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardStyle>
    </PageContainerStyled>
  );
};