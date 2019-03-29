import { Link } from "@reach/router";
import React from "react";
import { airdates, episodes } from "../../shared/constants";
import { CardStyle } from "../Player/Card";
import { PageContainerStyled, PageHeadingRow } from "./Styles";

export const ScoresTable = props => {
  const { scoreService, possiblePointsPerEpisode, seriesFinished, allActualCharacterSurviversPoints, players } = props;

  const sortedPlayers = players.sort((a, b) => a.overallTotal > b.overallTotal ? -1 : 1);
  const playerRows = sortedPlayers.map((player, index) => {
    const playerCells = player.pointsPerEpisode.map((points, index) => <td key={`${player.name}--${index}`} className="text-center">{points}</td>)
    return <tr key={player.userId}><td className="text-center rank">{index + 1}</td><td className="player-name sticky-left"><Link to={`/games/${props.gameId}/player/${player.userId}`}>{player.name}</Link></td>{playerCells}{seriesFinished && <td className="text-center">{player.survivingCharacterPoints}</td>}<td className="text-center sticky-right">{player.overallTotal}</td></tr>
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

      <CardStyle fullWidth>
        <div className="scoreboard-container">
          <table className="scoreboard">
            <thead>
              <tr>
                <th colSpan="2" className="shaded"></th>
                <th colSpan="6" className="heading--episodes">Episodes</th>
                <th colSpan="2" className="shaded"></th>
              </tr>
              <tr className="heading--airdates">
                <th className="rank"></th>
                <th></th>
                {airdatesRow}
                <th></th>
              </tr>
              <tr className="headings">
                <th className="rank">Rank</th>
                <th className="sticky-left">Player</th>
                {headings}
                {seriesFinished && <th className="text-center">Surviver Pts</th>}
                <th className="text-center sticky-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {playerRows}
              <tr className="possible-points">
                <td></td>
                <td>Possible Points</td>
                {possiblePointsRows}
                {seriesFinished && <td className="text-center">{allActualCharacterSurviversPoints}</td>}
                <td className="text-center sticky-right">{overallPossiblePointsTotal}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardStyle>
    </PageContainerStyled>
  );
};