import React from "react";
import { airdates, episodes } from "../../shared/constants";
import { PointsBadge } from "../Character/PointsBadge";
import { CardStyle } from "../Player/Card";
import { PageContainerStyled, PageHeadingRow, Legend, StickyControls, RankDifference, Rank } from "./Styles";
import { MaxPoints, MaxPointsIcon } from "./MaxPoints";
import { SvgIcon } from "@material-ui/core";

const upArrow = <SvgIcon><path d="M7 14l5-5 5 5z"/><path d="M0 0h24v24H0z" fill="none"/></SvgIcon>;
const downArrow = <SvgIcon><path d="M7 10l5 5 5-5z" /><path d="M0 0h24v24H0z" fill="none" /></SvgIcon>;

const getRankDifference = (currentRank, rankLastWeek) => {
  const results = {};
  if (currentRank === rankLastWeek) {
    results.display = null;
    results.difference = `same`;
    return results;
  }
  if (currentRank < rankLastWeek) {
    results.display = <>{upArrow} {rankLastWeek - currentRank}</>;
    results.difference = `increase`;
    return results;
  } else {
    results.display = <>{downArrow} {currentRank - rankLastWeek}</>;
    results.difference = `decrease`;
    return results;
  }
}

export const ScoresTable = props => {
  const { scoreService, possiblePointsPerEpisode, seriesFinished, allActualCharacterSurviversPoints, actualThronePoints, players, filters, episodeResults } = props;

  const playerRows = players.map(player => {

    const rankDifference = getRankDifference(player.rank, player.rankLastWeek);

    const playerCells = player.pointsPerEpisode.map((points, index) => <td key={`${player.name}--${index}`} className="text-center">{points}<MaxPoints points={points} possiblePoints={possiblePointsPerEpisode[index]} /></td>)
    return (
      <tr key={player.userId}>
        <td className="text-center rank">
          {episodeResults.length !== 0 ?
            <Rank>
              <PointsBadge hidePts size="small" points={player.rankDisplay}></PointsBadge>
              {episodeResults.length > 1 &&
                <RankDifference difference={rankDifference.difference}>{rankDifference.display}</RankDifference>
              }
            </Rank>
            : <>{`--`}</>
          }
        </td>
        <td className="player-name sticky-left">{player.name}</td>
        {playerCells}
        {seriesFinished && <td className="text-center">{player.survivingCharacterPoints}<MaxPoints points={player.survivingCharacterPoints} possiblePoints={allActualCharacterSurviversPoints} /></td>}
        {seriesFinished && <td className="text-center">{player.throneChoicePoints}<MaxPoints points={player.throneChoicePoints} possiblePoints={actualThronePoints} /></td>}
        <td className="text-center sticky-right">{player.overallTotal}<MaxPoints points={player.overallTotal} possiblePoints={overallPossiblePointsTotal} /></td>
      </tr>
    );
  });

  const possiblePointsForTotal = possiblePointsPerEpisode.map(points => points === `--` ? 0 : points);
  const overallPossiblePointsTotal = possiblePointsForTotal.reduce(scoreService.sumPoints, 0);

  const possiblePointsRows = possiblePointsPerEpisode.map((points, index) => <td key={`possible-${index}`} className="text-center">{points}</td>)

  const airdatesRow = airdates.map(airdate => <th key={airdate} className="text-center">{airdate}</th>);

  const headings = episodes.map(episode => <th key={`heading--${episode}`} className="heading--episode-number text-center">{episode}</th>);

  return (
    <>
      <StickyControls style={{
        top: `48px`,
        zIndex: `4`,
      }}>

        {filters}

      </StickyControls>

      <PageContainerStyled>

        <PageHeadingRow>
          <h2>Scoreboard</h2>
        </PageHeadingRow>

        <CardStyle fullWidth noPadding>
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
          <Legend>
            <li><MaxPointsIcon /> Scored maximum possible points</li>
          </Legend>
        </CardStyle>
      </PageContainerStyled>
    </>
  );
};