import React from "react";
import { CharacterStyle, CardStyle, ListLabel, CharactersStyle, BetStyle, NoPredictions, BetsStyle } from "../Player/Card";
import { CharacterBadge } from "../Character/CharacterBadge";
import { POINTS } from "../../shared/constants";
import { PointsBadge } from "../Character/PointsBadge";
import { PointsBadgeLarge } from "../Character/PointsBadgeLarge";
import { MaxPoints } from "./MaxPoints";

export const PlayerCard = ({ name, episode, episodeHasResults, characters, characterDeathChoices, betChoices, pointsThisEpisode, correctBetsThisEpisode, correctDeathsThisEpisode, diedInDifferentEpisodeThisEpisode, correctDiedSometimeThisEpisode, betsNeverOccurChoices, correctBetsNeverOccurred, possiblePointsThisEpisode }) => {

  let characterItems;
  if (characterDeathChoices.length !== 0) {
    characterItems = characterDeathChoices.map(choice => {

      let deathResults = `undetermined`;
      if (episodeHasResults) {
        const isDeathCorrect = correctDeathsThisEpisode.some(correctDeath => correctDeath.character === choice.id);
        deathResults = isDeathCorrect ? `correct` : `incorrect`
      }

      return (
        <CharacterStyle key={choice.id} result={deathResults}>
          <CharacterBadge result={deathResults} name={choice.name} id={choice.id} points={choice.pointsPerEpisode[episode]} />
        </CharacterStyle>
      )
    });
  }

  let diedInDifferentEpisodeItems;
  if (diedInDifferentEpisodeThisEpisode.length !== 0) {
    diedInDifferentEpisodeItems = diedInDifferentEpisodeThisEpisode.map(died => {

      const deadCharacter = characters.find(character => character.id === died.id);

      return (
        <CharacterStyle key={deadCharacter.id} result="correct">
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

      let betResults = `undetermined`;
      if (episodeHasResults) {
        const isBetCorrect = correctBetsThisEpisode.some(correctBet => correctBet.bet === bet.id);
        betResults = isBetCorrect ? `correct` : `incorrect`
      }

      return (
        <BetStyle key={bet.id} result={betResults}>
          <PointsBadge margin="auto" marginLeft="0" marginRight points="1" />
          <span>{bet.description}</span>
        </BetStyle>
      );
    });
  }

  let neverOccurred;
  if (betsNeverOccurChoices.length !== 0) {

    neverOccurred = betsNeverOccurChoices.map(bet => {

      let betResults = `undetermined`;
      if (episodeHasResults && episode === "6") {
        const isBetCorrect = correctBetsNeverOccurred.some(correctBet => correctBet.id === bet.id);
        betResults = isBetCorrect ? `correct` : `incorrect`
      }

      return (
        <BetStyle key={bet.id} result={betResults}>
          <PointsBadge margin="auto" marginLeft="0" marginRight points="1" />
          <span>{bet.description}</span>
        </BetStyle>
      );
    });
  }

  const maxPoints = <MaxPoints points={pointsThisEpisode} possiblePoints={possiblePointsThisEpisode} />

  return (
    <CardStyle grid>
      <h2>{name}</h2> <PointsBadgeLarge topRight points={pointsThisEpisode} maxPoints={maxPoints} />

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

      {(episode === "6" && betsNeverOccurChoices.length !== 0) && <>
        <ListLabel>
          {episodeHasResults ? `Never Occurred` : `Will Never Occur`}
        </ListLabel>
        <BetsStyle>
          {neverOccurred}
        </BetsStyle>
      </>}


    </CardStyle>
  );
};
