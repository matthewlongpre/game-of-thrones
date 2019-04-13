import React from "react";
import { episodes } from "../../shared/constants";
import { CharacterBadge } from "../Character/CharacterBadge";
import { CharactersStyle, CharacterStyle, ListLabel, NoPredictions } from "../Player/Card";
import { PlayerCard } from "./PlayerCard";
import { PageContainerStyled, PageHeadingRow, EpisodeResultsRow, EpisodeRowStyled } from "./Styles";

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

export const EpisodeCard = ({ episode, episodeResults, entries, characters, bets, deadCharactersForDisplay, players, filters }) => {

  let deadCharacterItems;
  if (deadCharactersForDisplay && deadCharactersForDisplay.length !== 0) {
    deadCharacterItems = deadCharactersForDisplay.map(choice => (
      <CharacterStyle key={choice.id}>
        <CharacterBadge name={choice.name} id={choice.id} points={choice.pointsPerEpisode[episode]} />
      </CharacterStyle>
    ));
  }

  const episodeHasResults = episodeResults[episode - 1];

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

    const playerBetsNeverOccurChoices = playerPoints.betsNeverOccurChoices;
    const playerCorrectBetsNeverOccurred = playerPoints.correctBetsNeverOccurred;
    const playerDiedInDifferentEpisodePerEpisode = playerPoints.diedInDifferentEpisodePerEpisode[episode - 1];
    const playerCorrectDiedSometimePerEpisode = playerPoints.correctDiedSometimePerEpisode[episode - 1];

    return (
      <PlayerCard key={entry.userId} {...entry} correctBetsNeverOccurred={playerCorrectBetsNeverOccurred} betsNeverOccurChoices={playerBetsNeverOccurChoices} episode={episode} episodeHasResults={episodeHasResults} pointsThisEpisode={playerPointsThisEpisode} correctBetsThisEpisode={playerCorrectBetsThisEpisode} diedInDifferentEpisodeThisEpisode={playerDiedInDifferentEpisodePerEpisode} correctDiedSometimeThisEpisode={playerCorrectDiedSometimePerEpisode} correctDeathsThisEpisode={playerCorrectDeathsThisEpisode} characters={characters} characterDeathChoices={charactersByEpisode[episode - 1]} betChoices={betsByEpisode[episode - 1]} />
    );
  });

  return (
    <PageContainerStyled>

      <PageHeadingRow>
        <h2>Episode {episode}</h2>
      </PageHeadingRow>

      {filters}

      {episodeHasResults && <EpisodeResultsRow>
        <ListLabel>Confirmed dead</ListLabel>
        <CharactersStyle className="player-character-list">
          {deadCharacterItems}
        </CharactersStyle>
        {deadCharactersForDisplay.length === 0 && <NoPredictions>No deaths this episode.</NoPredictions>}
      </EpisodeResultsRow>}

      <EpisodeRowStyled>
        {playerCards}
      </EpisodeRowStyled>

    </PageContainerStyled>
  );
};