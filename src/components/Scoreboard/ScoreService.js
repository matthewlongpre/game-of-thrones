import { POINTS } from "../../shared/constants";


const getBetChoicesByEpisode = (playerBetChoices, episode) => {
  const betChoicesByEpisode = [];
  for (const key in playerBetChoices) {
    if (playerBetChoices[key] === episode) {
      const item = {};
      item.bet = key;
      item.episode = playerBetChoices[key];
      betChoicesByEpisode.push(item);
    }
  }
  return betChoicesByEpisode;
}

const getActualBetsThisEpisode = (episode, episodeResults) => {
  let actualBetsThisEpisode = [];
  if (episodeResults[episode - 1]) {
    actualBetsThisEpisode = episodeResults[episode - 1].bets;
  }
  return actualBetsThisEpisode;
}

const getCorrectBetsByEpisode = (actualBetsThisEpisode, betChoicesByEpisode) => {
  let correctBets = [];
  if (actualBetsThisEpisode.length !== 0) {
    actualBetsThisEpisode.forEach(bet => {
      const correctBet = betChoicesByEpisode.find(choice => {
        return choice.bet === bet.id
      });
      if (correctBet) {
        correctBets.push(correctBet);
      }
    });
  }
  return correctBets;
}

const getCorrectBetPoints = correctBets => {
  const correctBetPoints = correctBets.map(() => POINTS.BONUS_PREDICTION_VALUE);
  return correctBetPoints.reduce(sumPoints, 0);
};

const getDeathChoicesByEpisode = (playerDeathChoices, episode) => {
  const deathChoicesByEpisode = [];
  for (const key in playerDeathChoices) {
    if (playerDeathChoices[key] === episode) {
      const item = {};
      item.character = key;
      item.episode = playerDeathChoices[key];
      deathChoicesByEpisode.push(item);
    }
  }
  return deathChoicesByEpisode;
}

const getActualDeathsThisEpisode = (episode, episodeResults) => {
  let actualDeathsThisEpisode = [];
  if (episodeResults[episode - 1]) {
    actualDeathsThisEpisode = episodeResults[episode - 1].deaths;
  }
  return actualDeathsThisEpisode;
}

const getCorrectDeathsByEpisode = (actualDeathsThisEpisode, deathChoicesByEpisode) => {
  let correctDeaths = [];
  if (actualDeathsThisEpisode.length !== 0) {
    actualDeathsThisEpisode.forEach(death => {
      const correctDeath = deathChoicesByEpisode.find(choice => {
        return choice.character === death.id
      });
      if (correctDeath) {
        correctDeath.points = death.points;
        correctDeaths.push(correctDeath);
      }
    });
  }
  return correctDeaths;
}

const getEpisodeExactDeathPoints = (correctDeaths, characters, episode) => {
  const episodeExactDeathPoints = correctDeaths.map(death => {
    const result = characters.find(item => item.id === death.character);
    return result.pointsPerEpisode[episode];
  });
  return episodeExactDeathPoints.reduce(sumPoints, 0);
}

const getDieSometimeChoices = (playerDeathChoices) => {
  const dieSometimeChoices = [];
  for (const key in playerDeathChoices) {
    if (playerDeathChoices[key] === "7") {
      dieSometimeChoices.push(key);
    }
  }
  return dieSometimeChoices;
}

const getCorrectDiedSometime = (actualDeathsThisEpisode, playerDeathChoices) => {
  const correctDiedSometime = [];
  actualDeathsThisEpisode.forEach(character => {
    for (const key in playerDeathChoices) {
      if (key === character.id) {
        if (playerDeathChoices[key] === "7") {
          correctDiedSometime.push(character);
        }
      }
    }
  });
  return correctDiedSometime;
}

const getCorrectDiedSometimePoints = correctDiedSometime => {
  const correctDiedSometimePoints = correctDiedSometime.map(() => POINTS.DIED_SOMETIME_VALUE)
  return correctDiedSometimePoints.reduce(sumPoints, 0);
};

