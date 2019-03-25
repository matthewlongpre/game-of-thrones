import { Link } from "@reach/router";
import React from "react";
import { airdates, episodes, POINTS } from "../../shared/constants";
import { firebase } from "../../shared/firebase";
import { PointsBadge } from "../Character/PointsBadge";
import { Avatar } from "./../Character/Avatar";
import { ScoreboardBackground } from "./ScoreboardBackground";
import { CardStyle } from "../Player/Card";

class Scoreboard extends React.Component {

  constructor(props) {
    super(props);
    this.databaseRef = firebase.database();
    this.entriesRef = this.databaseRef.ref(`games/${props.gameId}/entries`);
    this.episodesRef = this.databaseRef.ref('episodes');
    this.charactersRef = this.databaseRef.ref('characters');

    this.state = {
      entries: null
    }
  }

  componentDidMount() {
    this.entriesRef.on('value', item => {

      if (!item.val()) {
        this.setState({
          entries: []
        });
        return;
      }

      const entries = Object.values(item.val());
      this.setState({
        entries
      });
    });

    this.episodesRef.on('value', item => {
      const episodes = Object.values(item.val());
      const episodeResults = episodes.map(episode => {
        if (!episode.deaths) {
          episode.deaths = [];
        }
        if (!episode.bets) {
          episode.bets = [];
        }
        return episode;
      });
      this.setState({
        episodeResults
      });
    });

    this.charactersRef.on('value', item => {
      const characters = Object.values(item.val());
      this.setState({
        characters
      });
    });
  }

  getBetChoicesByEpisode = (playerBetChoices, episode) => {
    const betChoicesByEpisode = [];
    for (const key in playerBetChoices) {
      if (playerBetChoices[key] === episode) {
        const item = {};
        item.bet = key;
        item.episode = playerBetChoices[key];
        betChoicesByEpisode.push(item);
      }
    }
    return betChoicesByEpisode;
  }

  getActualBetsThisEpisode = (episode, episodeResults) => {
    let actualBetsThisEpisode = [];
    if (episodeResults[episode - 1]) {
      actualBetsThisEpisode = episodeResults[episode - 1].bets;
    }
    return actualBetsThisEpisode;
  }

  getCorrectBetsByEpisode = (actualBetsThisEpisode, betChoicesByEpisode) => {
    let correctBets = [];
    if (actualBetsThisEpisode.length !== 0) {
      actualBetsThisEpisode.forEach(bet => {
        const correctBet = betChoicesByEpisode.find(choice => {
          return choice.bet === bet.id
        });
        if (correctBet) {
          correctBets.push(correctBet);
        }
      });
    }
    return correctBets;
  }

  getCorrectBetPoints = correctBet => {
    const correctBetPoints = correctBet.map(() => POINTS.BONUS_PREDICTION_VALUE);
    return correctBetPoints.reduce(this.sumPoints, 0);
  };

  getDeathChoicesByEpisode = (playerDeathChoices, episode) => {
    const deathChoicesByEpisode = [];
    for (const key in playerDeathChoices) {
      if (playerDeathChoices[key] === episode) {
        const item = {};
        item.character = key;
        item.episode = playerDeathChoices[key];
        deathChoicesByEpisode.push(item);
      }
    }
    return deathChoicesByEpisode;
  }

  getActualDeathsThisEpisode = (episode, episodeResults) => {
    let actualDeathsThisEpisode = [];
    if (episodeResults[episode - 1]) {
      actualDeathsThisEpisode = episodeResults[episode - 1].deaths;
    }
    return actualDeathsThisEpisode;
  }

  getCorrectDeathsByEpisode = (actualDeathsThisEpisode, deathChoicesByEpisode) => {
    let correctDeaths = [];
    if (actualDeathsThisEpisode.length !== 0) {
      actualDeathsThisEpisode.forEach(death => {
        const correctDeath = deathChoicesByEpisode.find(choice => {
          return choice.character === death.id
        });
        if (correctDeath) {
          correctDeath.points = death.points;
          correctDeaths.push(correctDeath);
        }
      });
    }
    return correctDeaths;
  }

  getEpisodeExactDeathPoints = (correctDeaths, characters, episode) => {
    const episodeExactDeathPoints = correctDeaths.map(death => {
      const result = characters.find(item => item.id === death.character);
      return result.pointsPerEpisode[episode];
    });
    return episodeExactDeathPoints.reduce(this.sumPoints, 0);
  }

  getCorrectDiedSometime = (actualDeathsThisEpisode, playerDeathChoices) => {
    const correctDiedSometime = [];
    actualDeathsThisEpisode.forEach(character => {
      for (const key in playerDeathChoices) {
        if (key === character.id) {
          if (playerDeathChoices[key] === "7") {
            correctDiedSometime.push(character);
          }
        }
      }
    });
    return correctDiedSometime;
  }

