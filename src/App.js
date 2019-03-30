import { MuiThemeProvider } from "@material-ui/core";
import { navigate, Router } from "@reach/router";
import React, { Component } from 'react';
import './App.css';
import { NotFound } from "./components/Error/NotFound";
import { Game } from "./components/Games/Game";
import { GameList } from "./components/Games/GameList";
import { Games } from "./components/Games/Games";
import { Header } from "./components/Header/Header";
import { TopBar } from "./components/Header/TopBar";
import { Login } from "./components/Login/Login";
import { Player } from "./components/Player/Player";
import { Spinner } from "./components/Spinner/Spinner";
import { Success } from "./components/Submission/Success";
import { firebase } from "./shared/firebase";
import { muiTheme } from "./shared/theme";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      loading: true,
      games: [],
      currentGame: null,
      userGamesChecked: false
    }

    this.databaseRef = firebase.database();
    this.providerGoogle = new firebase.auth.GoogleAuthProvider();
    this.providerFacebook = new firebase.auth.FacebookAuthProvider();

  }

  handleAuthSuccess = async (user) => {
    this.resetLoginState();

    const inviteGameId = await this.checkForInvite(user);

    if (inviteGameId) {
      const userHasEntry = await this.checkIfUserHasEntry(user, inviteGameId);
      if (!userHasEntry) {
        this.handleInvite(inviteGameId);
        return;
      }
    }

    const userGames = await this.checkIfUserHasGames(user);

    if (userGames) {
      const gameIds = Object.keys(userGames);
      if (gameIds.length === 1) {
        this.handleSingleGame(user, gameIds[0]);
      } else {
        this.handleMultipleGames(user, gameIds);
      }
    } else {
      this.handleNoGames();
    }
  }

  checkForInvite = async (user) => {
    return new Promise((resolve, reject) => {
      const urlParams = new URLSearchParams(window.location.search);
      const inviteGameId = urlParams.get("invite");
      resolve(inviteGameId);
    });
  }

  handleInvite = (inviteGameId) => {
    navigate(`/${inviteGameId}`)
      .then(
        this.setState({
          isInvite: true,
          currentGame: inviteGameId,
          userGamesChecked: true,
          loading: false
        })
      );
  }

  handleSingleGame = async (user, game) => {
    const userHasEntry = await this.checkIfUserHasEntry(user, game);
    if (userHasEntry) {
      const gameData = await this.fetchGameData([game]);
      this.setState({
        games: gameData,
        currentGame: { id: game },
        userGamesChecked: true,
        loading: false
      }, () => {
        if (window.location.pathname === `/`) {
          navigate(`/${game}`)
        }
      });
    }
  }

  handleMultipleGames = () => {
    console.log("handleMultipleGames");
    navigate("/games");
  }

  handleNoGames = () => {
    this.setState({
      games: [],
      userGamesChecked: true,
      loading: false
    });
  }

  componentDidMount() {
    this.checkLoginState();

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {

        this.setState({
          user
        });

        this.handleAuthSuccess(user);

      } else {

        this.setState({
          loading: false
        });

      }
    });
  }

  checkLoginState = () => {
    const loginState = localStorage.getItem("login-state");
    if (loginState === "LOGGING_IN") {
      this.setState({
        loading: true
      });
    }
  }

  checkIfUserHasGames = (user) => {
    return new Promise((resolve, reject) => {
      const usersRef = this.databaseRef.ref(`users/${user.uid}`);
      return usersRef.once('value')
        .then(item => {

          // if user has not signed up yet
          if (!item.val()) return false;

          const user = item.val();
          const { games } = user;
          return games;
        }).then((games) => {
          resolve(games)
        });
    });
  }

  checkIfUserHasEntry = (user, game) => {
    return new Promise((resolve, reject) => {
      const entriesRef = this.databaseRef.ref(`games/${game}/entries`);
      return entriesRef.once('value')
        .then(item => {

          // if there are no entries at all, return false
          if (!item.val()) return false;

          const entryKeys = Object.keys(item.val());
          const hasEntry = entryKeys.includes(user.uid);
          return hasEntry;
        }).then((hasEntry) => {
          resolve(hasEntry);
        });
    });
  }

  fetchGameData = games => {
    const gamesRef = this.databaseRef.ref(`games`);
    const gamePromises = [];
    games.forEach(game => {
      const gameData = gamesRef.child(game);
      gamePromises.push(gameData.once("value"));
    });

    return Promise.all(gamePromises)
      .then(results => {
        return results.map(item => item.val());
      });
  }

  resetLoginState = () => {
    localStorage.removeItem("login-state");
  }

  resetEntryState = () => {
    localStorage.removeItem("entry-state");
  }

  handleLogout = () => {
    this.resetLoginState();
    this.resetEntryState();
    firebase.auth().signOut();
    this.setState({
      user: null,
      games: []
    });
  }

  handleLoginWithGoogleClick = () => {
    localStorage.setItem("login-state", "LOGGING_IN");
    firebase.auth().signInWithRedirect(this.providerGoogle);
  }

  handleLoginWithFacebookClick = () => {
    localStorage.setItem("login-state", "LOGGING_IN");
    firebase.auth().signInWithRedirect(this.providerFacebook);
  }

  handleSubmissionSuccessClick = gameState => {
    this.setState({
      currentGame: gameState
    },
      () => navigate(gameState)
    )
  }

  render() {
    const { user, loading, games, currentGame, userGamesChecked, isInvite } = this.state;

    if (loading) {
      return (
        <MuiThemeProvider theme={muiTheme}>
          <Spinner />
        </MuiThemeProvider>
      );
    }

    if (!user) {
      return (
        <MuiThemeProvider theme={muiTheme}>
          <Header />
          <Login user={user} handleLoginWithGoogleClick={this.handleLoginWithGoogleClick} handleLoginWithFacebookClick={this.handleLoginWithFacebookClick} />
        </MuiThemeProvider>
      )
    }

    return (
      <MuiThemeProvider theme={muiTheme}>
        <TopBar handleLogout={this.handleLogout} />
        <Header />
        <Router>
          <Success path="success" user={user} handleClick={(gameState) => this.handleSubmissionSuccessClick(gameState)} />

          <Games path="/" user={user} games={games}>
            <GameList path="/games" user={user} games={games} />
            <Game path=":gameId" user={user} currentGame={currentGame} userGamesChecked={userGamesChecked} isInvite={isInvite}>
              <Player path={`player/:playerId`} user={user} />
            </Game>
          </Games>

          <NotFound default />
        </Router>

      </MuiThemeProvider>
    );
  }
}

export default App;