const getDiedInDifferentEpisode = (actualDeathsThisEpisode, playerDeathChoices, episode) => {
  const diedInDifferentEpisode = [];
  actualDeathsThisEpisode.forEach(character => {
    for (const key in playerDeathChoices) {
      if (key === character.id) {
        if (playerDeathChoices[key] !== "7" && playerDeathChoices[key] !== "0" && playerDeathChoices[key] !== episode) {
          diedInDifferentEpisode.push(character);
        }
      }
    }
  });
  return diedInDifferentEpisode;
}

const getDiedInDifferentEpisodePoints = diedInDifferentEpisode => {
  const diedInDifferenceEpisodePoints = diedInDifferentEpisode.map(() => POINTS.DIED_DIFFERENT_EPISODE_VALUE);
  return diedInDifferenceEpisodePoints.reduce(sumPoints, 0);
}

const sumPoints = (total, current) => total + parseInt(current, 10);

const getEpisodePointsTotal = (episodeExactDeathPoints, correctDiedSometimePoints, diedInDifferentEpisodePoints, correctBetPoints) => {
  let episodePointsTotal = 0;
  episodePointsTotal = episodeExactDeathPoints;
  episodePointsTotal += correctDiedSometimePoints;
  episodePointsTotal += diedInDifferentEpisodePoints;
  episodePointsTotal += correctBetPoints;
  return episodePointsTotal;
}

const getDeadCharacters = (episodeResults) => {
  const deadCharacters = [];
  episodeResults.forEach(episode => {
    episode.deaths.forEach(deadCharacter => deadCharacters.push(deadCharacter));
  });
  return deadCharacters;
}

const getCharacterSurviverChoices = (playerDeathChoices) => {
  const characterSurviverChoices = [];
  for (const key in playerDeathChoices) {
    if (playerDeathChoices[key] === "0") {
      characterSurviverChoices.push(key);
    }
  }
  return characterSurviverChoices;
}

const getActualCharacterSurvivers = (playerSurviverChoices, deadCharacters) => {
  const survivers = playerSurviverChoices.filter(item => {
    return !deadCharacters.find(deadCharacter => deadCharacter.id === item);
  });
  return survivers;
}

const getIncorrectCharacterSurvivers = (playerSurviverChoices, deadCharacters) => {
  const incorrectSurvivers = playerSurviverChoices.filter(item => {
    return deadCharacters.find(deadCharacter => deadCharacter.id === item);
  });
  return incorrectSurvivers;
}

const getSurvivingCharacterPoints = (actualCharacterSurvivers, characters) => {
  const survivers = actualCharacterSurvivers.map(surviver => {
    const result = characters.find(character => character.id === surviver);
    return result;
  });
  const points = survivers.map(item => item.pointsPerEpisode[0]);
  return points.reduce(sumPoints, 0);
}

const getAllActualCharacterSurvivers = (characters, deadCharacters) => {
  const survivers = characters.filter(item => {
    return !deadCharacters.find(deadCharacter => deadCharacter.id === item.id);
  });
  return survivers;
}

const getAllActualCharacterSurviversPoints = (allSurvivers) => {
  const points = allSurvivers.map(item => item.pointsPerEpisode[0]);
  return points.reduce(sumPoints, 0);
}

const getThroneChoicePoints = (throneChoice, characters) => {
  let points;
  if (throneChoice === "nobodyAtAll") {
    return points = POINTS.THRONE_NOBODY_ALL;
  }
  if (throneChoice === "nobodyInList") {
    return points = POINTS.THRONE_NOBODY_LIST;
  }
  const throneCharacter = characters.find(character => character.id === throneChoice);
  points = throneCharacter.pointsForThrone;
  points = parseInt(points, 10);
  return points;
}

const checkIfThroneChoiceCorrect = (episodeResults, throneChoice) => {
  return episodeResults[5].throne === throneChoice;
}

