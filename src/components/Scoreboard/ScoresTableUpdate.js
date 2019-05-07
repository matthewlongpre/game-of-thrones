import React from "react";
import { airdates, episodes } from "../../shared/constants";
import { PointsBadge } from "../Character/PointsBadge";
import { CardStyle } from "../Player/Card";
import { PageContainerStyled, PageHeadingRow, Legend, StickyControls, RankDifference, Rank } from "./Styles";
import { MaxPoints, MaxPointsIcon } from "./MaxPoints";
import { SvgIcon } from "@material-ui/core";
import { PossibleScoresTable } from "./PossibleScoresTable";

const upArrow = <SvgIcon><path d="M7 14l5-5 5 5z" /><path d="M0 0h24v24H0z" fill="none" /></SvgIcon>;
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

export const ScoresTableUpdate = props => {
  const { scoreService, possiblePointsPerEpisode, seriesFinished, allActualCharacterSurviversPoints, actualThronePoints, players, filters, episodeResults } = props;

  const playerRows = players.map(player => {

    const rankDifference = getRankDifference(player.rank, player.rankLastWeek);

    const playerCells = player.pointsPerEpisode.map((points, index) => <td key={`${player.name}--${index}`} className="text-center">{points}<MaxPoints points={points} possiblePoints={possiblePointsPerEpisode[index]} /></td>)
    return (
      <tr className="player-row" key={player.userId}>
        <td className="text-center rank">
          {episodeResults.length !== 0 ?
            <Rank>
              <PointsBadge hidePts size="small" variant="rank" points={player.rankDisplay}></PointsBadge>
              {episodeResults.length > 1 &&
                <RankDifference difference={rankDifference.difference}>{rankDifference.display}</RankDifference>
              }
            </Rank>
            : <>{`--`}</>
          }
        </td>
        <td className="player-name">
          {player.name}
          <table className="nested-table w-100 possible-points-details">
            <thead>
              <tr>
                <th className="text-center text-muted">Ep 1</th>
                <th className="text-center text-muted">Ep 2</th>
                <th className="text-center text-muted">Ep 3</th>
                <th className="text-center text-muted">Ep 4</th>
                <th className="text-center text-muted">Ep 5</th>
                <th className="text-center text-muted">Ep 6</th>
                {seriesFinished && <th className="text-center text-muted">Survivors</th>}
                {seriesFinished && <th className="text-center text-muted">Throne</th>}
              </tr>
            </thead>
            <tbody>
              <tr>
                {playerCells}
                {seriesFinished && <td className="text-center valign-middle current-totals">{player.survivingCharacterPoints}<MaxPoints points={player.survivingCharacterPoints} possiblePoints={allActualCharacterSurviversPoints} /></td>}
                {seriesFinished && <td className="text-center valign-middle current-totals">{player.throneChoicePoints}<MaxPoints points={player.throneChoicePoints} possiblePoints={actualThronePoints} /></td>}
              </tr>
            </tbody>
          </table>
        </td>

        <td className="text-center valign-middle text-bold current-totals sticky-right">{player.overallTotal}<MaxPoints points={player.overallTotal} possiblePoints={overallPossiblePointsTotal} /></td>
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

        <CardStyle fullWidth noPadding style={{ marginBottom: `0px` }}>
          <div className="scoreboard-container">
            <table className="scoreboard">
              <thead>
                <tr className="heading-row">
                  <th className="rank">Rank</th>
                  <th className="player-name">Player</th>
                  <th className="text-center current-totals sticky-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {playerRows}
              </tbody>
            </table>
          </div>
          <Legend>
            <li><MaxPointsIcon /> Scored maximum possible points</li>
          </Legend>
        </CardStyle>

        <PossibleScoresTable {...props} />
      </PageContainerStyled>
    </>
  );
};