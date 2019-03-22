import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import { navigate, Router } from "@reach/router";
import React, { Component } from 'react';
import './App.css';
import { Header } from "./components/Header/Header";
import { Login } from "./components/Login/Login";
import { LoginSuccess } from "./components/Login/LoginSucess";
import { Scoreboard } from "./components/Scoreboard/index";
import { Spinner } from "./components/Spinner/Spinner";
import { Submission } from "./components/Submission/Submission";
import { Success } from "./components/Submission/Success";
import { firebase } from "./shared/firebase";

const muiTheme = createMuiTheme({
  overrides: {
    MuiButton: {
      text: {
        background: "#131312",
        color: "#fff"
      }
    }
  },
  typography: {
    fontFamily: "Lora",
    useNextVariants: true,
  },
  palette: {
    primary: {
      main: "#131312",
      // main: "#98d8fd",
    },
    secondary: {
      main: "#eaf7ff",
      contrastText: "#131312"
    }
  }
});

class App extends Component {
  state = {
    user: null,
    // loading: true
  }

  uiConfig = {
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID
    ],
    signInSuccessUrl: "/login-success",
    callbacks: {
      signInSuccessWithAuthResult: () => false,
    }
  };

  setLoading = (loading) => {
    console.log("setLoading")
    this.setState({
      loading: loading
    });
  }

  componentDidMount() {
    console.log("componentDidMount")

    firebase.auth().onAuthStateChanged((user) => {
      console.log("authStateChanged", user);

      if (user) {
        // User is signed in.
        this.setState({
          user
        });

        const databaseRef = firebase.database();
        const entriesRef = databaseRef.ref('entries');

        entriesRef.on('value', item => {

          const entryKeys = Object.keys(item.val());
          if (entryKeys.includes(user.uid)) {
            // user has an entry
            navigate("/scoreboard");

          } else {
            // user does not have an entry
            navigate("/submission");

          }
        });

      } else {
        // no user is signed in.

        navigate("/login");
        // this.setState({
        //   loading: false
        // });
      }
    });
  }

  handleLogout = () => {
    firebase.auth().signOut();
  }

  render() {
    const { user, loading } = this.state;

    if (loading) {
      return (
        <MuiThemeProvider theme={muiTheme}>
          <Spinner />
        </MuiThemeProvider>
      );
    }

    return (
      <MuiThemeProvider theme={muiTheme}>
        <button onClick={this.handleLogout}>Sign-out</button>

        <Header />
        <Router>
          <Login path="login" user={user} uiConfig={this.uiConfig} />
          <Submission path="submission" user={user} />
          <Scoreboard path="scoreboard" user={user} />
          <Success path="success" user={user} />
          <LoginSuccess path="login-success" user={user} />
        </Router>

      </MuiThemeProvider>
    );
  }
}

export default App;
