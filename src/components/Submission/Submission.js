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
import { Spinner } from '../Spinner/Spinner';
import { Confirm } from "./Confirm";
import { Avatar } from "./../Character/Avatar";
import { POINTS } from '../../shared/constants';
import { PointsBadge } from '../Character/PointsBadge';
import { CardStyle } from '../Player/Card';
import formSchema from './FormSchema';


const MOCK_ENTRY = {
  "betChoices": {
    "branJaime": "1",
    "brienneJaime": "2",
    "brienneTormond": "6",
    "cleganeBowl": "4",
    "danyPregnant": "5",
    "goldenCompanyArrives": "4",
    "jonArya": "1",
    "jonDragon": "3",
    "jonIsAegon": "1",
    "nightKingDefeated": "5",
    "nymeriaReappears": "5",
    "tridentBattle": "3",
    "tyrionBronn": "2"
  },
  "characterDeathChoices": {
    "astark": "0",
    "babysam": "0",
    "bdondarrion": "5",
    "bronn": "5",
    "bstark": "0",
    "btarth": "0",
    "clannister": "6",
    "dedd": "3",
    "dnaharis": "0",
    "drogon": "0",
    "dseaworth": "0",
    "dtargaryen": "0",
    "egreyjoy": "5",
    "etully": "3",
    "gclegane": "4",
    "gendry": "3",
    "ghost": "0",
    "gilly": "0",
    "greyworm": "3",
    "jlannister": "0",
    "jmormont": "3",
    "jsnow": "0",
    "lyanna": "0",
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
  },
  "throneChoice": "nobodyAtAll"
};

export class Submission extends Component {

  constructor(props) {
    super(props);
    this.databaseRef = firebase.database();
    this.charactersRef = this.databaseRef.ref('characters');
    this.entriesRef = this.databaseRef.ref(`games/${props.gameId}/entries`);
    this.betsRef = this.databaseRef.ref('bets');
    this.usersRef = this.databaseRef.ref('users');

    this.initialCharacterDeathChoices = {};
    this.initialBetChoices = {};

    this.state = {
      characters: null,
      bets: null,
      loading: true
    }
  }

  async componentDidMount() {

    const charactersPromise = this.charactersRef.once('value');
    const betsPromise = this.betsRef.once('value');

    Promise.all([charactersPromise, betsPromise])
      .then((results) => {
        const characterResults = results[0];

        const characterKeys = Object.keys(characterResults.val());
        characterKeys.forEach(item => this.initialCharacterDeathChoices[item] = ``)
        let characters = Object.values(characterResults.val());
        characters = characters.sort((a, b) => a.name < b.name ? -1 : 1);

        const betsResults = results[1];

        const betKeys = Object.keys(betsResults.val());
        betKeys.forEach(item => this.initialBetChoices[item] = ``);
        const bets = Object.values(betsResults.val());

        this.setState({
          bets,
          characters,
          loading: false
        });

      });
  }

  buildCharacterForm = (values, handleChange, handleBlur, touched, errors) => {
    const { characters } = this.state;
    return characters.map(character => {
      const predictionsByEpisode = episodes.map(episode => <MenuItem key={`${character.id}--episode-${episode}`} value={episode}><PointsBadge marginRight points={character.pointsPerEpisode[episode]} /> Dies in Episode {episode}</MenuItem>);
      return (
        <CardStyle key={character.id}>
          <div className="character-data">
            <Avatar {...character} />
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
                <MenuItem value={"0"}><PointsBadge marginRight points={character.pointsPerEpisode[0]} /> Survives Series</MenuItem>
                <MenuItem value={"7"}><PointsBadge marginRight points={POINTS.DIED_SOMETIME_VALUE} /> Dies (Sometime in Series)</MenuItem>
                <MenuItem disabled><div className="select-divider-label">Expert Level</div></MenuItem>
                {predictionsByEpisode}
              </Select>
            </FormControl>
          </div>
        </CardStyle>
      );
    });
  }

  buildBetForm = (values, handleChange, handleBlur, touched, errors) => {
    const { bets } = this.state;
    return bets.map(bet => {
      const predictionsByEpisode = episodes.map(episode => <MenuItem key={`${bet.id}--episode-${episode}`} value={episode}><PointsBadge marginRight points={1} /> Episode {episode}</MenuItem>);

      return (
        <CardStyle key={bet.id}>
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
              <MenuItem value={"0"}><PointsBadge marginRight points={POINTS.BONUS_PREDICTION_VALUE} /> Will not occur</MenuItem>
              {predictionsByEpisode}
            </Select>
          </FormControl>
        </CardStyle>
      );
    });
  }

