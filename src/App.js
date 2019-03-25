import { MuiThemeProvider } from "@material-ui/core";
import { navigate, Router } from "@reach/router";
import React, { Component } from 'react';
import './App.css';
import { Game } from "./components/Games/Game";
import { GameList } from "./components/Games/GameList";
import { Games } from "./components/Games/Games";
import { Header } from "./components/Header/Header";
import { TopBar } from "./components/Header/TopBar";
import { Login } from "./components/Login/Login";
import { LoginSuccess } from "./components/Login/LoginSucess";
import { Player } from "./components/Player/Player";
import { Scoreboard } from "./components/Scoreboard/index";
import { Spinner } from "./components/Spinner/Spinner";
import { Submission } from "./components/Submission/Submission";
import { Success } from "./components/Submission/Success";
import { firebase } from "./shared/firebase";
import { muiTheme } from "./shared/theme";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      loading: true,
      games: []
    }

    this.databaseRef = firebase.database();
    this.providerGoogle = new firebase.auth.GoogleAuthProvider();
    this.providerFacebook = new firebase.auth.FacebookAuthProvider();

  }

  componentDidMount() {
    this.checkLoginState();

    if (window.location.pathname.includes("/submission")) {
      const gameSubmissionUrl = window.location.pathname;
      localStorage.setItem("game-state", gameSubmissionUrl);
    }

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // user is signed in.
        this.setState({
          user
        });

        this.resetLoginState();

        this.checkIfUserHasGames(user)
          .then((games) => {
            if (!games) {
              this.setState({
                games: [],
                loading: false
              });

              // if user is submitting for the first time, route them 
              // back to the submission page after signing in
              if (localStorage.getItem("game-state")) {
                const gameStateUrl = localStorage.getItem("game-state");
                navigate(gameStateUrl);
              }

              return;
            }

            this.fetchGameData(games)
              .then(gameData =>
                this.setState({
                  games: gameData,
                  loading: false
                },
                  () => {

                    let gameIdFromUrl = localStorage.getItem("game-state");
                    gameIdFromUrl = gameIdFromUrl.split("/")[2];

                    // check if the user has submitted to this game
                    const game = gameData.find(item => item.id === gameIdFromUrl);
                    if (!game) {
                      navigate(`/games/${gameIdFromUrl}/submission`);
                      return;
                    }

                    // if user is logging in, or returning to the submission page
                    if (window.location.pathname === "/login" || window.location.pathname.includes("/submission")) {
                      // if user has submitted to a single game, send them straight there
                      if (gameData.length === 1) {
                        this.checkIfUserHasEntry(user, game.id)
                          .then((hasEntry) => {
                            if (hasEntry) {
                              navigate(`/games/${game.id}/scoreboard`);
                            } else {
                              navigate(`/games/${game.id}/submission`);
                            }
                          });
                      } else {
                        navigate(`/games`);
                      }
                    };
                  }
                )
              )
          });

      } else {
        // no user is signed in.
        navigate("/login");
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
    const gameKeys = Object.keys(games);
    const gamePromises = [];
    gameKeys.forEach(game => {
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

  render() {
    const { user, loading, games } = this.state;

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
          <Login path="login" user={user} handleLogout={this.handleLogout} handleLoginWithGoogleClick={this.handleLoginWithGoogleClick} handleLoginWithFacebookClick={this.handleLoginWithFacebookClick} />
          <Success path="success" user={user} />
          <LoginSuccess path="login-success" user={user} />

          <Games path="games" user={user} games={games}>
            <GameList path="/" user={user} games={games} />
            <Game path=":gameId" user={user}>
              <Submission path={`submission`} user={user} />
              <Player path={`player/:playerId`} user={user} />
              <Scoreboard path={`scoreboard`} user={user} />
            </Game>
          </Games>
          <NotFound default />
        </Router>

      </MuiThemeProvider>
    );
  }
}

export default App;

const NotFound = () => (
  <div>Sorry, nothing here.</div>
);

