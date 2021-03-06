import React from "react";
import { CharacterBadge } from "../Character/CharacterBadge";
import { CharactersStyle, CharacterStyle, ListLabel, NoPredictions } from "../Player/Card";
import { PlayerCardSurvivers } from "./PlayerCardSurvivers";
import { EpisodeResultsRow, PageContainerStyled, PageHeadingRow, EpisodeRowStyled, StickyControls } from "./Styles";

export const Survivers = ({ episode, seriesFinished, episodeResults, deadCharacters, dieSometimeChoices, entries, characters, bets, allSurvivers, players, filters, allActualCharacterSurviversPoints }) => {

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
      <PlayerCardSurvivers key={entry.userId} {...entry} {...playerPoints} dieSometimeChoices={dieSometimeChoices} episode={episode} seriesFinished={seriesFinished} characters={characters} allActualCharacterSurviversPoints={allActualCharacterSurviversPoints} deadCharacters={deadCharacters} />
    );
  });

  playerCards.sort((a, b) => a.props.survivingCharacterPoints > b.props.survivingCharacterPoints ? -1 : 1);

  return (
    <>
      <StickyControls style={{
        top: `48px`,
        zIndex: `4`,
      }}>

        {filters}

      </StickyControls>

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
    </>
  );
};