  getCorrectDiedSometimePoints = correctDiedSometime => {
    const correctDiedSometimePoints = correctDiedSometime.map(() => POINTS.DIED_SOMETIME_VALUE)
    return correctDiedSometimePoints.reduce(this.sumPoints, 0);
  };

  getDiedInDifferentEpisode = (actualDeathsThisEpisode, playerDeathChoices, episode) => {
    const diedInDifferentEpisode = [];
    actualDeathsThisEpisode.forEach(character => {
      for (const key in playerDeathChoices) {
        if (key === character.id) {
          if (playerDeathChoices[key] !== "7" && playerDeathChoices[key] !== "0" && playerDeathChoices[key] !== episode) {
            diedInDifferentEpisode.push(character);
          }
        }
      }
    });
    return diedInDifferentEpisode;
  }

  getDiedInDifferentEpisodePoints = diedInDifferentEpisode => {
    const diedInDifferenceEpisodePoints = diedInDifferentEpisode.map(() => POINTS.DIED_DIFFERENT_EPISODE_VALUE);
    return diedInDifferenceEpisodePoints.reduce(this.sumPoints, 0);
  }

  sumPoints = (total, current) => total + parseInt(current, 10);

  getEpisodePointsTotal = (episodeExactDeathPoints, correctDiedSometimePoints, diedInDifferentEpisodePoints, correctBetPoints) => {
    let episodePointsTotal = 0;
    episodePointsTotal = episodeExactDeathPoints;
    episodePointsTotal += correctDiedSometimePoints;
    episodePointsTotal += diedInDifferentEpisodePoints;
    episodePointsTotal += correctBetPoints;
    return episodePointsTotal;
  }

  getDeadCharacters = (episodeResults) => {
    const deadCharacters = [];
    episodeResults.forEach(episode => {
      episode.deaths.forEach(deadCharacter => deadCharacters.push(deadCharacter));
    });
    return deadCharacters;
  }

  getCharacterSurviverChoices = (playerDeathChoices) => {
    const characterSurviverChoices = [];
    for (const key in playerDeathChoices) {
      if (playerDeathChoices[key] === "0") {
        characterSurviverChoices.push(key);
      }
    }
    return characterSurviverChoices;
  }

  getActualCharacterSurvivers = (playerSurviverChoices, deadCharacters) => {
    const survivers = playerSurviverChoices.filter(item => {
      return !deadCharacters.find(deadCharacter => deadCharacter.id === item);
    });
    return survivers;
  }

  getSurvivingCharacterPoints = (actualCharacterSurvivers, characters) => {
    const survivers = actualCharacterSurvivers.map(surviver => {
      const result = characters.find(character => character.id === surviver);
      return result;
    });
    const points = survivers.map(item => item.pointsPerEpisode[0]);
    return points.reduce(this.sumPoints, 0);
  }

  getAllActualCharacterSurvivers = (characters, deadCharacters) => {
    const survivers = characters.filter(item => {
      return !deadCharacters.find(deadCharacter => deadCharacter.id === item.id);
    });
    return survivers;
  }

  getAllActualCharacterSurviversPoints = (allSurvivers) => {
    const points = allSurvivers.map(item => item.pointsPerEpisode[0]);
    return points.reduce(this.sumPoints, 0);
  }

