import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import { navigate, Router } from "@reach/router";
import React, { Component } from 'react';
import './App.css';
import * as logo from "./assets/got-logo.jpg";
import Login from "./components/Login/Login";
import { Scoreboard } from "./components/Scoreboard/index";
import Spinner from "./components/Spinner/Spinner";
import Submission from "./components/Submission/Submission";
import Success from "./components/Submission/Success";
import firebase from "./shared/firebase";

const provider = new firebase.auth.FacebookAuthProvider();

const muiTheme = createMuiTheme({
  typography: {
    fontFamily: "Lora",
    useNextVariants: true,
  },
  palette: {
    primary: {
      main: "#98d8fd",
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
    loading: true
  }

  login = () => {
    firebase.auth().signInWithRedirect(provider);
  }

  componentDidMount() {
    firebase.auth().getRedirectResult().then((result) => {
      if (result.credential) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken;
        // ...
      }
      // The signed-in user info.
      const user = result.user;



      this.setState({
        user,
        loading: false
      });
      // navigate("/submission");



    }).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;

      console.log(errorCode)
      console.log(email)
      console.log(errorMessage)
      // ...
    });

    firebase.auth().onAuthStateChanged((user) => {
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
            navigate("/submission");
          }
        });

      } else {
        // No user is signed in.
        console.log("no user")
        navigate("/login");
      }
    });
  }

  render() {
    const { user, loading } = this.state;

    if (loading) return <Spinner />

    return (
      <MuiThemeProvider theme={muiTheme}>
        <header>
          {user ? user.displayName :
          <button onClick={this.login}>Login</button>}
          <div className="container">
            <img alt="Game of Thrones" className="logo" src={logo} />
            <h3 className="header-title">Prediction Pool</h3>
          </div>
        </header>
        <Router>
          <Login path="login" />
          <Submission path="submission" user={user} />
          <Scoreboard path="scoreboard" />
          <Success path="success" user={user} />
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
