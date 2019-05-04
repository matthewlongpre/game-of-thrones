import React from "react";
import { episodes, episodesWithLabels } from "../../shared/constants";
import { firebase } from "../../shared/firebase";
import { ScoreboardTabs } from "./ScoreboardTabs";
import { ScoresByEpisode } from "./ScoresByEpisode";
import { ScoreService } from "./ScoreService";
import { ScoresTable } from "./ScoresTable";
import { Survivers } from "./Survivers";
import { Throne } from "./Throne";
import { Filters } from "./Filters";
import { EpisodesWatched } from "./EpisodesWatched";
import { Button } from "@material-ui/core";
import { EpisodeResultsSelection } from "./Styles";

export class Scoreboard extends React.Component {

  constructor(props) {
    super(props);
    this.databaseRef = firebase.database();
    this.entriesRef = this.databaseRef.ref(`games/${props.gameId}/entries`);
    this.episodesRef = this.databaseRef.ref(`episodes`);
    this.charactersRef = this.databaseRef.ref(`characters`);
    this.betsRef = this.databaseRef.ref(`bets`);
    this.usersRef = this.databaseRef.ref(`users/${props.user.uid}`);


    this.state = {
      entries: null,
      showFilters: false,
      filter: `showAll`,
      compareOne: ``,
      compareTwo: ``,
      compareOneName: ``,
      compareTwoName: ``,
      showSpoilerWarning: true,
      episodesWatched: 0,
      newResultsAvailable: false
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
        entries,
        allEntries: entries
      });
    });

    this.usersRef.once('value', item => {
      const results = item.val();
      let { episodesWatched } = results;

      if (!episodesWatched) {
        episodesWatched = 0;
      }

      this.setState({
        episodesWatched
      });
    });

    this.episodesRef.on('value', item => {
      const episodes = Object.values(item.val());
      const allEpisodeResults = episodes.map(episode => {
        if (!episode.deaths) {
          episode.deaths = [];
        }
        if (!episode.bets) {
          episode.bets = [];
        }
        return episode;
      });

      let showSpoilerWarning;
      if (allEpisodeResults.length === 0) {
        showSpoilerWarning = false;
      } else {
        showSpoilerWarning = true;
      }

      const { episodesWatched } = this.state;
      const newResultsAvailable = this.checkIfNewResultsAvailable(allEpisodeResults, episodesWatched);
      const episodeResultsForDisplay = this.trimEpisodeResults(allEpisodeResults, episodesWatched);

      this.setState({
        episodeResults: episodeResultsForDisplay,
        allEpisodeResults,
        showSpoilerWarning,
        newResultsAvailable
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

  filterEntries = (selectedFilter, comparisons) => {
    const { allEntries } = this.state;
    const { user: { uid } } = this.props;

    if (selectedFilter === `onlyMe`) {
      const filteredEntries = allEntries.filter(item => item.userId === uid);
      this.setState({
        filter: `onlyMe`,
        entries: filteredEntries,
        compareOne: ``,
        compareTwo: ``
      });
      this.expandFilters();
    }

    if (selectedFilter === `showAll`) {
      this.setState({
        filter: `showAll`,
        entries: allEntries,
        compareOne: ``,
        compareTwo: ``
      });
      this.expandFilters();
    }

    if (selectedFilter === `compare`) {
      const entryOne = allEntries.filter(item => item.userId === comparisons.compareOne);
      const entryTwo = allEntries.filter(item => item.userId === comparisons.compareTwo);

      const comparedEntries = [
        ...entryOne,
        ...entryTwo
      ];

      this.setState({
        filter: `compare`,
        entries: comparedEntries,
        compareOneName: entryOne[0].name,
        compareTwoName: entryTwo[0].name
      });

      this.expandFilters();
    }
  }

  handleCompareChange = (e, name) => {
    this.setState({
      [name]: e.target.value
    });
  }

  handleCompareClick = () => {
    const { compareOne, compareTwo } = this.state;
    if (compareOne && compareTwo) {
      const comparisons = {
        compareOne,
        compareTwo
      }
      this.filterEntries(`compare`, comparisons);
      this.expandFilters();
    }
  }

  expandFilters = () => {
    const { showFilters } = this.state;
    this.setState({
      showFilters: !showFilters
    });
  }

  checkIfNewResultsAvailable = (allEpisodeResults, selectedEpisodeWatched) => {
    let newResultsAvailable = false;
    if (allEpisodeResults.length > selectedEpisodeWatched) {
      newResultsAvailable = true;
    }
    return newResultsAvailable;
  }

  trimEpisodeResults = (allEpisodeResults, episodesWatched) => {
    return allEpisodeResults.slice(0, episodesWatched);
  }

  handleEpisodesWatchedChange = e => {
    const selectedEpisodeWatched = e.target.value;
    const { allEpisodeResults } = this.state;

    const newResultsAvailable = this.checkIfNewResultsAvailable(allEpisodeResults, selectedEpisodeWatched);

    const episodeResultsForDisplay = this.trimEpisodeResults(allEpisodeResults, selectedEpisodeWatched);

    this.setState({
      episodesWatched: selectedEpisodeWatched,
      episodeResults: episodeResultsForDisplay,
      newResultsAvailable
    });

    this.updateEpisodesWatched(selectedEpisodeWatched);
  }

  handleEpisodesWatchedDialog = () => {
    const { showSpoilerWarning } = this.state;
    this.setState({
      showSpoilerWarning: !showSpoilerWarning
    });
  }

  updateEpisodesWatched = (selectedEpisodeWatched) => {
    const updates = {
      episodesWatched: selectedEpisodeWatched
    };
    this.usersRef.update(updates, error => {
      if (error) {
        alert(error)
        console.error('Failed', error);
      }
    });
  }

  render() {

    const { entries, allEntries, episodeResults, allEpisodeResults, newResultsAvailable, episodesWatched, showSpoilerWarning, characters, bets, filter, showFilters, compareOneName, compareTwoName } = this.state;

    if (!entries || !episodeResults || !characters || !bets) return <></>;

    const seriesFinished = episodeResults.length === 6;
    let deadCharacters;
    let allActualCharacterSurviversPoints;
    let actualThronePoints;
    let allSurvivers;
    let actualThroneCharacter;
    let betsNeverOccurred;
    let betsNeverOccurredPoints;
    let betsNeverOccurChoices;

    deadCharacters = this.scoreService.getDeadCharacters(episodeResults);

    if (seriesFinished) {
      allSurvivers = this.scoreService.getAllActualCharacterSurvivers(characters, deadCharacters);
      allActualCharacterSurviversPoints = this.scoreService.getAllActualCharacterSurviversPoints(allSurvivers);
      actualThronePoints = this.scoreService.getActualThronePoints(episodeResults, characters);
      actualThroneCharacter = episodeResults[5].throne;
      betsNeverOccurred = this.scoreService.getBetsNeverOccurred(episodeResults, bets);
    }

    const possiblePointsPerEpisode = episodes.map(episode => {

      let possiblePoints = `--`;

      if (episodeResults[episode - 1]) {
        const deaths = episodeResults[episode - 1].deaths;

        let points = [];
        if (deaths.length !== 0) {
          points = deaths.map(death => {
            const result = characters.find(item => item.id === death.id);
            return result.pointsPerEpisode[episode];
          });
        }

        const actualBetsThisEpisode = this.scoreService.getActualBetsThisEpisode(episode, episodeResults);
        const actualBetPoints = this.scoreService.getCorrectBetPoints(actualBetsThisEpisode);

        possiblePoints = points.reduce(this.scoreService.sumPoints, 0);
        possiblePoints += actualBetPoints;

        if (episode === "6") {
          const actualBetNeverOccurredPoints = this.scoreService.getPossibleBetsNeverOccurredPoints(betsNeverOccurred);
          possiblePoints += actualBetNeverOccurredPoints;
        }
      }

      return possiblePoints;
    });

    let players = entries.map(entry => {

      const playerDeathChoices = entry.characterDeathChoices;
      const playerBetChoices = entry.betChoices;
      const throneChoice = entry.throneChoice;

      let survivingCharacterPoints = 0;
      let throneChoicePoints = 0;

      let actualCharacterSurvivers;
      let incorrectCharacterSurvivers;
      const playerSurviverChoices = this.scoreService.getCharacterSurviverChoices(playerDeathChoices);
      const playerDieSometimeChoices = this.scoreService.getDieSometimeChoices(playerDeathChoices);

      betsNeverOccurChoices = this.scoreService.getBetsNeverOccurChoices(playerBetChoices);
      betsNeverOccurChoices = this.scoreService.getBetsNeverOccurChoicesWithData(betsNeverOccurChoices, bets);

      let correctBetsNeverOccurred;

      incorrectCharacterSurvivers = this.scoreService.getIncorrectCharacterSurvivers(playerSurviverChoices, deadCharacters);

      if (seriesFinished) {
        actualCharacterSurvivers = this.scoreService.getActualCharacterSurvivers(playerSurviverChoices, deadCharacters);
        survivingCharacterPoints = this.scoreService.getSurvivingCharacterPoints(actualCharacterSurvivers, characters);

        const throneChoiceCorrect = this.scoreService.checkIfThroneChoiceCorrect(episodeResults, throneChoice);
        if (throneChoiceCorrect) {
          throneChoicePoints = this.scoreService.getThroneChoicePoints(throneChoice, characters);
        }

        correctBetsNeverOccurred = this.scoreService.getCorrectBetsNeverOccurred(betsNeverOccurChoices, betsNeverOccurred);
        betsNeverOccurredPoints = this.scoreService.getBetsNeverOccurredPoints(correctBetsNeverOccurred);
      }

      let overallTotal = 0;
      let overallTotals = [];
      let lastWeekOverallTotal = 0;
      let lastWeekOverallTotals = [];

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
          if (episode === "6") {
            episodePointsTotal += betsNeverOccurredPoints;
          }
          
          if (parseInt(episode, 10) < episodeResults.length) {
            lastWeekOverallTotals.push(episodePointsTotal);
          }

          overallTotals.push(episodePointsTotal);
        }

        return episodePointsTotal;

      });

      if (seriesFinished) {
        overallTotals.push(survivingCharacterPoints);
        overallTotals.push(throneChoicePoints);
      }

      overallTotal = overallTotals.reduce(this.scoreService.sumPoints, 0);
      lastWeekOverallTotal = lastWeekOverallTotals.reduce(this.scoreService.sumPoints, 0);

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
        lastWeekOverallTotal,
        userId: entry.userId,
        playerSurviverChoices,
        betsNeverOccurChoices,
        correctBetsNeverOccurred
      }

    });


    let currentRank;
    let currentHighScore;

    const getRank = (totalKey, rankKey, rankDisplayKey, playerResults, index) => {

      if (index === 0) {
        currentRank = 0;
        currentHighScore = 0;
      }

      if (currentRank === 0) {
        currentRank++;
        playerResults[rankKey] = currentRank;
        playerResults[rankDisplayKey] = currentRank;
        currentHighScore = playerResults[totalKey];
        return playerResults;
      } else if (playerResults[totalKey] === currentHighScore) {
        playerResults[rankKey] = currentRank;
        playerResults[rankDisplayKey] = `T - ${currentRank}`;
        players[index - 1][rankKey] = currentRank;
        players[index - 1][rankDisplayKey] = `T - ${currentRank}`;
        return playerResults;
      } else {
        currentRank++;
        playerResults[rankKey] = currentRank;
        playerResults[rankDisplayKey] = currentRank;
        currentHighScore = playerResults[totalKey];
        return playerResults;
      }
    }

    const getRanksLastWeek = () => {

      players.sort((a, b) => a.lastWeekOverallTotal > b.lastWeekOverallTotal ? -1 : 1);

      return players.map((result, index) => {
        return getRank(`lastWeekOverallTotal`, `rankLastWeek`, `rankLastWeekDisplay`, result, index);
      });
    }

    getRanksLastWeek();

    const getRanksOverall = () => {

      players.sort((a, b) => a.overallTotal > b.overallTotal ? -1 : 1);
  
      return players.map((result, index) => {
        return getRank(`overallTotal`, `rank`, `rankDisplay`, result, index);
      });
    }

    const rankedPlayers = getRanksOverall();

    players = rankedPlayers;

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

    const filters = <Filters filter={filter} entries={entries} allEntries={allEntries} expandFilters={this.expandFilters} showFilters={showFilters} handleCompareChange={(e, name) => this.handleCompareChange(e, name)} handleCompare={comparisons => this.filterEntries(`compare`, comparisons)} handleCompareClick={this.handleCompareClick} handleFilterClick={filter => this.filterEntries(filter)} compareOne={this.state.compareOne} compareTwo={this.state.compareTwo} compareOneName={compareOneName} compareTwoName={compareTwoName} />

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
      gameId: this.props.gameId,
      filters,
      filter,
      allEpisodeResults
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
        {!showSpoilerWarning && newResultsAvailable &&
          <EpisodeResultsSelection>
            <div className="container">
              {episodesWatched === 0 && <span>Not showing any results yet</span>}
              {episodesWatched !== 0 && <span>Showing results up to <strong>{episodesWithLabels[episodesWatched - 1].label}</strong></span>}

              <Button size="small" variant="contained" color="primary" onClick={this.handleEpisodesWatchedDialog}>
                Update
            </Button>
            </div>
          </EpisodeResultsSelection>}

          <EpisodesWatched showSpoilerWarning={showSpoilerWarning} episodesWatched={episodesWatched} allEpisodeResults={allEpisodeResults} handleChange={this.handleEpisodesWatchedChange} handleClose={this.handleEpisodesWatchedDialog} />

        <ScoreboardTabs {...scoreboardTabs} />
      </>
    );
  }
}