const getActualThronePoints = (episodeResults, characters) => {
  return getThroneChoicePoints(episodeResults[5].throne, characters);
}

const getBetsNeverOccurred = (episodeResults, bets) => {
  const allBets = bets.map(bet => bet.id);
  const betsOccurred = [];
  episodeResults.forEach(episode => {
    if (episode.bets.length !== 0) {
      episode.bets.forEach(bet => {
        betsOccurred.push(bet.id);
      });
    }
  });
  const betsNeverOccurred = allBets.filter(item => {
    return !betsOccurred.includes(item);
  });
  return betsNeverOccurred;
}

const getBetsNeverOccurChoices = playerBetChoices => {
  const neverOccurChoices = [];
  for (const key in playerBetChoices) {
    if (playerBetChoices[key] === "0") {
      neverOccurChoices.push(key);
    }
  }
  return neverOccurChoices;
}

const getBetsNeverOccurChoicesWithData = (betsNeverOccurChoices, bets) => {
  const neverOcurredBetData = betsNeverOccurChoices.map(choice => {
    return bets.find(bet => bet.id === choice);
  });
  return neverOcurredBetData;
}

const getCorrectBetsNeverOccurred = (betsNeverOccurChoices, betsNeverOccurred) => {
  return betsNeverOccurChoices.filter(item => betsNeverOccurred.includes(item.id));
}

const getBetsNeverOccurredPoints = (correctBetsNeverOccurred) => {
  return getCorrectBetPoints(correctBetsNeverOccurred);
}

const getPossibleBetsNeverOccurredPoints = betsNeverOccurred => {
  return getCorrectBetPoints(betsNeverOccurred);
}

const getBetsAlreadyOccurred = (episodeResults) => {
  const betsAlreadyOccurred = [];
  episodeResults.forEach(episode => {
    episode.bets.forEach(bet => betsAlreadyOccurred.push(bet))
  });
  return betsAlreadyOccurred;
}

const getBetsStillPossible = (betsAlreadyOccurred, bets) => {
  betsAlreadyOccurred = betsAlreadyOccurred.map(bet => bet.id);
  return bets.filter(bet => !betsAlreadyOccurred.includes(bet.id))
}

const getPlayerBetsStillPossible = (betsStillPossible, playerBetChoices, episodeResults) => {
  const episodesOccurred = episodeResults.length;
  betsStillPossible = betsStillPossible.map(bet => bet.id);

  let playerBetsStillPossible = [];
  for (const key in playerBetChoices) {
    if (playerBetChoices[key] > episodesOccurred) {
      playerBetsStillPossible.push(key);
    }
  }
  return playerBetsStillPossible.filter(bet => betsStillPossible.includes(bet));
}

const getPlayerDeathsStillPossible = (deadCharacters, playerDeathChoices, episodeResults) => {
  const episodesOccurred = episodeResults.length;
  deadCharacters = deadCharacters.map(character => character.id);

  let playerDeathChoicesStillPossible = {};
  for (const key in playerDeathChoices) {
    if (playerDeathChoices[key] > episodesOccurred && !deadCharacters.includes(key)) {
      playerDeathChoicesStillPossible[key] = playerDeathChoices[key];
    }
  }
  return playerDeathChoicesStillPossible;
}

const getPlayerDeathsStillPossiblePoints = (playerDeathsStillPossible, characters) => {
  const points = [];
  for (const key in playerDeathsStillPossible) {
    const characterChoice = characters.find(character => character.id === key);
    if (playerDeathsStillPossible[key] === "7") {
      points.push(POINTS.DIED_SOMETIME_VALUE);
    } else {
      points.push(parseInt(characterChoice.pointsPerEpisode[playerDeathsStillPossible[key]], 10));
    }
  }
  return points.reduce(sumPoints, 0);
}

