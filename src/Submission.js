import React, { Component } from 'react';
import './App.css';
import firebase from "./firebase";

import { Formik } from 'formik';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

import { episodes } from "./constants";

class Submission extends Component {

  databaseRef = firebase.database();
  charactersRef = this.databaseRef.ref('characters');
  entriesRef = this.databaseRef.ref('entries');
  betsRef = this.databaseRef.ref('bets');

  initialCharacterDeathChoices = {};
  initialBetChoices = {};

  state = {
    characters: null,
    bets: null
  }

  componentDidMount() {
    this.charactersRef.on('value', item => {
      const characterKeys = Object.keys(item.val());
      characterKeys.forEach(item => this.initialCharacterDeathChoices[item] = ``)
      const characters = Object.values(item.val());
      this.setState({
        characters: characters
      });
    });
    this.betsRef.on('value', item => {
      const betKeys = Object.keys(item.val());
      betKeys.forEach(item => this.initialBetChoices[item] = ``);
      const bets = Object.values(item.val());
      this.setState({
        bets: bets
      });
    });
  }

  buildCharacterForm = (values, handleChange) => {
    const { characters } = this.state;
    const choices = characters.map(character => {
      const predictionsByEpisode = episodes.map(episode => <MenuItem key={`${character.id}--episode-${episode}`} value={episode}><span className="badge">{character.pointsPerEpisode[episode]} {`${character.pointsPerEpisode[episode] !== "1" ? `pts` : `pt`}`}</span> Dies in Episode {episode}</MenuItem>);
      return (
        <div className="character" key={character.id}>
          <div className="character-name">{character.name}</div>
          <FormControl required margin="dense" fullWidth>
            <InputLabel htmlFor={`characterDeathChoices.${character.id}`}>Prediction</InputLabel>
            <Select
              value={(values.characterDeathChoices ? values.characterDeathChoices[character.id] : ``)}
              onChange={handleChange}
              fullWidth
              inputProps={{
                name: `characterDeathChoices.${character.id}`,
                id: `characterDeathChoices.${character.id}`
              }}
            >
              <MenuItem value={"0"}><span className="badge">{character.pointsPerEpisode[0]} {`${character.pointsPerEpisode[0] !== "1" ? `pts` : `pt`}`}</span>Survives Series</MenuItem>
              <MenuItem value={"7"}><span className="badge">1 pt</span> Dies (Sometime in Series)</MenuItem>
              {predictionsByEpisode}
            </Select>
          </FormControl>
        </div>
      );
    });
    return choices;
  }

  buildBetForm = (values, handleChange) => {
    const { bets } = this.state;
    const choices = bets.map(bet => {
      const predictionsByEpisode = episodes.map(episode => <MenuItem key={`${bet.id}--episode-${episode}`} value={episode}>Episode {episode}</MenuItem>);

      return (
        <div className="bet" key={bet.id}>
          <div className="bet-name">{bet.description}</div>
          <FormControl required margin="dense" fullWidth>
            <InputLabel htmlFor={`betChoices.${bet.id}`}>Prediction</InputLabel>
            <Select
              value={(values.betChoices ? values.betChoices[bet.id] : ``)}
              onChange={handleChange}
              fullWidth
              inputProps={{
                name: `betChoices.${bet.id}`,
                id: `betChoices.${bet.id}`
              }}
            >
              <MenuItem value={0}>Will not occur</MenuItem>

              {predictionsByEpisode}
            </Select>
          </FormControl>
        </div>
      );
    });
    return choices;
  }

  render() {

    const { characters, bets } = this.state;

    if (!characters || !bets) return <p>Loading</p>;

    return (
      <div className="container">
        <Formik
          enableReinitialize={false}
          initialValues={{
            name: ``,
            characterDeathChoices: this.initialCharacterDeathChoices,
            betChoices: this.initialBetChoices
          }}
          onSubmit={(values, { setSubmitting }) => {
            const newEntryRef = this.entriesRef.push();
            newEntryRef.set(values, (error) => {
              if (error) {
                alert(error)
                console.error('Failed', error);
              }
              setSubmitting(false);
            });

          }}
        >
          {({ values, handleSubmit, handleChange, isSubmitting }) => {
            const characterFields = this.buildCharacterForm(values, handleChange);
            const betFields = this.buildBetForm(values, handleChange);
            return <>
              <TextField
                label="Your name"
                onChange={handleChange}
                name="name"
                value={values.name}
                fullWidth
                required
              />
              <h2>Character Deaths</h2>
              {characterFields}
              <h2>Bets</h2>
              {betFields}
              <Button variant="contained" color="primary" fullWidth onClick={handleSubmit} disabled={isSubmitting}>
                Submit
              </Button>
            </>
          }}
        </Formik>
      </div>
    );
  }
}

export default Submission;
