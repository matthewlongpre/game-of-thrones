import { Link } from "@reach/router";
import React from "react";
import styled from "styled-components";
import { CharacterBadge } from "../Character/CharacterBadge";
import { airdates, episodes } from "./../../shared/constants";
import { firebase } from "./../../shared/firebase";
import { Spinner } from "./../Spinner/Spinner";
import { Episode } from "./Episode";
import { PlayerAvatar } from "./PlayerAvatar";
import { CardStyle } from "./Card";

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
    const { loading, charactersByEpisode, betsByEpisode, entry, characters } = this.state;

    if (loading) return <Spinner />

    if (!entry) return <div>You haven't submitted an entry for this game. <Link to={`/games/${this.props.gameId}/submission`}>Submit your entry</Link></div>

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
          <h2>Throne prediction</h2>
          <ul className="player-character-list">
            <li className="player-character-list-item">
              <ThroneChoice throneChoice={entry.throneChoice} characters={characters} />
            </li>
          </ul>
        </CardStyle>

      </div>
    );
  }
}

const ThroneChoice = ({ throneChoice, characters }) => {
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
