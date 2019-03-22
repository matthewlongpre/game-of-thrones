import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { navigate } from "@reach/router";
import { Formik } from "formik";
import React, { Component } from 'react';
import { episodes } from "../../shared/constants";
import { firebase } from "../../shared/firebase";
import avatars from "./../../assets/avatars/index";
import { Confirm } from "./Confirm";


const MOCK_ENTRY = {
  "betChoices": {
    "branJaime": "2",
    "brienneJaime": "3",
    "brienneTormond": "5",
    "cleganeBowl": "5",
    "danyPregnant": "2",
    "goldenCompanyArrives": "1",
    "jonArya": "2",
    "jonDragon": "5",
    "jonIsAegon": "2",
    "nightKingDefeated": "6",
    "nymeriaReappears": "5",
    "tridentBattle": "5",
    "tyrionBronn": "4"
  },
  "characterDeathChoices": {
    "astark": "0",
    "babysam": "0",
    "bdondarrion": "3",
    "bronn": "5",
    "bstark": "6",
    "btarth": "5",
    "clannister": "6",
    "dedd": "3",
    "dnaharis": "0",
    "drogon": "0",
    "dseaworth": "3",
    "dtargaryen": "0",
    "egreyjoy": "5",
    "etully": "3",
    "gclegane": "4",
    "gendry": "3",
    "ghost": "0",
    "gilly": "0",
    "greyworm": "3",
    "jlannister": "6",
    "jmormont": "3",
    "jsnow": "0",
    "lyanna": "3",
    "melisandre": "4",
    "missandei": "0",
    "nightking": "3",
    "nymeria": "0",
    "ppayne": "3",
    "qyburn": "5",
    "rarryn": "0",
    "rhaegal": "0",
    "sclegane": "5",
    "sstark": "0",
    "starly": "0",
    "tgiantsbane": "3",
    "tgreyjoy": "5",
    "tlannister": "0",
    "varys": "5",
    "ygreyjoy": "5"
  }
};

export class Submission extends Component {

  databaseRef = firebase.database();
  charactersRef = this.databaseRef.ref('characters');
  entriesRef = this.databaseRef.ref('entries');
  betsRef = this.databaseRef.ref('bets');

  initialCharacterDeathChoices = {};
  initialBetChoices = {};

  state = {
    characters: null,
    bets: null,
    loading: true,
  }

  componentDidMount() {
    this.charactersRef.on('value', item => {
      const characterKeys = Object.keys(item.val());
      characterKeys.forEach(item => this.initialCharacterDeathChoices[item] = ``)
      let characters = Object.values(item.val());
      characters = characters.sort((a, b) => a.name < b.name ? -1 : 1);

      this.setState({
        characters
      });
    });

    this.betsRef.on('value', item => {
      const betKeys = Object.keys(item.val());
      betKeys.forEach(item => this.initialBetChoices[item] = ``);
      const bets = Object.values(item.val());
      this.setState({
        bets
      });
    });
  }

  buildCharacterForm = (values, handleChange, handleBlur, touched, errors) => {
    const { characters } = this.state;
    const choices = characters.map(character => {
      const predictionsByEpisode = episodes.map(episode => <MenuItem key={`${character.id}--episode-${episode}`} value={episode}><span className="badge">{character.pointsPerEpisode[episode]} {`${character.pointsPerEpisode[episode] !== "1" ? `pts` : `pt`}`}</span> Dies in Episode {episode}</MenuItem>);
      return (
        <div className="character" key={character.id}>
          <div className="character-data">
            <div className="character-avatar-container">
              {avatars[character.id] ? <img className="character-avatar" alt={character.name} src={avatars[character.id]} /> : <div className="avatar-placeholder"></div>}
            </div>
            <div className="character-name">{character.name}</div>
          </div>
          <div className="character-input">
            <FormControl required margin="dense" fullWidth>
              <InputLabel htmlFor={`characterDeathChoices.${character.id}`}>Prediction</InputLabel>
              <Select
                value={(values.characterDeathChoices ? values.characterDeathChoices[character.id] : ``)}
                onBlur={handleBlur}
                onChange={handleChange}
                fullWidth
                error={touched.characterDeathChoices ? (touched.characterDeathChoices[character.id] && (errors.characterDeathChoices ? Boolean(errors.characterDeathChoices[character.id]) : null)) : null}
                inputProps={{
                  name: `characterDeathChoices.${character.id}`,
                  id: `characterDeathChoices.${character.id}`
                }}
              >
                <MenuItem value={"0"}><span className="badge">{character.pointsPerEpisode[0]} {`${character.pointsPerEpisode[0] !== "1" ? `pts` : `pt`}`}</span>Survives Series</MenuItem>
                <MenuItem value={"7"}><span className="badge">2 pts</span> Dies (Sometime in Series)</MenuItem>
                <MenuItem disabled><div className="select-divider-label">Expert Level</div></MenuItem>
                {predictionsByEpisode}
              </Select>
            </FormControl>
          </div>
        </div>
      );
    });
    return choices;
  }

