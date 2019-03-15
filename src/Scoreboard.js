import React from "react";
import firebase from "./firebase";
import { episodes, airdates } from "./constants";


class Scoreboard extends React.Component {
  databaseRef = firebase.database();
  entriesRef = this.databaseRef.ref('entries');
  episodesRef = this.databaseRef.ref('episodes');
  charactersRef = this.databaseRef.ref('characters');

  state = {
    entries: null
  }

  componentDidMount() {
    this.entriesRef.on('value', item => {
      const entries = Object.values(item.val());
      this.setState({
        entries: entries
      });
    });

    this.episodesRef.on('value', item => {
      const episodeResults = Object.values(item.val());
      this.setState({
        episodeResults: episodeResults
      });
    });

    this.charactersRef.on('value', item => {
      const characters = Object.values(item.val());
      this.setState({
        characters: characters
      });
    });
  }

  render() {

    const { entries, episodeResults, characters } = this.state;

    if (!entries || !episodeResults || !characters) return <div>Loading...</div>;

    const headings = episodes.map(episode => <th key={`heading--${episode}`} className="heading--episode-number">{episode}</th>)

    const players = entries.map(entry => {

      const playerDeathChoices = entry.characterDeathChoices;

      let overallTotal = 0;
      let overallTotals = [];

      const pointsPerEpisode = episodes.map(episode => {

        const deathChoicesByEpisode = [];
        for (const key in playerDeathChoices) {
          if (playerDeathChoices[key] === episode) {
            const item = {};
            item.character = key;
            item.episode = playerDeathChoices[key];
            deathChoicesByEpisode.push(item);
          }
        }

        let episodePointsTotal = `--`;
        if (episodeResults[episode - 1]) {
          const actualDeathsThisEpisode = episodeResults[episode - 1].deaths;
          let correctDeaths = [];
          actualDeathsThisEpisode.forEach(death => {
            const correctDeath = deathChoicesByEpisode.find(choice => {
              return choice.character === death.id
            });
            if (correctDeath) {
              correctDeath.points = death.points;
              correctDeaths.push(correctDeath);
            }
          });

          const episodePoints = correctDeaths.map(death => death.points);
          episodePointsTotal = episodePoints.reduce((total, current) => total + parseInt(current, 10), 0);

          overallTotals.push(episodePointsTotal);

        }

        overallTotal = overallTotals.reduce((total, current) => total + parseInt(current, 10), 0);

        return episodePointsTotal;
      });
      return {
        name: entry.name,
        pointsPerEpisode: pointsPerEpisode,
        overallTotal: overallTotal
      }
    });

    const sortedPlayers = players.sort((a, b) => a.overallTotal > b.overallTotal ? -1 : 1);

    const playerRows = sortedPlayers.map((player, index) => {
      const playerCells = player.pointsPerEpisode.map((points, index) => <td key={`${player.name}--${index}`} width="50">{points}</td>)
      return <tr key={player.name}><td>{index + 1}</td><td width="200">{player.name}</td>{playerCells}<td>{player.overallTotal}</td></tr>
    });


    const possiblePointsPerEpisode = episodes.map(episode => {

      let possiblePoints = 0;

      episodeResults.forEach((item, index) => {
        if (index === episode - 1) {
          const deaths = item.deaths;
          deaths.forEach(death => possiblePoints += parseInt(death.points, 10));
        }
      });

      return possiblePoints;
    });

    const overallPossiblePointsTotal = possiblePointsPerEpisode.reduce((total, current) => total + parseInt(current, 10), 0);

    const possiblePointsForDisplay = possiblePointsPerEpisode.map(points => points === 0 ? `--` : points);

    const possiblePointsRows = possiblePointsForDisplay.map((points, index) => <td key={`possible-${index}`}>{points}</td>)

    const airdatesRow = airdates.map(airdate => <th key={airdate}>{airdate}</th>);

    return (
      <table>
        <thead>
          <tr>
            <th colSpan="2"></th>
            <th colSpan="6" className="heading--episodes">Episodes</th>
            <th></th>
          </tr>
          <tr className="heading--airdates">
            <th className="rank"></th>
            <th></th>
            {airdatesRow}
            <th></th>
          </tr>
          <tr>
            <th className="rank">Rank</th>
            <th>Player</th>
            {headings}
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {playerRows}
          <tr className="possible-points">
          <td></td>
            <td>Possible Points</td>
            {possiblePointsRows}
            <td>{overallPossiblePointsTotal}</td>
          </tr>
        </tbody>
      </table>
    );
  }
}

export default Scoreboard;