  render() {

    const { entries, episodeResults, characters } = this.state;

    if (!entries || !episodeResults || !characters) return <></>;

    const seriesFinished = episodeResults.length === 6;
    let deadCharacters;
    let allActualCharacterSurviversPoints;

    if (seriesFinished) {
      deadCharacters = this.getDeadCharacters(episodeResults);
      const allSurvivers = this.getAllActualCharacterSurvivers(characters, deadCharacters);
      allActualCharacterSurviversPoints = this.getAllActualCharacterSurviversPoints(allSurvivers);
    }

    const players = entries.map(entry => {

      const playerDeathChoices = entry.characterDeathChoices;
      const playerBetChoices = entry.betChoices;

      let survivingCharacterPoints = 0;

      if (seriesFinished) {
        const playerSurviverChoices = this.getCharacterSurviverChoices(playerDeathChoices);
        const actualCharacterSurvivers = this.getActualCharacterSurvivers(playerSurviverChoices, deadCharacters);
        survivingCharacterPoints = this.getSurvivingCharacterPoints(actualCharacterSurvivers, characters);
      }

      let overallTotal = 0;
      let overallTotals = [];

      const pointsPerEpisode = episodes.map(episode => {

        const deathChoicesByEpisode = this.getDeathChoicesByEpisode(playerDeathChoices, episode);

        const betChoicesByEpisode = this.getBetChoicesByEpisode(playerBetChoices, episode);

        const actualBetsThisEpisode = this.getActualBetsThisEpisode(episode, episodeResults);

        const correctBets = this.getCorrectBetsByEpisode(actualBetsThisEpisode, betChoicesByEpisode);

        const correctBetPoints = this.getCorrectBetPoints(correctBets);

        const actualDeathsThisEpisode = this.getActualDeathsThisEpisode(episode, episodeResults);

        const correctDeaths = this.getCorrectDeathsByEpisode(actualDeathsThisEpisode, deathChoicesByEpisode);

        const episodeExactDeathPoints = this.getEpisodeExactDeathPoints(correctDeaths, characters, episode);

        const correctDiedSometime = this.getCorrectDiedSometime(actualDeathsThisEpisode, playerDeathChoices);

        const correctDiedSometimePoints = this.getCorrectDiedSometimePoints(correctDiedSometime);

        const diedInDifferentEpisode = this.getDiedInDifferentEpisode(actualDeathsThisEpisode, playerDeathChoices, episode);

        const diedInDifferentEpisodePoints = this.getDiedInDifferentEpisodePoints(diedInDifferentEpisode);

        let episodePointsTotal = `--`;

        if (episodeResults[episode - 1]) {
          episodePointsTotal = this.getEpisodePointsTotal(episodeExactDeathPoints, correctDiedSometimePoints, diedInDifferentEpisodePoints, correctBetPoints);
          overallTotals.push(episodePointsTotal);
        }

        return episodePointsTotal;

      });

      if (seriesFinished) {
        overallTotals.push(survivingCharacterPoints);
      }

      overallTotal = overallTotals.reduce(this.sumPoints, 0);

      return {
        name: entry.name,
        pointsPerEpisode: pointsPerEpisode,
        survivingCharacterPoints: survivingCharacterPoints,
        overallTotal: overallTotal,
        userId: entry.userId
      }

    });

    const sortedPlayers = players.sort((a, b) => a.overallTotal > b.overallTotal ? -1 : 1);
    const playerRows = sortedPlayers.map((player, index) => {
      const playerCells = player.pointsPerEpisode.map((points, index) => <td key={`${player.name}--${index}`} className="text-center">{points}</td>)
      return <tr key={player.userId}><td className="text-center rank">{index + 1}</td><td className="player-name sticky-left"><Link to={`/games/${this.props.gameId}/player/${player.userId}`}>{player.name}</Link></td>{playerCells}{seriesFinished && <td className="text-center">{player.survivingCharacterPoints}</td>}<td className="text-center sticky-right">{player.overallTotal}</td></tr>
    });

    const possiblePointsPerEpisode = episodes.map(episode => {

      let possiblePoints = `--`;

      if (episodeResults[episode - 1]) {
        const deaths = episodeResults[episode - 1].deaths;

        const points = deaths.map(death => {
          const result = characters.find(item => item.id === death.id);
          return result.pointsPerEpisode[episode];
        });

        const actualBetsThisEpisode = this.getActualBetsThisEpisode(episode, episodeResults);
        let actualBetPoints = this.getCorrectBetPoints(actualBetsThisEpisode);

        possiblePoints = points.reduce(this.sumPoints, 0);
        possiblePoints += actualBetPoints;
      }

      return possiblePoints;
    });

    const possiblePointsForTotal = possiblePointsPerEpisode.map(points => points === `--` ? 0 : points);
    const overallPossiblePointsTotal = possiblePointsForTotal.reduce(this.sumPoints, 0);

    const possiblePointsRows = possiblePointsPerEpisode.map((points, index) => <td key={`possible-${index}`} className="text-center">{points}</td>)

    const airdatesRow = airdates.map(airdate => <th key={airdate} className="text-center">{airdate}</th>);

    const deadCharacterByEpisode = episodes.map(episode => {
      if (episodeResults[episode - 1]) {
        return episodeResults[episode - 1].deaths
      } else {
        return null;
      }
    });

    const deadCharactersForDisplay = [];
    deadCharacterByEpisode.forEach(episodeDeaths => {
      if (episodeDeaths !== null) {
        const characterData = episodeDeaths.map(dead => characters.find(character => character.id === dead.id));
        deadCharactersForDisplay.push(characterData);
      }
    });

    const theDead = episodes.map(episode => {
      if (deadCharactersForDisplay[episode - 1]) {
        const characters = deadCharactersForDisplay[episode - 1]
          .map(character =>
            <div key={character.id} className="dead-character">
              <div className="dead-character-avatar">
                <Avatar size="small" name={character.name} id={character.id} />
              </div>
              <PointsBadge marginTop points={character.pointsPerEpisode[episode]} />
            </div>
          );
        return <td key={episode} className="text-center">{characters}</td>;
      }
      else {
        return <td key={episode} className="text-center">--</td>
      }
    });

    const headings = episodes.map(episode => <th key={`heading--${episode}`} className="heading--episode-number text-center">{episode}</th>);

    return (
      <>
        <h2 style={{ textAlign: `center` }}>Scoreboard</h2>
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
                <tr><td></td><td>Deaths</td>{theDead}<td></td></tr>
              </tbody>
            </table>
          </div>
        </CardStyle>
      </>
    );
  }
}

export default Scoreboard;