const getPlayerSurvivorsStillPossible = (deadCharacters, playerDeathChoices) => {
  deadCharacters = deadCharacters.map(character => character.id);

  let playerSurvivorChoicesStillPossible = {};
  for (const key in playerDeathChoices) {
    if (playerDeathChoices[key] === "0" && !deadCharacters.includes(key)) {
      playerSurvivorChoicesStillPossible[key] = playerDeathChoices[key];
    }
  }
  return playerSurvivorChoicesStillPossible;
}

const getPlayerPossibleThronePoints = (deadCharacters, throneChoice, characters) => {
  deadCharacters = deadCharacters.map(character => character.id);

  if (!deadCharacters.includes(throneChoice)) {
    return getThroneChoicePoints(throneChoice, characters);
  } else {
    return 0;
  }
}

const ScoreService = {};

ScoreService.getBetChoicesByEpisode = getBetChoicesByEpisode;
ScoreService.getActualBetsThisEpisode = getActualBetsThisEpisode;
ScoreService.getCorrectBetsByEpisode = getCorrectBetsByEpisode;
ScoreService.getCorrectBetPoints = getCorrectBetPoints;
ScoreService.getDeathChoicesByEpisode = getDeathChoicesByEpisode;
ScoreService.getActualDeathsThisEpisode = getActualDeathsThisEpisode;
ScoreService.getCorrectDeathsByEpisode = getCorrectDeathsByEpisode;
ScoreService.getEpisodeExactDeathPoints = getEpisodeExactDeathPoints;
ScoreService.getCorrectDiedSometime = getCorrectDiedSometime;
ScoreService.getCorrectDiedSometimePoints = getCorrectDiedSometimePoints;
ScoreService.getDiedInDifferentEpisode = getDiedInDifferentEpisode;
ScoreService.getDiedInDifferentEpisodePoints = getDiedInDifferentEpisodePoints;
ScoreService.sumPoints = sumPoints;
ScoreService.getEpisodePointsTotal = getEpisodePointsTotal;
ScoreService.getDeadCharacters = getDeadCharacters;
ScoreService.getCharacterSurviverChoices = getCharacterSurviverChoices;
ScoreService.getActualCharacterSurvivers = getActualCharacterSurvivers;
ScoreService.getSurvivingCharacterPoints = getSurvivingCharacterPoints;
ScoreService.getAllActualCharacterSurvivers = getAllActualCharacterSurvivers;
ScoreService.getAllActualCharacterSurviversPoints = getAllActualCharacterSurviversPoints;
ScoreService.getThroneChoicePoints = getThroneChoicePoints;
ScoreService.checkIfThroneChoiceCorrect = checkIfThroneChoiceCorrect;
ScoreService.getActualThronePoints = getActualThronePoints;
ScoreService.getIncorrectCharacterSurvivers = getIncorrectCharacterSurvivers;
ScoreService.getDieSometimeChoices = getDieSometimeChoices;
ScoreService.getBetsNeverOccurred = getBetsNeverOccurred;
ScoreService.getBetsNeverOccurChoices = getBetsNeverOccurChoices;
ScoreService.getCorrectBetsNeverOccurred = getCorrectBetsNeverOccurred;
ScoreService.getBetsNeverOccurredPoints = getBetsNeverOccurredPoints;
ScoreService.getBetsNeverOccurChoicesWithData = getBetsNeverOccurChoicesWithData;
ScoreService.getPossibleBetsNeverOccurredPoints = getPossibleBetsNeverOccurredPoints;
ScoreService.getBetsAlreadyOccurred = getBetsAlreadyOccurred;
ScoreService.getBetsStillPossible = getBetsStillPossible;
ScoreService.getPlayerBetsStillPossible = getPlayerBetsStillPossible;
ScoreService.getPlayerDeathsStillPossible = getPlayerDeathsStillPossible;
ScoreService.getPlayerDeathsStillPossiblePoints = getPlayerDeathsStillPossiblePoints;
ScoreService.getPlayerSurvivorsStillPossible = getPlayerSurvivorsStillPossible;
ScoreService.getPlayerPossibleThronePoints = getPlayerPossibleThronePoints;

export { ScoreService };