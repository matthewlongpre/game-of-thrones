import React from "react";
import { CharacterStyle, CardStyle, ListLabel, CharactersStyle, BetStyle, NoPredictions, BetsStyle } from "../Player/Card";
import { CharacterBadge } from "../Character/CharacterBadge";
import { POINTS } from "../../shared/constants";
import { PointsBadge } from "../Character/PointsBadge";
import { PointsBadgeLarge } from "../Character/PointsBadgeLarge";

export const PlayerCard = ({ name, episode, characters, characterDeathChoices, betChoices, pointsThisEpisode, correctBetsThisEpisode, correctDeathsThisEpisode, diedInDifferentEpisodeThisEpisode, correctDiedSometimeThisEpisode }) => {

  let characterItems;
  if (characterDeathChoices.length !== 0) {
    characterItems = characterDeathChoices.map(choice => {

      const isDeathCorrect = correctDeathsThisEpisode.some(correctDeath => correctDeath.character === choice.id);

      return (
        <CharacterStyle key={choice.id} result={isDeathCorrect ? `correct` : `incorrect`}>
          <CharacterBadge name={choice.name} id={choice.id} points={choice.pointsPerEpisode[episode]} />
        </CharacterStyle>
      )
    });
  }

  let diedInDifferentEpisodeItems;
  if (diedInDifferentEpisodeThisEpisode.length !== 0) {
    diedInDifferentEpisodeItems = diedInDifferentEpisodeThisEpisode.map(died => {

      const deadCharacter = characters.find(character => character.id === died.id);

      return (
        <CharacterStyle key={deadCharacter.id}>
          <CharacterBadge size="small" name={deadCharacter.name} id={deadCharacter.id} points={POINTS.DIED_DIFFERENT_EPISODE_VALUE.toString()} />
        </CharacterStyle>
      )
    })
  }

  let diedSometimeItems;
  if (correctDiedSometimeThisEpisode.length !== 0) {
    diedSometimeItems = correctDiedSometimeThisEpisode.map(died => {

      const deadCharacter = characters.find(character => character.id === died.id);

      return (
        <CharacterStyle key={deadCharacter.id}>
          <CharacterBadge size="small" name={deadCharacter.name} id={deadCharacter.id} points={POINTS.DIED_SOMETIME_VALUE.toString()} />
        </CharacterStyle>
      )
    })
  }

  let betItems;
  if (betChoices.length !== 0) {
    betItems = betChoices.map(bet => {

      const isBetCorrect = correctBetsThisEpisode.some(correctBet => correctBet.bet === bet.id);

      return (
        <BetStyle key={bet.id} result={isBetCorrect ? `correct` : `incorrect`}>
          <PointsBadge margin="auto" marginLeft="0" marginRight points="1" />
          <span>{bet.description}</span>
        </BetStyle>
      );
    });
  }

  return (
    <CardStyle grid>
      <h2>{name}</h2> <PointsBadgeLarge topRight points={pointsThisEpisode} />

      <ListLabel>Expert Level Predictions</ListLabel>
      <CharactersStyle>
        {characterItems}
      </CharactersStyle>
      {characterDeathChoices.length === 0 && <NoPredictions>No deaths predicted for this episode.</NoPredictions>}

      {diedInDifferentEpisodeThisEpisode.length !== 0 && <>
        <ListLabel>Right Death, Wrong Episode</ListLabel>
        <CharactersStyle>
          {diedInDifferentEpisodeItems}
        </CharactersStyle>
      </>}

      {correctDiedSometimeThisEpisode.length !== 0 && <>
        <ListLabel>Died (Sometime in Series)</ListLabel>
        <CharactersStyle>
          {diedSometimeItems}
        </CharactersStyle>
      </>}

      <ListLabel>Plot Predictions</ListLabel>
      <BetsStyle>
        {betItems}
      </BetsStyle>
      {betChoices.length === 0 && <NoPredictions>No plot predictions for this episode.</NoPredictions>}

    </CardStyle>
  );
};
