import React from "react";
import { CharacterBadge } from "../Character/CharacterBadge";
import { PointsBadgeLarge } from "../Character/PointsBadgeLarge";
import { CardStyle, CharactersStyle, CharacterStyle, ListLabel, NoPredictions } from "../Player/Card";
import { POINTS } from "../../shared/constants";

export const PlayerCardSurvivers = ({ name, seriesFinished, survivingCharacterPoints, actualCharacterSurvivers, incorrectCharacterSurvivers, playerSurviverChoices, playerDieSometimeChoices, characters }) => {
  
  const surviverChoices = playerSurviverChoices.map(surviver => {

    const survivingCharacter = characters.find(character => character.id === surviver);

    return (
      <CharacterStyle key={survivingCharacter.id}>
        <CharacterBadge size="small" name={survivingCharacter.name} id={survivingCharacter.id} points={survivingCharacter.pointsPerEpisode[0]} />
      </CharacterStyle>
    )
  });

  const dieSometimeCharacters = playerDieSometimeChoices.map(dieSometime => {

    const sometimeDeath = characters.find(character => character.id === dieSometime);

    return (
      <CharacterStyle key={sometimeDeath.id}>
        <CharacterBadge size="small" name={sometimeDeath.name} id={sometimeDeath.id} points={POINTS.DIED_SOMETIME_VALUE.toString()} />
      </CharacterStyle>
    )
  });


  let correctSurvivers;
  if (actualCharacterSurvivers && actualCharacterSurvivers.length !== 0) {
    correctSurvivers = actualCharacterSurvivers.map(survived => {

      const survivingCharacter = characters.find(character => character.id === survived);

      return (
        <CharacterStyle result="correct" key={survivingCharacter.id}>
          <CharacterBadge hidePoints size="small" name={survivingCharacter.name} id={survivingCharacter.id} points={survivingCharacter.pointsPerEpisode[0]} />
        </CharacterStyle>
      )
    })
  }

  let incorrectSurvivers;
  if (incorrectCharacterSurvivers && incorrectCharacterSurvivers.length !== 0) {
    incorrectSurvivers = incorrectCharacterSurvivers.map(died => {

      const deadCharacter = characters.find(character => character.id === died);

      return (
        <CharacterStyle result="incorrect" key={deadCharacter.id}>
          <CharacterBadge hidePoints size="small" name={deadCharacter.name} id={deadCharacter.id} points={deadCharacter.pointsPerEpisode[0]} />
        </CharacterStyle>
      )
    })
  }

  return (
    <CardStyle grid>
      <h2>{name}</h2> <PointsBadgeLarge topRight points={seriesFinished ? survivingCharacterPoints : `--`} />

      {!seriesFinished && <>
        <ListLabel>Surviver Choices</ListLabel>
        <CharactersStyle>
          {surviverChoices}
        </CharactersStyle>

        <ListLabel>Die Sometime Choices</ListLabel>
        <CharactersStyle>
          {dieSometimeCharacters}
        </CharactersStyle>
      </>}

      {seriesFinished && <><ListLabel>Survived</ListLabel>
        <CharactersStyle>
          {correctSurvivers}
        </CharactersStyle>
        {actualCharacterSurvivers.length === 0 && <NoPredictions>No surviver predictions were correct.</NoPredictions>}

        <ListLabel>Did not survive</ListLabel>
        <CharactersStyle>
          {incorrectSurvivers}
        </CharactersStyle>
        {incorrectCharacterSurvivers.length === 0 && <NoPredictions>All surviver predictions were correct.</NoPredictions>}
      </>}

    </CardStyle>
  );
}