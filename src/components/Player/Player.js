import { Link } from "@reach/router";
import React from "react";
import styled from "styled-components";
import { airdates, episodes } from "./../../shared/constants";
import { firebase } from "./../../shared/firebase";
import { Spinner } from "./../Spinner/Spinner";
import { Episode } from "./Episode";
import { PlayerAvatar } from "./PlayerAvatar";

export class Player extends React.Component {
  state = {
    player: null,
    loading: true
  }

  databaseRef = firebase.database();
  charactersRef = this.databaseRef.ref('characters');
  betsRef = this.databaseRef.ref('bets');
  entryRef = this.databaseRef.ref(`games/${this.props.gameId}/entries/${this.props.playerId}`);

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

  async componentDidMount() {

    const charactersPromise = this.charactersRef.once('value');
    const betsPromise = this.betsRef.once('value');
    const entryPromise = this.entryRef.once('value');

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
          loading: false
        });

      });
  }

  render() {
    const { loading, charactersByEpisode, betsByEpisode, entry } = this.state;

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
      </div>
    );
  }
}

const PlayerHeader = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;
