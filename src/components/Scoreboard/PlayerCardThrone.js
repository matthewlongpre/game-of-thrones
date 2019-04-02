import React from "react";
import { CharacterStyle, CardStyle, ListLabel, CharactersStyle } from "../Player/Card";
import { CharacterBadge } from "../Character/CharacterBadge";
import { PointsBadgeLarge } from "../Character/PointsBadgeLarge";
import { POINTS } from "../../shared/constants";
import { PointsBadge } from "../Character/PointsBadge";

export const PlayerCardThrone = ({ name, throneChoice, seriesFinished, characters, throneChoicePoints }) => {

  let throneChoiceCharacter;

  if (throneChoice === "nobodyInList") {
    throneChoiceCharacter = <div style={{marginTop: `40px`}}><PointsBadge marginRight points={POINTS.THRONE_NOBODY_LIST} /><strong>Nobody in the list</strong></div>;
  } else if (throneChoice === "nobodyAtAll") {
    throneChoiceCharacter = <div style={{marginTop: `40px`}}><PointsBadge marginRight points={POINTS.THRONE_NOBODY_ALL} /><strong>Nobody at all</strong></div>;
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