import React from "react";
import { CharacterBadge } from "../Character/CharacterBadge";
import { PointsBadgeLarge } from "../Character/PointsBadgeLarge";
import { CardStyle, CharactersStyle, CharacterStyle, ListLabel, NoPredictions } from "../Player/Card";
import { POINTS } from "../../shared/constants";
import { MaxPoints } from "./MaxPoints";

export const PlayerCardSurvivers = ({ name, seriesFinished, survivingCharacterPoints, actualCharacterSurvivers, incorrectCharacterSurvivers, playerSurviverChoices, playerDieSometimeChoices, characters, allActualCharacterSurviversPoints, deadCharacters }) => {
  
  const surviverChoices = playerSurviverChoices.map(surviverChoice => {

    const survivingCharacter = characters.find(character => character.id === surviverChoice);
    
    let surviverResult = `undetermined`;
    const incorrectSurviverChoice = incorrectCharacterSurvivers.find(deadCharacter => deadCharacter === surviverChoice);
    if (incorrectSurviverChoice) {
      surviverResult = `incorrect`;
    }

    return (
      <CharacterStyle result={surviverResult} key={survivingCharacter.id}>
        <CharacterBadge size="small" name={survivingCharacter.name} id={survivingCharacter.id} points={survivingCharacter.pointsPerEpisode[0]} />
      </CharacterStyle>
    )
  });

  const dieSometimeCharacters = playerDieSometimeChoices.map(dieSometime => {

    const sometimeDeath = characters.find(character => character.id === dieSometime);

    const correctSometimeDeath = deadCharacters.find(deadCharacter => deadCharacter.id === dieSometime);

    let dieSometimeResult = `incorrect`;
    if (correctSometimeDeath) {
      dieSometimeResult = `correct`;
    }

    return (
      <CharacterStyle result={dieSometimeResult} key={sometimeDeath.id}>
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

  const maxPoints = <MaxPoints points={survivingCharacterPoints} possiblePoints={allActualCharacterSurviversPoints} />;

  return (
    <CardStyle grid>
      <h2>{name}</h2> <PointsBadgeLarge maxPoints={maxPoints} topRight points={seriesFinished ? survivingCharacterPoints : `--`} />

      {!seriesFinished && <>
        <ListLabel>Survivor Choices</ListLabel>
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