  buildThroneForm = (values, handleChange, handleBlur, touched, errors) => {
    const { characters } = this.state;
    const throneChoices = characters.map(choice =>
      <MenuItem key={choice.id} value={choice.id}><PointsBadge marginRight points={choice.pointsForThrone} /> {choice.name}</MenuItem>
    );
    return (
      <CardStyle>
        <FormControl required margin="dense" fullWidth>
          <InputLabel htmlFor={`throneChoice`}>Prediction</InputLabel>
          <Select
            value={(values.throneChoice ? values.throneChoice : ``)}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.throneChoice ? (touched.throneChoice && (errors.throneChoice ? Boolean(errors.throneChoice) : null)) : null}
            fullWidth
            inputProps={{
              name: `throneChoice`,
              id: `throneChoice`
            }}
          >
            <MenuItem value={`nobodyInList`}><PointsBadge marginRight points={POINTS.THRONE_NOBODY_LIST} /> Nobody in this list</MenuItem>
            <MenuItem value={`nobodyAtAll`}><PointsBadge marginRight points={POINTS.THRONE_NOBODY_ALL} /> Nobody at all</MenuItem>
            {throneChoices}
          </Select>
        </FormControl>
      </CardStyle>
    );
  }

  handleSubmit = (values, setSubmitting) => {
    setSubmitting(true);

    values.userId = this.props.user.uid;
    values.name = this.props.user.displayName;
    values.photoURL = this.props.user.photoURL;

    // game ID for submission
    const gameIdForSubmission = {};
    gameIdForSubmission[this.props.gameId] = true;

    if (this.usersRef.child(this.props.user.uid)) {
      // check if user is a returning user
      const userRef = this.usersRef.child(this.props.user.uid);
      const userGamesRef = userRef.child("games")
      userGamesRef.update(gameIdForSubmission, error => {
        if (error) {
          alert(error)
          console.error('Failed', error);
        }
      });
    } else {
      // if user is new
      const userData = {};
      userData.games = gameIdForSubmission;

      const newUserRef = this.usersRef.child(this.props.user.uid);
      newUserRef.update(userData, error => {
        if (error) {
          alert(error)
          console.error('Failed', error);
        }
      });
    }

    localStorage.setItem("game-state", `/games/${this.props.gameId}`);

    const newEntryRef = this.entriesRef.child(this.props.user.uid);

    newEntryRef.set(values, error => {
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

    const { loading, characters, bets, showConfirm } = this.state;

    if (loading) return <Spinner />;

    return (
      <div className="">
        <Formik
          enableReinitialize={false}
          validationSchema={formSchema}
          initialValues={{
            name: ``,
            characterDeathChoices: this.initialCharacterDeathChoices,
            betChoices: this.initialBetChoices,
            throneChoice: ``
          }}
          // initialValues={MOCK_ENTRY}
          onSubmit={(values, { setSubmitting }) => {
            this.handleSubmit(values, setSubmitting);
          }}
        >
          {({ values, errors, touched, handleSubmit, handleChange, handleBlur, isSubmitting, setFieldTouched, setSubmitting }) => {

            const characterFields = this.buildCharacterForm(values, handleChange, handleBlur, touched, errors);
            const betFields = this.buildBetForm(values, handleChange, handleBlur, touched, errors);
            const throneFields = this.buildThroneForm(values, handleChange, handleBlur, touched, errors);

            if (showConfirm) {
              return (
                <>
                  <Confirm {...values} characters={characters} bets={bets} handleGoBack={this.handleGoBack} />
                  <div className="sticky-controls">
                    <div className="container d-flex w-100">
                      <Button className="confirm-fix" variant="contained" color="secondary" onClick={this.handleGoBack}>Go Back &amp; Fix</Button>
                      <Button className="submit-button" variant="contained" color="primary" onClick={handleSubmit} disabled={isSubmitting}>
                        Submit
                      </Button>
                    </div>
                  </div>
                </>
              );
            }

            return (
              <div className="container container-form">
                <div className="your-name">
                </div>
                <div className="form-prose">
                  <h2>Getting started</h2>
                  <p>Make a prediction for each character, and receive the assigned points value if it comes true.</p>
                  <ul>
                    <li>Points for predictions are weighted for each character based on how likely they are to occur.</li>
                    <li>If you choose an <strong>Expert Level</strong> prediction, and it turns out the character does die but in a different episode than you chose, you'll receive <strong>1 point</strong>.</li>
                    <li><strong>Dies (Sometime in Series)</strong> is always worth <strong>2 points</strong>.</li>
                  </ul>

                </div>

                <div className="form-prose">
                  <h2>Choose their fates</h2>
                </div>

                {characterFields}

                <div className="form-prose">
                  <h2>Plot predictions</h2>
                  <p>Pick up some extra points by guessing when some key story beats will take place.</p>
                  <p></p>
                </div>

                {betFields}


                <div className="form-prose">
                  <h2>Throne prediction</h2>
                  <p>Who will sit the Iron Throne when the series wraps?</p>
                </div>

                {throneFields}

                <Button className="confirm-button" variant="contained" color="primary" fullWidth onClick={this.handleConfirm}>
                  Confirm
                </Button>

              </div>
            );
          }}
        </Formik>
      </div>
    );
  }
}
