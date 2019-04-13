import React from "react";
import { CharacterBadge } from "../Character/CharacterBadge";
import { CharactersStyle, CharacterStyle, ListLabel } from "../Player/Card";
import { PlayerCardThrone } from "./PlayerCardThrone";
import { PageContainerStyled, PageHeadingRow, EpisodeResultsRow, EpisodeRowStyled } from "./Styles";

export const Throne = ({ episode, seriesFinished, entries, characters, players, actualThroneCharacter, filters }) => {

  let throneHasCharacter = true;
  if (actualThroneCharacter === "nobodyInList" || actualThroneCharacter === "nobodyAtAll") {
    throneHasCharacter = false;
  }

  let throneResultNonCharacter;
  if (actualThroneCharacter === "nobodyInList") {
    throneResultNonCharacter = "Nobody in the list";
  } else if (actualThroneCharacter === "nobodyAtAll") {
    throneResultNonCharacter = "Nobody at all";
  }

  let throneCharacterData;
  if (throneHasCharacter) {
    throneCharacterData = characters.find(character => character.id === actualThroneCharacter);
  }

  const playerCards = entries.map(entry => {

    const playerPoints = players.find(player => player.userId === entry.userId);

    return (
      <PlayerCardThrone key={entry.userId} {...entry} actualThroneCharacter={actualThroneCharacter} {...playerPoints} seriesFinished={seriesFinished} characters={characters} />
    );
  });

  playerCards.sort((a, b) => a.props.throneChoicePoints > b.props.throneChoicePoints ? -1 : 1);

  return (
    <PageContainerStyled>

      {filters}

      <PageHeadingRow>
        <h2>The Throne</h2>
      </PageHeadingRow>


      {seriesFinished && <EpisodeResultsRow>
        <ListLabel>Sitting the Iron Throne</ListLabel>
        <CharactersStyle className="player-character-list">
          {throneHasCharacter && <CharacterStyle key={throneCharacterData.id}>
            <CharacterBadge name={throneCharacterData.name} id={throneCharacterData.id} points={throneCharacterData.pointsForThrone.toString()} />
          </CharacterStyle>
          }
          {!throneHasCharacter && <div style={{ marginBottom: `40px` }}><strong>{throneResultNonCharacter}</strong> is sitting the Iron Throne.</div>}


        </CharactersStyle>
      </EpisodeResultsRow>}

      <EpisodeRowStyled>
        {playerCards}
      </EpisodeRowStyled>

    </PageContainerStyled>
  );
};