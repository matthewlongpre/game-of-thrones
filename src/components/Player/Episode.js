import React from "react";
import { Avatar } from "./../Character/Avatar";
import styled from "styled-components";

const EpisodeStyle = styled.div`
  margin-bottom: 60px;
`;

const AirDate = styled.span`
  text-transform: uppercase;
  font-size: 50%;
  letter-spacing: 1.5px;
  background: #eee;
  padding: 4px 8px;
  border-radius: 4px;
  position: relative;
  top: -4px;
  margin-left: 10px;
`;

const CharactersStyle = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
`;

const BetsStyle = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const BetStyle = styled.li`
  padding: 10px;
`;

const ListLabel = styled.h3`
  text-transform: uppercase;
  font-size: 66%;
  letter-spacing: 2px;
  margin-bottom: 20px;
`;

const NoPredictions = styled.p`
  margin: 0 0 40px;
  padding: 10px;
`;

export const Episode = ({ episode, airdate, characterChoices, betChoices }) => {
  let characters;
  if (characterChoices.length !== 0) {
    characters = characterChoices.map(choice => (
      <li key={choice.id} className="player-character-list-item">
        <Avatar name={choice.name} id={choice.id} />
        <span className="player-character-name">{choice.name}</span>
        <span className="badge">{choice.pointsPerEpisode[episode]}</span>
      </li>
    ));
  }

  let bets;
  if (betChoices.length !== 0) {
    bets = betChoices.map(bet => (
      <BetStyle key={bet.id} className="">
        <span className="badge">1</span>
        <span className="">{bet.description}</span>
      </BetStyle>
    ));
  }
  return (
    <EpisodeStyle>
      <h2>Episode {episode} <AirDate>{airdate}</AirDate></h2>

      <ListLabel>Death Predictions</ListLabel>
      <CharactersStyle className="player-character-list">{characters}</CharactersStyle>
      {characterChoices.length === 0 && <NoPredictions>No deaths predicted for this episode.</NoPredictions>}

      <ListLabel>Bonus Predictions</ListLabel>
      <BetsStyle className="">{bets}</BetsStyle>
      {betChoices.length === 0 && <NoPredictions>No bonus predictions for this episode.</NoPredictions>}
    </EpisodeStyle>
  );
}