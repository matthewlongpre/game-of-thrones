import React from "react";
import styled from "styled-components";
import { episodes } from "../../shared/constants";
import { CharacterStyle, ListLabel, CharactersStyle, NoPredictions } from "../Player/Card";
import { CharacterBadge } from "../Character/CharacterBadge";
import { PlayerCard } from "./PlayerCard";
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

const getChoicesByEpisode = choices => {
  return episodes.map(episode => {
    const episodeChoices = [];
    for (const key in choices) {
      if (choices[key] === episode) {
        episodeChoices.push(key);
      }
    }
    return episodeChoices;
  });
}

const getDataByEpisode = (choicesByEpisode, characters) => {
  return choicesByEpisode.map(choice => {
    return choice.map(item => characters.find(character => character.id === item));
  });
}

export const EpisodeCard = ({ episode, entries, characters, bets, deadCharactersForDisplay, players }) => {

  let deadCharacterItems;
  if (deadCharactersForDisplay.length !== 0) {
    deadCharacterItems = deadCharactersForDisplay.map(choice => (
      <CharacterStyle key={choice.id}>
        <CharacterBadge name={choice.name} id={choice.id} points={choice.pointsPerEpisode[episode]} />
      </CharacterStyle>
    ));
  }

  const playerCards = entries.map(entry => {

    const characterDeathChoices = entry.characterDeathChoices;
    const characterChoicesByEpisode = getChoicesByEpisode(characterDeathChoices);
    const charactersByEpisode = getDataByEpisode(characterChoicesByEpisode, characters);

    const betChoices = entry.betChoices;
    const betChoicesByEpisode = getChoicesByEpisode(betChoices);
    const betsByEpisode = getDataByEpisode(betChoicesByEpisode, bets);

    const playerPoints = players.find(player => player.userId === entry.userId);
    const playerPointsThisEpisode = playerPoints.pointsPerEpisode[episode - 1];
    const playerCorrectDeathsThisEpisode = playerPoints.correctDeathsPerEpisode[episode - 1];
    const playerCorrectBetsThisEpisode = playerPoints.correctBetsPerEpisode[episode - 1];

    const playerDiedInDifferentEpisodePerEpisode = playerPoints.diedInDifferentEpisodePerEpisode[episode - 1];
    const playerCorrectDiedSometimePerEpisode = playerPoints.correctDiedSometimePerEpisode[episode - 1];

    return (
      <PlayerCard key={entry.userId} {...entry} episode={episode} pointsThisEpisode={playerPointsThisEpisode} correctBetsThisEpisode={playerCorrectBetsThisEpisode} diedInDifferentEpisodeThisEpisode={playerDiedInDifferentEpisodePerEpisode} correctDiedSometimeThisEpisode={playerCorrectDiedSometimePerEpisode} correctDeathsThisEpisode={playerCorrectDeathsThisEpisode} characters={characters} characterDeathChoices={charactersByEpisode[episode - 1]} betChoices={betsByEpisode[episode - 1]} />
    );
  });

  return (
    <PageContainerStyled>

      <PageHeadingRow>
        <h2>Episode {episode}</h2>
      </PageHeadingRow>

      <EpisodeResultsRow>
        <ListLabel>Confirmed dead</ListLabel>
        <CharactersStyle className="player-character-list">
          {deadCharacterItems}
        </CharactersStyle>
        {deadCharactersForDisplay.length === 0 && <NoPredictions>No deaths this episode.</NoPredictions>}
      </EpisodeResultsRow>

      <EpisodeRowStyled>
        {playerCards}
      </EpisodeRowStyled>

    </PageContainerStyled>
  );
};