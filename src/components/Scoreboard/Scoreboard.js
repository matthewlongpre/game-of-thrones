import { Button } from "@material-ui/core";
import React from "react";
import { episodes, episodesWithLabels } from "../../shared/constants";
import { firebase } from "../../shared/firebase";
import { EpisodesWatched } from "./EpisodesWatched";
import { Filters } from "./Filters";
import { ScoreboardTabs } from "./ScoreboardTabs";
import { ScoresByEpisode } from "./ScoresByEpisode";
import { ScoreService } from "./ScoreService";
import { ScoresTable } from "./ScoresTable";
import { EpisodeResultsSelection } from "./Styles";
import { Survivers } from "./Survivers";
import { Throne } from "./Throne";
import { calculatePoints } from "./CalculatePoints";

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

    const charactersPromise = this.charactersRef.once('value');
    const betsPromise = this.betsRef.once('value');
    const entriesPromise = this.entriesRef.once('value');
    const usersPromise = this.usersRef.once('value');

    Promise.all([charactersPromise, betsPromise, entriesPromise, usersPromise])
    .then((results) => {
      let [characters, bets, entries, users] = results;

      bets = Object.values(bets.val());
      characters = Object.values(characters.val());
      
      if (!entries.val()) {
        entries = [];
      } else {
        entries = Object.values(entries.val());
      }

      users = users.val();
      let { episodesWatched } = users;

      if (!episodesWatched) {
        episodesWatched = 0;
      }

      this.setState({
        characters,
        bets,
        entries,
        allEntries: entries,
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

      this.calculateResults(episodeResultsForDisplay);

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

    this.calculateResults(episodeResultsForDisplay);
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

  calculateResults = (episodeResults) => {
    const { characters, bets, allEntries } = this.state;
    const calculatedPoints = calculatePoints(this.scoreService, episodeResults, characters, bets, episodes, allEntries);
    this.setState({
      calculatedPoints,
      allEntries: calculatedPoints.players,
      entries: calculatedPoints.players
    });
  }

  render() {

    const { entries, allEntries, calculatedPoints, episodeResults, allEpisodeResults, newResultsAvailable, episodesWatched, showSpoilerWarning, characters, bets, filter, showFilters, compareOneName, compareTwoName } = this.state;

    if (!entries || !episodeResults || !characters || !bets || !calculatedPoints) return <></>;

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

    const {
      seriesFinished,
      allSurvivers,
      allActualCharacterSurviversPoints,
      deadCharacters,
      possiblePointsPerEpisode,
      actualThroneCharacter,
      actualThronePoints,
      leaderPoints
    } = calculatedPoints;

    const players = entries;

    const scoreProps = {
      players,
      leaderPoints,
      seriesFinished,
      allSurvivers,
      allActualCharacterSurviversPoints,
      deadCharacters,
      possiblePointsPerEpisode,
      actualThroneCharacter,
      actualThronePoints,
      scoreService: this.scoreService,
      episodeResults,
      entries,
      characters,
      bets,
      deadCharacterByEpisode,
      deadCharactersForDisplay,
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