  buildBetForm = (values, handleChange, handleBlur, touched, errors) => {
    const { bets } = this.state;
    const choices = bets.map(bet => {
      const predictionsByEpisode = episodes.map(episode => <MenuItem key={`${bet.id}--episode-${episode}`} value={episode}><span className="badge">1 pt</span> Episode {episode}</MenuItem>);

      return (
        <div className="bet" key={bet.id}>
          <div className="bet-name">{bet.description}</div>
          <FormControl required margin="dense" fullWidth>
            <InputLabel htmlFor={`betChoices.${bet.id}`}>Prediction</InputLabel>
            <Select
              value={(values.betChoices ? values.betChoices[bet.id] : ``)}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.betChoices ? (touched.betChoices[bet.id] && (errors.betChoices ? Boolean(errors.betChoices[bet.id]) : null)) : null}
              fullWidth
              inputProps={{
                name: `betChoices.${bet.id}`,
                id: `betChoices.${bet.id}`
              }}
            >
              <MenuItem value={0}><span className="badge">1 pts</span> Will not occur</MenuItem>
              {predictionsByEpisode}
            </Select>
          </FormControl>
        </div>
      );
    });
    return choices;
  }

  handleSubmit = (values, setSubmitting) => {
    setSubmitting(true);

    values.userId = this.props.user.uid;
    values.name = this.props.user.displayName;

    // const newEntryRef = this.entriesRef.push();
    const newEntryRef = this.entriesRef.child(this.props.user.uid);



    newEntryRef.set(values, (error) => {
      if (error) {
        alert(error)
        console.error('Failed', error);
      }
      setSubmitting(false);
      navigate(`/success`);
    });
    setSubmitting(false);
  }

  handleConfirm = () => {
    this.setState({
      showConfirm: true
    },
      window.scrollTo(0, 0)
    );
  }

  handleGoBack = () => {
    this.setState({
      showConfirm: false
    });
  }

  render() {

    const { characters, bets, showConfirm } = this.state;

    if (!characters || !bets) return <></>;

    return (
      <div className="container container-form">
        <Formik
          // validationSchema={formSchema}
          enableReinitialize={false}
          // initialValues={{
          //   name: ``,
          //   characterDeathChoices: this.initialCharacterDeathChoices,
          //   betChoices: this.initialBetChoices
          // }}
          initialValues={MOCK_ENTRY}
          onSubmit={(values, { setSubmitting }) => {
            this.handleSubmit(values, setSubmitting);
          }}
        >
          {({ values, errors, touched, handleSubmit, handleChange, handleBlur, isSubmitting, setFieldTouched, setSubmitting }) => {

            const characterFields = this.buildCharacterForm(values, handleChange, handleBlur, touched, errors);
            const betFields = this.buildBetForm(values, handleChange, handleBlur, touched, errors);

            if (showConfirm) {
              return (
                <>
                  <Confirm {...values} characters={characters} bets={bets} handleGoBack={this.handleGoBack} />
                  <div className="sticky-controls">
                    <Button className="confirm-fix" variant="contained" color="secondary" onClick={this.handleGoBack}>Go Back &amp; Fix</Button>
                    <Button className="submit-button" variant="contained" color="primary" onClick={handleSubmit} disabled={isSubmitting}>
                      Submit
                    </Button>
                  </div>
                </>
              );
            }

            return (
              <>
                <div className="your-name">
                </div>
                <div className="points-description">
                  <h2>Getting started</h2>
                  <p>Make a prediction for each character, and receive the assigned points value if it comes true.</p>
                  <ul>
                    <li>Points for predictions are weighted for each character based on how likely they are to occur.</li>
                    <li>If you choose an <strong>Expert Level</strong> prediction, and it turns out the character does die but in a different episode than you chose, you'll receive <strong>1 point</strong>.</li>
                    <li><strong>Dies (Sometime in Series)</strong> is always worth <strong>2 points</strong>.</li>
                  </ul>
                </div>
                <h2>Choose their fates</h2>

                {characterFields}

                <div className="points-description">
                  <h2>Bonus predictions</h2>
                  <p>Pick up some extra points by guessing when some key story beats will take place.</p>
                  <p></p>
                </div>

                {betFields}

                <Button className="confirm-button" variant="contained" color="primary" fullWidth onClick={this.handleConfirm}>
                  Confirm
                </Button>

              </>
            );
          }}
        </Formik>
      </div>
    );
  }
}
