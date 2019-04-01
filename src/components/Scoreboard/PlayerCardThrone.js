import React from "react";
import { CharacterStyle, CardStyle, ListLabel, CharactersStyle } from "../Player/Card";
import { CharacterBadge } from "../Character/CharacterBadge";
import { PointsBadgeLarge } from "../Character/PointsBadgeLarge";

export const PlayerCardThrone = ({ name, throneChoice, seriesFinished, characters, throneChoicePoints }) => {

  let throneChoiceCharacter;

  if (throneChoice === "nobodyInList") {
    throneChoiceCharacter = "Nobody in the list";
  } else if (throneChoice === "nobodyAtAll") {
    throneChoiceCharacter = "Nobody at all";
  } else {
    const throneCharacterData = characters.find(character => character.id === throneChoice);
    throneChoiceCharacter = <CharacterStyle key={throneCharacterData.id}>
      <CharacterBadge name={throneCharacterData.name} id={throneCharacterData.id} points={throneCharacterData.pointsForThrone.toString()} />
    </CharacterStyle>
  }

  return (
      <CardStyle grid>
        <h2>{name}</h2> <PointsBadgeLarge topRight points={seriesFinished ? throneChoicePoints : `--`} />
  
        <ListLabel>Throne Choice</ListLabel>
        <CharactersStyle>
          {throneChoiceCharacter}
        </CharactersStyle>

      </CardStyle>
  )
}