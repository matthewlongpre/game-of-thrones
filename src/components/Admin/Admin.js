import { Button } from "@material-ui/core";
import 'array-flat-polyfill';
import React from "react";
import { firebase } from "../../shared/firebase";
import { Spinner } from "../Spinner/Spinner";
import { AdminContainer } from "./Styles";

export class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.databaseRef = firebase.database();
    this.charactersRef = this.databaseRef.ref('characters');
    this.betsRef = this.databaseRef.ref('bets');
    this.episodesRef = this.databaseRef.ref('episodes');
    this.usersRef = this.databaseRef.ref('users');
    this.gamesRef = this.databaseRef.ref('games');

    this.state = {
      characters: null,
      bets: null,
      loading: true,
      betResults: [],
      deathResults: [],
      throneResult: ``
    }

    const charactersPromise = this.charactersRef.once('value');
    const betsPromise = this.betsRef.once('value');

    const games = this.gamesRef.once('value');
    games.then(items => {
      
      let games = Object.values(items.val());
      games = games.map(item => item.entries);
      games = games.flat();
      
      const userGameData = {};
      games.forEach(item => {
        for (const key in item) {
          userGameData[key] = item[key];
        }

      })

      this.usersRef.on('value', item => {
        let users = item.val();
        let data = [];
        for (const key in users) {
          const gamesWatched = {};
          const user = userGameData[key];
          
          gamesWatched[key] = userGameData[key];
          if (user) {
            gamesWatched.name = user.name;
          }
          if (users[key].episodesWatched) {
            gamesWatched.episodesWatched = users[key].episodesWatched;
          }
          data.push(gamesWatched);
        }

        data = data.filter(item => item.name);

        const hasWatched = data.filter(item => item.episodesWatched);
        const hasNotWatched = data.filter(item => !item.episodesWatched);

        console.table(hasWatched, ['name', 'episodesWatched']);
        console.table(hasNotWatched, ['name'])

      });

    });



    this.episodesRef.on('value', item => {

      const episodeResults = item.val();
      this.setState({
        episodeResults
      });


    });

    Promise.all([charactersPromise, betsPromise])
      .then((results) => {
        let [characters, bets] = results;

        bets = Object.values(bets.val());
        characters = Object.values(characters.val());

        this.setState({
          characters: characters,
          bets: bets,
          loading: false
        });

      });
  }

  handleSubmit = (values, setSubmitting) => {
    setSubmitting(true);

    const episodeData = {};

    this.episodesRef.update(episodeData, error => {
      if (error) {
        alert(error)
        console.error('Failed', error);
      }
    });

  }

  handleEpisodeChange = (e, name) => {
    const episode = e.target.value;
    const { episodeResults } = this.state;

    let betResults = [];
    if (episodeResults[episode]) {
      const betResultsObj = episodeResults[episode].bets;
      if (betResultsObj) {
        betResults = betResultsObj.map(item => item.id);
      }
    }

    let deathResults = [];
    if (episodeResults[episode]) {
      const deathResultsObj = episodeResults[episode].deaths;
      if (deathResultsObj) {
        deathResults = deathResultsObj.map(item => item.id);
      }
    }

    let throneResult;
    if (episode === `episode6`) {
      if (episodeResults[episode]) {
        throneResult = episodeResults[episode].throne;
      } else {
        throneResult = ``
      }
    }

    this.setState({
      episode: episode,
      betResults,
      deathResults,
      throneResult
    });
  }

  handleChange = (e, name) => {
    this.setState({
      [name]: e.target.value
    });
  }

  handleChangeMultiple = (e, name) => {
    const { options } = e.target;

    const value = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }

    this.setState({
      [name]: value
    });
  }

  convertToObjects = (array) => {
    return array.map(item => {
      const obj = {};
      obj.id = item;
      return obj;
    });
  }

  handleSubmit = () => {
    const { betResults, episode, deathResults, throneResult } = this.state;

    let betSubmission;
    if (betResults.includes("none")) {
      betSubmission = false;
    } else {
      betSubmission = this.convertToObjects(betResults);
    }

    let deathSubmission;
    if (deathResults.includes("none")) {
      deathSubmission = false;
    } else {
      deathSubmission = this.convertToObjects(deathResults);
    }

    const episodeResults = {};
    episodeResults.bets = betSubmission;
    episodeResults.deaths = deathSubmission;

    if (episode === `episode6`) {
      episodeResults.throne = throneResult;
    }

    this.episodeRef = this.databaseRef.ref(`episodes/${episode}`);

    this.episodeRef.update(episodeResults, error => {
      if (error) {
        alert(error)
        console.error('Failed', error);
      }
    });

  }

  handleResetClick = () => {
    if (window.confirm("Reset results?")) {
      this.handleReset();
    }
  }

  handleReset = () => {
    const episodes = true;
    this.episodesRef.set(episodes, error => {
      if (error) {
        alert(error)
        console.error('Failed', error);
      }
    });
  }

  handleDeleteClick = () => {
    if (window.confirm("Delete this episode?")) {
      this.handleDelete();
    }
  }

  handleDelete = () => {
    const { episode } = this.state;
    this.databaseRef.ref(`episodes/${episode}`).remove();
  }

  render() {
    const { loading, bets, characters, episode } = this.state;
    if (loading) return <Spinner />;

    return (
      <AdminContainer>
        <div>
          <select onChange={e => this.handleEpisodeChange(e, "episode")}>
            <option value=""></option>
            <option value="episode1">Episode 1</option>
            <option value="episode2">Episode 2</option>
            <option value="episode3">Episode 3</option>
            <option value="episode4">Episode 4</option>
            <option value="episode5">Episode 5</option>
            <option value="episode6">Episode 6</option>
          </select>
          <button onClick={this.handleDeleteClick}>Delete</button>
          <button onClick={this.handleResetClick}>Reset</button>
        </div>
        <div className="main">
          <div>
            <h2>Plot</h2>
            <select
              multiple value={this.state.betResults}
              onChange={(e) => this.handleChangeMultiple(e, "betResults")}
            >
              <option value="none">None</option>
              {bets.map(bet =>
                <option key={bet.id} value={bet.id}>{bet.description}</option>
              )}
            </select>
          </div>
          <div>
            <h2>Deaths</h2>
            <select
              multiple value={this.state.deathResults}
              onChange={(e) => this.handleChangeMultiple(e, "deathResults")}
            >
              <option value="none">None</option>
              {characters.map(character =>
                <option key={character.id} value={character.id}>{character.name}</option>
              )}
            </select>
          </div>
        </div>
        {episode === `episode6` && <div>
          <h2>Throne</h2>
          <select
            onChange={e => this.handleChange(e, "throneResult")}
            value={this.state.throneResult}
          >
            <option value=""></option>
            <option value="nobodyInList">Nobody in the list</option>
            <option value="nobodyAtAll">Nobody at all</option>
            {characters.map(character =>
              <option key={character.id} value={character.id}>{character.name}</option>
            )}
          </select>
        </div>}
        <div>
          <p>
            <Button disabled={!episode} variant="contained" color="primary" onClick={this.handleSubmit}>Submit</Button>
          </p>
        </div>
      </AdminContainer>
    );
  }
}