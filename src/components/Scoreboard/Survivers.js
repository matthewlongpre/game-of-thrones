import React from "react";
import styled from "styled-components";
import { CharacterBadge } from "../Character/CharacterBadge";
import { CharactersStyle, CharacterStyle, ListLabel, NoPredictions } from "../Player/Card";
import { PlayerCardSurvivers } from "./PlayerCardSurvivers";
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

export const Survivers = ({ episode, seriesFinished, episodeResults, dieSometimeChoices, entries, characters, bets, allSurvivers, players }) => {

  let aliveCharacterItems;
  if (allSurvivers && allSurvivers.length !== 0) {
    aliveCharacterItems = allSurvivers.map(character => (
      <CharacterStyle key={character.id}>
        <CharacterBadge name={character.name} id={character.id} points={character.pointsPerEpisode[0]} />
      </CharacterStyle>
    )); 
  }

  const playerCards = entries.map(entry => {

    const playerPoints = players.find(player => player.userId === entry.userId);

    return (
      <PlayerCardSurvivers key={entry.userId} {...entry} {...playerPoints} dieSometimeChoices={dieSometimeChoices} episode={episode} seriesFinished={seriesFinished} characters={characters} />
    );
  });

  return (
    <PageContainerStyled>

      <PageHeadingRow>
        <h2>Survivors</h2>
      </PageHeadingRow>

      {seriesFinished && <EpisodeResultsRow>
        <ListLabel>Confirmed alive</ListLabel>
        <CharactersStyle className="player-character-list">
          {aliveCharacterItems}
        </CharactersStyle>
        {allSurvivers.length === 0 && <NoPredictions>No deaths this episode.</NoPredictions>}
      </EpisodeResultsRow>}

      <EpisodeRowStyled>
        {playerCards}
      </EpisodeRowStyled>

    </PageContainerStyled>
  );
};