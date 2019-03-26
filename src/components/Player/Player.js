import { Link } from "@reach/router";
import React from "react";
import styled from "styled-components";
import { CharacterBadge } from "../Character/CharacterBadge";
import { airdates, episodes } from "./../../shared/constants";
import { firebase } from "./../../shared/firebase";
import { Spinner } from "./../Spinner/Spinner";
import { CardStyle, CharactersStyle } from "./Card";
import { Episode } from "./Episode";
import { PlayerAvatar } from "./PlayerAvatar";

export class Player extends React.Component {
  state = {
    playerId: null,
    loading: true
  }

  databaseRef = firebase.database();
  charactersRef = this.databaseRef.ref('characters');
  betsRef = this.databaseRef.ref('bets');

  getChoicesByEpisode = choices => {
    return episodes.map(episode => {
      const episodeChoices = [];
      for (const key in choices) {
        if (choices[key] === episode) {
          episodeChoices.push(key);
        }
      }
      return episodeChoices;
    });
  }

  getDataByEpisode = (choicesByEpisode, characters) => {
    return choicesByEpisode.map(choice => {
      return choice.map(item => characters[item]);
    });
  }

  getCharacterSurviverChoices = (characterDeathChoices) => {
    const characterSurviverChoices = [];
    for (const key in characterDeathChoices) {
      if (characterDeathChoices[key] === "0") {
        characterSurviverChoices.push(key);
      }
    }
    return characterSurviverChoices;
  }

  componentDidUpdate(nextProps, prevState) {
    if (this.props.playerId !== prevState.playerId) {
      this.fetchData();
    }
  }

  fetchData = () => {

    if (!this.state.loading) {
      this.setState({
        loading: true
      })
    }

    const charactersPromise = this.charactersRef.once('value');
    const betsPromise = this.betsRef.once('value');

    const entryRef = this.databaseRef.ref(`games/${this.props.gameId}/entries/${this.props.playerId}`);
    const entryPromise = entryRef.once('value');

    Promise.all([
      charactersPromise,
      betsPromise,
      entryPromise
    ])
      .then((results) => {
        const characters = results[0].val();
        const bets = results[1].val();
        const entry = results[2].val();
        if (!entry) {
          this.setState({
            entry,
            loading: false
          });
          return;
        }

        const playerId = this.props.playerId;
        const playerName = entry.name;
        const characterDeathChoices = entry.characterDeathChoices;
        const characterSurviverChoices = this.getCharacterSurviverChoices(characterDeathChoices);
        const characterChoicesByEpisode = this.getChoicesByEpisode(characterDeathChoices);
        const charactersByEpisode = this.getDataByEpisode(characterChoicesByEpisode, characters);

        const betChoices = entry.betChoices;
        const betChoicesByEpisode = this.getChoicesByEpisode(betChoices);
        const betsByEpisode = this.getDataByEpisode(betChoicesByEpisode, bets);

        this.setState({
          characters,
          bets,
          entry,
          charactersByEpisode,
          betsByEpisode,
          characterSurviverChoices,
          playerName,
          playerId,
          loading: false
        });

      });
  }

  componentDidMount() {
    this.fetchData();
  }

  render() {
    const { loading, charactersByEpisode, betsByEpisode, characterSurviverChoices, entry, characters } = this.state;

    if (loading) return <Spinner />

    if (!entry) return <div>You haven't submitted an entry for this game. <Link to={`/games/${this.props.gameId}/submission`}>Submit your entry</Link></div>

    let survivingCharacters;
    if (characterSurviverChoices.length !== 0) {
      survivingCharacters = characterSurviverChoices.map(choice => (
        <li key={choice} className="player-character-list-item">
          <CharacterBadge name={characters[choice].name} id={choice} points={characters[choice].pointsPerEpisode[0]} />
        </li>
      ));
    }

    const episodeCards = episodes.map(episode => {
      return (
        <Episode
          key={`episode--${episode}`}
          episode={episode} airdate={airdates[episode - 1]}
          characterChoices={charactersByEpisode[episode - 1]}
          betChoices={betsByEpisode[episode - 1]}
        />
      );
    })
    return (
      <div className="container-lg">
        <PlayerHeader>
          <PlayerAvatar name={entry.name} photoURL={entry.photoURL} />
          <h2>{entry.name}</h2>
        </PlayerHeader>

        {episodeCards}

        <CardStyle>
          <h2>Surviver predictions</h2>
          <CharactersStyle className="player-character-list">
            {survivingCharacters}
          </CharactersStyle>
        </CardStyle>

        <CardStyle>
          <h2>Throne prediction</h2>
          <ThroneChoice throneChoice={entry.throneChoice} characters={characters} />
          <ul className="player-character-list">
            <li className="player-character-list-item">
              {(entry.throneChoice !== "nobodyInList" && entry.throneChoice !== "nobodyAtAll") ? <ThroneChoiceCharacterBadge throneChoice={entry.throneChoice} characters={characters} /> : null}
            </li>
          </ul>
        </CardStyle>

      </div>
    );
  }
}

const ThroneChoice = ({ throneChoice, characters }) => {

  let throneChoiceCharacter;

  if (throneChoice === "nobodyInList") {
    throneChoiceCharacter = "Nobody in the list";
  } else if (throneChoice === "nobodyAtAll") {
    throneChoiceCharacter = "Nobody at all";
  } else {
    throneChoiceCharacter = characters[throneChoice].name;
  }

  return <p><strong>{throneChoiceCharacter}</strong> will sit the Iron Throne.</p>
}

const ThroneChoiceCharacterBadge = ({ throneChoice, characters }) => {

  const throneChoiceCharacter = characters[throneChoice];
  const { name, id, pointsForThrone } = throneChoiceCharacter;
  return (
    <CharacterBadge name={name} id={id} points={pointsForThrone} />
  );
}

const PlayerHeader = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;
