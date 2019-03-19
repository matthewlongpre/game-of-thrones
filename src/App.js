import { createMuiTheme, MuiThemeProvider } from "@material-ui/core";
import { Router } from "@reach/router";
import React, { Component } from 'react';
import './App.css';
import * as logo from "./assets/got-logo.jpg";
import { Scoreboard } from "./components/Scoreboard/index";
import Submission from "./components/Submission/Submission";
import Success from "./components/Submission/Success";

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
  render() {
    return (
      <MuiThemeProvider theme={muiTheme}>
        <header>
          <div className="container">
            <img alt="Game of Thrones" className="logo" src={logo} />
            <h3 className="header-title">Prediction Pool</h3>
          </div>
        </header>
        <Router>
          <Submission path="/" />
          <Scoreboard path="scoreboard" />
          <Success path="success" />
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
