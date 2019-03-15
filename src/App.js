import React, { Component } from 'react';
import './App.css';
import { Router } from "@reach/router"
import Submission from "./Submission";
import Scoreboard from "./Scoreboard";

class App extends Component {
  render() {

    return (
      <Router>
        <Submission path="/" />
        <Scoreboard path="scoreboard" />
      </Router>
    );
  }
}

export default App;
