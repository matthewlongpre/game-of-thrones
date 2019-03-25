import React from "react";
import styled from "styled-components";
import { CharacterBadge } from "../Character/CharacterBadge";
import { PointsBadge } from "../Character/PointsBadge";
import { CardStyle } from "./Card";

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
  display: flex;
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
  background: #e1f4ff;
  border-radius: 5px;
`;

export const Episode = ({ episode, airdate, characterChoices, betChoices }) => {
  let characters;
  if (characterChoices.length !== 0) {
    characters = characterChoices.map(choice => (
      <li key={choice.id} className="player-character-list-item">
        <CharacterBadge name={choice.name} id={choice.id} points={choice.pointsPerEpisode[episode]} />
      </li>
    ));
  }

  let bets;
  if (betChoices.length !== 0) {
    bets = betChoices.map(bet => (
      <BetStyle key={bet.id} className="">
        <PointsBadge marginRight points={1} />
        <span className="">{bet.description}</span>
      </BetStyle>
    ));
  }
  return (
    <CardStyle>
      <h2>Episode {episode} <AirDate>{airdate}</AirDate></h2>

      <ListLabel>Death Predictions</ListLabel>
      <CharactersStyle className="player-character-list">
        {characters}
      </CharactersStyle>
      {characterChoices.length === 0 && <NoPredictions>No deaths predicted for this episode.</NoPredictions>}

      <ListLabel>Plot Predictions</ListLabel>
      <BetsStyle className="">
        {bets}
      </BetsStyle>
      {betChoices.length === 0 && <NoPredictions>No plot predictions for this episode.</NoPredictions>}

    </CardStyle>
  );
}