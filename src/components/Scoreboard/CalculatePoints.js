import { ScoreService } from "./ScoreService";


export const calculatePoints = (episodeResults, characters, bets, episodes, entries) => {

  const scoreService = new ScoreService();

  const seriesFinished = episodeResults.length === 6;
  let allActualCharacterSurviversPoints;
  let actualThronePoints;
  let allSurvivers;
  let actualThroneCharacter;
  let betsNeverOccurred;
  let betsNeverOccurredPoints;
  let betsNeverOccurChoices;

  const deadCharacters = scoreService.getDeadCharacters(episodeResults);
  const betsAlreadyOccurred = scoreService.getBetsAlreadyOccurred(episodeResults);
  const betsStillPossible = scoreService.getBetsStillPossible(betsAlreadyOccurred, bets);

  if (seriesFinished) {
    allSurvivers = scoreService.getAllActualCharacterSurvivers(characters, deadCharacters);
    allActualCharacterSurviversPoints = scoreService.getAllActualCharacterSurviversPoints(allSurvivers);
    actualThronePoints = scoreService.getActualThronePoints(episodeResults, characters);
    actualThroneCharacter = episodeResults[5].throne;
    betsNeverOccurred = scoreService.getBetsNeverOccurred(episodeResults, bets);
  }

  const possiblePointsPerEpisode = episodes.map(episode => {

    let possiblePoints = `--`;

    if (episodeResults[episode - 1]) {
      const deaths = episodeResults[episode - 1].deaths;

      let points = [];
      if (deaths.length !== 0) {
        points = deaths.map(death => {
          const result = characters.find(item => item.id === death.id);
          return result.pointsPerEpisode[episode];
        });
      }

      const actualBetsThisEpisode = scoreService.getActualBetsThisEpisode(episode, episodeResults);
      const actualBetPoints = scoreService.getCorrectBetPoints(actualBetsThisEpisode);

      possiblePoints = points.reduce(scoreService.sumPoints, 0);
      possiblePoints += actualBetPoints;

      if (episode === "6") {
        const actualBetNeverOccurredPoints = scoreService.getPossibleBetsNeverOccurredPoints(betsNeverOccurred);
        possiblePoints += actualBetNeverOccurredPoints;
      }
    }

    return possiblePoints;
  });

  let players = entries.map(entry => {

    const playerDeathChoices = entry.characterDeathChoices;
    const playerBetChoices = entry.betChoices;
    const throneChoice = entry.throneChoice;

    let survivingCharacterPoints = 0;
    let throneChoicePoints = 0;

    let actualCharacterSurvivers;
    let incorrectCharacterSurvivers;
    const playerSurviverChoices = scoreService.getCharacterSurviverChoices(playerDeathChoices);
    const playerDieSometimeChoices = scoreService.getDieSometimeChoices(playerDeathChoices);

    betsNeverOccurChoices = scoreService.getBetsNeverOccurChoices(playerBetChoices);
    betsNeverOccurChoices = scoreService.getBetsNeverOccurChoicesWithData(betsNeverOccurChoices, bets);

    let correctBetsNeverOccurred;

    const playerBetsStillPossible = scoreService.getPlayerBetsStillPossible(betsStillPossible, playerBetChoices, episodeResults);
    const playerBetsStillPossiblePoints = scoreService.getCorrectBetPoints(playerBetsStillPossible);

    const playerDeathsStillPossible = scoreService.getPlayerDeathsStillPossible(deadCharacters, playerDeathChoices, episodeResults);
    const playerSurvivorsStillPossible = scoreService.getPlayerSurvivorsStillPossible(deadCharacters, playerDeathChoices, episodeResults);

    const playerSurvivorsStillPossiblePoints = scoreService.getPlayerDeathsStillPossiblePoints(playerSurvivorsStillPossible, characters);

    const playerDeathsStillPossiblePoints = scoreService.getPlayerDeathsStillPossiblePoints(playerDeathsStillPossible, characters);

    const playerPossibleThronePoints = scoreService.getPlayerPossibleThronePoints(deadCharacters, throneChoice, characters);

    let totalPossibleRemainingPoints = [
      playerDeathsStillPossiblePoints,
      playerBetsStillPossiblePoints,
      playerSurvivorsStillPossiblePoints,
      playerPossibleThronePoints
    ];

    totalPossibleRemainingPoints = totalPossibleRemainingPoints.reduce(scoreService.sumPoints, 0);

    const playerPossiblePoints = {
      playerDeathsStillPossiblePoints,
      playerBetsStillPossiblePoints,
      playerSurvivorsStillPossiblePoints,
      playerPossibleThronePoints,
      totalPossibleRemainingPoints
    }

    incorrectCharacterSurvivers = scoreService.getIncorrectCharacterSurvivers(playerSurviverChoices, deadCharacters);

    if (seriesFinished) {
      actualCharacterSurvivers = scoreService.getActualCharacterSurvivers(playerSurviverChoices, deadCharacters);
      survivingCharacterPoints = scoreService.getSurvivingCharacterPoints(actualCharacterSurvivers, characters);

      const throneChoiceCorrect = scoreService.checkIfThroneChoiceCorrect(episodeResults, throneChoice);
      if (throneChoiceCorrect) {
        throneChoicePoints = scoreService.getThroneChoicePoints(throneChoice, characters);
      }

      correctBetsNeverOccurred = scoreService.getCorrectBetsNeverOccurred(betsNeverOccurChoices, betsNeverOccurred);
      betsNeverOccurredPoints = scoreService.getBetsNeverOccurredPoints(correctBetsNeverOccurred);
    }

    let overallTotal = 0;
    let overallTotals = [];
    let lastWeekOverallTotal = 0;
    let lastWeekOverallTotals = [];

    const correctDeathsPerEpisode = [];
    const correctBetsPerEpisode = [];
    const diedInDifferentEpisodePerEpisode = [];
    const correctDiedSometimePerEpisode = [];

    const pointsPerEpisode = episodes.map(episode => {

      const deathChoicesByEpisode = scoreService.getDeathChoicesByEpisode(playerDeathChoices, episode);

      const betChoicesByEpisode = scoreService.getBetChoicesByEpisode(playerBetChoices, episode);

      const actualBetsThisEpisode = scoreService.getActualBetsThisEpisode(episode, episodeResults);

      const correctBets = scoreService.getCorrectBetsByEpisode(actualBetsThisEpisode, betChoicesByEpisode);
      correctBetsPerEpisode.push(correctBets);

      const correctBetPoints = scoreService.getCorrectBetPoints(correctBets);

      const actualDeathsThisEpisode = scoreService.getActualDeathsThisEpisode(episode, episodeResults);

      const correctDeaths = scoreService.getCorrectDeathsByEpisode(actualDeathsThisEpisode, deathChoicesByEpisode);
      correctDeathsPerEpisode.push(correctDeaths);

      const episodeExactDeathPoints = scoreService.getEpisodeExactDeathPoints(correctDeaths, characters, episode);

      const correctDiedSometime = scoreService.getCorrectDiedSometime(actualDeathsThisEpisode, playerDeathChoices);
      correctDiedSometimePerEpisode.push(correctDiedSometime);

      const correctDiedSometimePoints = scoreService.getCorrectDiedSometimePoints(correctDiedSometime);

      const diedInDifferentEpisode = scoreService.getDiedInDifferentEpisode(actualDeathsThisEpisode, playerDeathChoices, episode);
      diedInDifferentEpisodePerEpisode.push(diedInDifferentEpisode);

      const diedInDifferentEpisodePoints = scoreService.getDiedInDifferentEpisodePoints(diedInDifferentEpisode);

      let episodePointsTotal = `--`;

      if (episodeResults[episode - 1]) {
        episodePointsTotal = scoreService.getEpisodePointsTotal(episodeExactDeathPoints, correctDiedSometimePoints, diedInDifferentEpisodePoints, correctBetPoints);
        if (episode === "6") {
          episodePointsTotal += betsNeverOccurredPoints;
        }

        if (parseInt(episode, 10) < episodeResults.length) {
          lastWeekOverallTotals.push(episodePointsTotal);
        }

        overallTotals.push(episodePointsTotal);
      }

      return episodePointsTotal;

    });

    if (seriesFinished) {
      overallTotals.push(survivingCharacterPoints);
      overallTotals.push(throneChoicePoints);
    }

    overallTotal = overallTotals.reduce(scoreService.sumPoints, 0);
    lastWeekOverallTotal = lastWeekOverallTotals.reduce(scoreService.sumPoints, 0);

    return {
      ...entry,
      pointsPerEpisode,
      correctDeathsPerEpisode,
      correctBetsPerEpisode,
      playerDieSometimeChoices,
      correctDiedSometimePerEpisode,
      diedInDifferentEpisodePerEpisode,
      actualCharacterSurvivers,
      incorrectCharacterSurvivers,
      survivingCharacterPoints,
      throneChoicePoints,
      overallTotal,
      lastWeekOverallTotal,
      userId: entry.userId,
      playerSurviverChoices,
      betsNeverOccurChoices,
      correctBetsNeverOccurred,
      playerPossiblePoints
    }

  });


  let currentRank;
  let currentHighScore;

  const getRank = (totalKey, rankKey, rankDisplayKey, playerResults, index) => {

    if (index === 0) {
      currentRank = 0;
      currentHighScore = 0;
    }

    if (currentRank === 0) {
      currentRank++;
      playerResults[rankKey] = currentRank;
      playerResults[rankDisplayKey] = currentRank;
      currentHighScore = playerResults[totalKey];
      return playerResults;
    } else if (playerResults[totalKey] === currentHighScore) {
      playerResults[rankKey] = currentRank;
      playerResults[rankDisplayKey] = `T - ${currentRank}`;
      players[index - 1][rankKey] = currentRank;
      players[index - 1][rankDisplayKey] = `T - ${currentRank}`;
      return playerResults;
    } else {
      currentRank++;
      playerResults[rankKey] = currentRank;
      playerResults[rankDisplayKey] = currentRank;
      currentHighScore = playerResults[totalKey];
      return playerResults;
    }
  }

  const getRanksLastWeek = () => {

    players.sort((a, b) => a.lastWeekOverallTotal > b.lastWeekOverallTotal ? -1 : 1);

    return players.map((result, index) => {
      return getRank(`lastWeekOverallTotal`, `rankLastWeek`, `rankLastWeekDisplay`, result, index);
    });
  }

  getRanksLastWeek();

  const getRanksOverall = () => {

    players.sort((a, b) => a.overallTotal > b.overallTotal ? -1 : 1);

    return players.map((result, index) => {
      return getRank(`overallTotal`, `rank`, `rankDisplay`, result, index);
    });
  }

  const rankedPlayers = getRanksOverall();

  players = rankedPlayers;
  const leaderPoints = players[0].overallTotal;

  return {
    players,
    seriesFinished,
    allSurvivers,
    allActualCharacterSurviversPoints,
    deadCharacters,
    possiblePointsPerEpisode,
    actualThroneCharacter,
    actualThronePoints,
    leaderPoints
  };
}

