import React from "react";
import { CharacterBadge } from "../Character/CharacterBadge";
import { PointsBadge } from "../Character/PointsBadge";
import { AirDate, BetsStyle, BetStyle, CardStyle, CharactersStyle, ListLabel, NoPredictions } from "./Card";

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
        <PointsBadge margin="auto" marginLeft="0" marginRight points={1} />
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