import React from "react";
import { episodes } from "../../shared/constants";
import { firebase } from "../../shared/firebase";
import { ScoreboardTabs } from "./ScoreboardTabs";
import { ScoresByEpisode } from "./ScoresByEpisode";
import { ScoreService } from "./ScoreService";
import { ScoresTable } from "./ScoresTable";
import { Survivers } from "./Survivers";
import { Throne } from "./Throne";

export class Scoreboard extends React.Component {

  constructor(props) {
    super(props);
    this.databaseRef = firebase.database();
    this.entriesRef = this.databaseRef.ref(`games/${props.gameId}/entries`);
    this.episodesRef = this.databaseRef.ref('episodes');
    this.charactersRef = this.databaseRef.ref('characters');
    this.betsRef = this.databaseRef.ref('bets');

    this.state = {
      entries: null
    }

    this.scoreService = ScoreService;
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

    this.charactersRef.once('value', item => {
      const characters = Object.values(item.val());
      this.setState({
        characters
      });
    });

    this.betsRef.once('value', item => {
      const bets = Object.values(item.val());
      this.setState({
        bets
      });
    });
  }

  render() {

    const { entries, episodeResults, characters, bets } = this.state;

    if (!entries || !episodeResults || !characters || !bets) return <></>;

    const seriesFinished = episodeResults.length === 6;
    let deadCharacters;
    let allActualCharacterSurviversPoints;
    let actualThronePoints;
    let allSurvivers;
    let actualThroneCharacter;

    if (seriesFinished) {
      deadCharacters = this.scoreService.getDeadCharacters(episodeResults);
      allSurvivers = this.scoreService.getAllActualCharacterSurvivers(characters, deadCharacters);
      allActualCharacterSurviversPoints = this.scoreService.getAllActualCharacterSurviversPoints(allSurvivers);
      actualThronePoints = this.scoreService.getActualThronePoints(episodeResults, characters);
      actualThroneCharacter = episodeResults[5].throne;
    }

    const players = entries.map(entry => {

      const playerDeathChoices = entry.characterDeathChoices;
      const playerBetChoices = entry.betChoices;
      const throneChoice = entry.throneChoice;

      let survivingCharacterPoints = 0;
      let throneChoicePoints = 0;

      let actualCharacterSurvivers;
      let incorrectCharacterSurvivers;
      const playerSurviverChoices = this.scoreService.getCharacterSurviverChoices(playerDeathChoices);
      const playerDieSometimeChoices = this.scoreService.getDieSometimeChoices(playerDeathChoices);

      if (seriesFinished) {
        actualCharacterSurvivers = this.scoreService.getActualCharacterSurvivers(playerSurviverChoices, deadCharacters);
        incorrectCharacterSurvivers = this.scoreService.getIncorrectCharacterSurvivers(playerSurviverChoices, deadCharacters);
        survivingCharacterPoints = this.scoreService.getSurvivingCharacterPoints(actualCharacterSurvivers, characters);

        const throneChoiceCorrect = this.scoreService.checkIfThroneChoiceCorrect(episodeResults, throneChoice);
        if (throneChoiceCorrect) {
          throneChoicePoints = this.scoreService.getThroneChoicePoints(throneChoice, characters);
        }
  
      }

      let overallTotal = 0;
      let overallTotals = [];

      const correctDeathsPerEpisode = [];
      const correctBetsPerEpisode = [];
      const diedInDifferentEpisodePerEpisode = [];
      const correctDiedSometimePerEpisode = [];

      const pointsPerEpisode = episodes.map(episode => {

        const deathChoicesByEpisode = this.scoreService.getDeathChoicesByEpisode(playerDeathChoices, episode);

        const betChoicesByEpisode = this.scoreService.getBetChoicesByEpisode(playerBetChoices, episode);

        const actualBetsThisEpisode = this.scoreService.getActualBetsThisEpisode(episode, episodeResults);

        const correctBets = this.scoreService.getCorrectBetsByEpisode(actualBetsThisEpisode, betChoicesByEpisode);
        correctBetsPerEpisode.push(correctBets);

        const correctBetPoints = this.scoreService.getCorrectBetPoints(correctBets);

        const actualDeathsThisEpisode = this.scoreService.getActualDeathsThisEpisode(episode, episodeResults);

        const correctDeaths = this.scoreService.getCorrectDeathsByEpisode(actualDeathsThisEpisode, deathChoicesByEpisode);
        correctDeathsPerEpisode.push(correctDeaths);

        const episodeExactDeathPoints = this.scoreService.getEpisodeExactDeathPoints(correctDeaths, characters, episode);

        const correctDiedSometime = this.scoreService.getCorrectDiedSometime(actualDeathsThisEpisode, playerDeathChoices);
        correctDiedSometimePerEpisode.push(correctDiedSometime);

        const correctDiedSometimePoints = this.scoreService.getCorrectDiedSometimePoints(correctDiedSometime);

        const diedInDifferentEpisode = this.scoreService.getDiedInDifferentEpisode(actualDeathsThisEpisode, playerDeathChoices, episode);
        diedInDifferentEpisodePerEpisode.push(diedInDifferentEpisode);

        const diedInDifferentEpisodePoints = this.scoreService.getDiedInDifferentEpisodePoints(diedInDifferentEpisode);

        let episodePointsTotal = `--`;

        if (episodeResults[episode - 1]) {
          episodePointsTotal = this.scoreService.getEpisodePointsTotal(episodeExactDeathPoints, correctDiedSometimePoints, diedInDifferentEpisodePoints, correctBetPoints);
          overallTotals.push(episodePointsTotal);
        }

        return episodePointsTotal;

      });

      if (seriesFinished) {
        overallTotals.push(survivingCharacterPoints);
        overallTotals.push(throneChoicePoints);
      }

      overallTotal = overallTotals.reduce(this.scoreService.sumPoints, 0);

      return {
        name: entry.name,
        pointsPerEpisode,
        correctDeathsPerEpisode,
        correctBetsPerEpisode,
        playerDieSometimeChoices,
        correctDiedSometimePerEpisode,
        diedInDifferentEpisodePerEpisode,
        actualCharacterSurvivers,
        incorrectCharacterSurvivers,
        survivingCharacterPoints,
        throneChoicePoints,
        overallTotal,
        userId: entry.userId,
        playerSurviverChoices
      }

    });


    const possiblePointsPerEpisode = episodes.map(episode => {

      let possiblePoints = `--`;

      if (episodeResults[episode - 1]) {
        const deaths = episodeResults[episode - 1].deaths;

        const points = deaths.map(death => {
          const result = characters.find(item => item.id === death.id);
          return result.pointsPerEpisode[episode];
        });

        const actualBetsThisEpisode = this.scoreService.getActualBetsThisEpisode(episode, episodeResults);
        let actualBetPoints = this.scoreService.getCorrectBetPoints(actualBetsThisEpisode);

        possiblePoints = points.reduce(this.scoreService.sumPoints, 0);
        possiblePoints += actualBetPoints;
      }

      return possiblePoints;
    });

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

    const scoreProps = {
      scoreService: this.scoreService,
      episodeResults,
      players,
      entries,
      characters,
      bets,
      seriesFinished,
      allSurvivers,
      allActualCharacterSurviversPoints,
      deadCharacters,
      possiblePointsPerEpisode,
      deadCharacterByEpisode,
      deadCharactersForDisplay,
      actualThroneCharacter,
      actualThronePoints,
      gameId: this.props.gameId
    };

    const scoresTable = <ScoresTable {...scoreProps} />
    const scoresByEpisode = <ScoresByEpisode {...scoreProps} />
    const surviversList = <Survivers {...scoreProps} />
    const throneList = <Throne {...scoreProps} />
    
    const scoreboardTabs = {
      scoresTable,
      scoresByEpisode,
      surviversList,
      throneList
    };

    return (
      <>
        <ScoreboardTabs {...scoreboardTabs} />
      </>
    );
  }
}
