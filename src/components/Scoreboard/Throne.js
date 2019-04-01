import React from "react";
import styled from "styled-components";
import { CharacterBadge } from "../Character/CharacterBadge";
import { CharactersStyle, CharacterStyle, ListLabel } from "../Player/Card";
import { PlayerCardThrone } from "./PlayerCardThrone";
import { PageContainerStyled, PageHeadingRow } from "./Styles";

const EpisodeRowStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: -10px;
`;

const EpisodeResultsRow = styled.div`
  h3 {
    text-align: center;
  }

  ul {
    justify-content: center;
  }
`;

export const Throne = ({ episode, seriesFinished, entries, characters, players, actualThroneCharacter }) => {

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
      <PlayerCardThrone key={entry.userId} {...entry} {...playerPoints} seriesFinished={seriesFinished} characters={characters} />
    );
  });

  return (
    <PageContainerStyled>

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
          {!throneHasCharacter && <div style={{ marginBottom: `40px` }}><strong>{throneResultNonCharacter}</strong> is sitting on the Iron Throne.</div>}


        </CharactersStyle>
      </EpisodeResultsRow>}

      <EpisodeRowStyled>
        {playerCards}
      </EpisodeRowStyled>

    </PageContainerStyled>
  );
};