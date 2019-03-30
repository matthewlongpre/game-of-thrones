import React from "react";
import { episodes } from "../../shared/constants";
import { EpisodeCard } from "./EpisodeCard";
import { EpisodeTabs } from "./EpisodeTabs";

export const ScoresByEpisode = props => {
  const { entries, characters, bets, players, deadCharactersForDisplay, episodeResults } = props;

  const episodeCards = episodes.map(episode => {
    return (
      <EpisodeCard key={episode} entries={entries} episode={episode} episodeResults={episodeResults} players={players} characters={characters} bets={bets} deadCharactersForDisplay={deadCharactersForDisplay[episode - 1]} />
    );
  });
  return (
    <EpisodeTabs episodeCards={episodeCards} />
  )
}