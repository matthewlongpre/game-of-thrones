import { POINTS } from "../../shared/constants";

export class ScoreService {

  getBetChoicesByEpisode = (playerBetChoices, episode) => {
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

  getActualBetsThisEpisode = (episode, episodeResults) => {
    let actualBetsThisEpisode = [];
    if (episodeResults[episode - 1]) {
      actualBetsThisEpisode = episodeResults[episode - 1].bets;
    }
    return actualBetsThisEpisode;
  }

  getCorrectBetsByEpisode = (actualBetsThisEpisode, betChoicesByEpisode) => {
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

  getCorrectBetPoints = correctBets => {
    const correctBetPoints = correctBets.map(() => POINTS.BONUS_PREDICTION_VALUE);
    return correctBetPoints.reduce(this.sumPoints, 0);
  };

  getDeathChoicesByEpisode = (playerDeathChoices, episode) => {
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

  getActualDeathsThisEpisode = (episode, episodeResults) => {
    let actualDeathsThisEpisode = [];
    if (episodeResults[episode - 1]) {
      actualDeathsThisEpisode = episodeResults[episode - 1].deaths;
    }
    return actualDeathsThisEpisode;
  }

  getCorrectDeathsByEpisode = (actualDeathsThisEpisode, deathChoicesByEpisode) => {
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

  getEpisodeExactDeathPoints = (correctDeaths, characters, episode) => {
    const episodeExactDeathPoints = correctDeaths.map(death => {
      const result = characters.find(item => item.id === death.character);
      return result.pointsPerEpisode[episode];
    });
    return episodeExactDeathPoints.reduce(this.sumPoints, 0);
  }

  getDieSometimeChoices = (playerDeathChoices) => {
    const dieSometimeChoices = [];
    for (const key in playerDeathChoices) {
      if (playerDeathChoices[key] === "7") {
        dieSometimeChoices.push(key);
      }
    }
    return dieSometimeChoices;
  }

  getCorrectDiedSometime = (actualDeathsThisEpisode, playerDeathChoices) => {
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

  getCorrectDiedSometimePoints = correctDiedSometime => {
    const correctDiedSometimePoints = correctDiedSometime.map(() => POINTS.DIED_SOMETIME_VALUE)
    return correctDiedSometimePoints.reduce(this.sumPoints, 0);
  };

  getDiedInDifferentEpisode = (actualDeathsThisEpisode, playerDeathChoices, episode) => {
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

  getDiedInDifferentEpisodePoints = diedInDifferentEpisode => {
    const diedInDifferenceEpisodePoints = diedInDifferentEpisode.map(() => POINTS.DIED_DIFFERENT_EPISODE_VALUE);
    return diedInDifferenceEpisodePoints.reduce(this.sumPoints, 0);
  }

  sumPoints = (total, current) => total + parseInt(current, 10);

  getEpisodePointsTotal = (episodeExactDeathPoints, correctDiedSometimePoints, diedInDifferentEpisodePoints, correctBetPoints) => {
    let episodePointsTotal = 0;
    episodePointsTotal = episodeExactDeathPoints;
    episodePointsTotal += correctDiedSometimePoints;
    episodePointsTotal += diedInDifferentEpisodePoints;
    episodePointsTotal += correctBetPoints;
    return episodePointsTotal;
  }

  getDeadCharacters = (episodeResults) => {
    const deadCharacters = [];
    episodeResults.forEach(episode => {
      episode.deaths.forEach(deadCharacter => deadCharacters.push(deadCharacter));
    });
    return deadCharacters;
  }

  getCharacterSurviverChoices = (playerDeathChoices) => {
    const characterSurviverChoices = [];
    for (const key in playerDeathChoices) {
      if (playerDeathChoices[key] === "0") {
        characterSurviverChoices.push(key);
      }
    }
    return characterSurviverChoices;
  }

  getActualCharacterSurvivers = (playerSurviverChoices, deadCharacters) => {
    const survivers = playerSurviverChoices.filter(item => {
      return !deadCharacters.find(deadCharacter => deadCharacter.id === item);
    });
    return survivers;
  }

  getIncorrectCharacterSurvivers = (playerSurviverChoices, deadCharacters) => {
    const incorrectSurvivers = playerSurviverChoices.filter(item => {
      return deadCharacters.find(deadCharacter => deadCharacter.id === item);
    });
    return incorrectSurvivers;
  }

  getSurvivingCharacterPoints = (actualCharacterSurvivers, characters) => {
    const survivers = actualCharacterSurvivers.map(surviver => {
      const result = characters.find(character => character.id === surviver);
      return result;
    });
    const points = survivers.map(item => item.pointsPerEpisode[0]);
    return points.reduce(this.sumPoints, 0);
  }

  getAllActualCharacterSurvivers = (characters, deadCharacters) => {
    const survivers = characters.filter(item => {
      return !deadCharacters.find(deadCharacter => deadCharacter.id === item.id);
    });
    return survivers;
  }

  getAllActualCharacterSurviversPoints = (allSurvivers) => {
    const points = allSurvivers.map(item => item.pointsPerEpisode[0]);
    return points.reduce(this.sumPoints, 0);
  }

  getThroneChoicePoints = (throneChoice, characters) => {
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

  checkIfThroneChoiceCorrect = (episodeResults, throneChoice) => {
    return episodeResults[5].throne === throneChoice;
  }

  getActualThronePoints = (episodeResults, characters) => {
    return this.getThroneChoicePoints(episodeResults[5].throne, characters);
  }

  getBetsNeverOccurred = (episodeResults, bets) => {
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

  getBetsNeverOccurChoices = playerBetChoices => {
    const neverOccurChoices = [];
    for (const key in playerBetChoices) {
      if (playerBetChoices[key] === "0") {
        neverOccurChoices.push(key);
      }
    }
    return neverOccurChoices;
  }

  getBetsNeverOccurChoicesWithData = (betsNeverOccurChoices, bets) => {
    const neverOcurredBetData = betsNeverOccurChoices.map(choice => {
      return bets.find(bet => bet.id === choice);
    });
    return neverOcurredBetData;
  }

  getCorrectBetsNeverOccurred = (betsNeverOccurChoices, betsNeverOccurred) => {
    return betsNeverOccurChoices.filter(item => betsNeverOccurred.includes(item.id));
  }

  getBetsNeverOccurredPoints = (correctBetsNeverOccurred) => {
    return this.getCorrectBetPoints(correctBetsNeverOccurred);
  }

  getPossibleBetsNeverOccurredPoints = betsNeverOccurred => {
    return this.getCorrectBetPoints(betsNeverOccurred);
  }

  getBetsAlreadyOccurred = (episodeResults) => {
    const betsAlreadyOccurred = [];
    episodeResults.forEach(episode => {
      episode.bets.forEach(bet => betsAlreadyOccurred.push(bet))
    });
    return betsAlreadyOccurred;
  }

  getBetsStillPossible = (betsAlreadyOccurred, bets) => {
    betsAlreadyOccurred = betsAlreadyOccurred.map(bet => bet.id);
    return bets.filter(bet => !betsAlreadyOccurred.includes(bet.id))
  }

  getPlayerBetsStillPossible = (betsStillPossible, playerBetChoices, episodeResults) => {
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

  getPlayerDeathsStillPossible = (deadCharacters, playerDeathChoices, episodeResults) => {
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

  getPlayerDeathsStillPossiblePoints = (playerDeathsStillPossible, characters) => {
    const points = [];
    for (const key in playerDeathsStillPossible) {
      const characterChoice = characters.find(character => character.id === key);
      if (playerDeathsStillPossible[key] === "7") {
        points.push(POINTS.DIED_SOMETIME_VALUE);
      } else {
        points.push(parseInt(characterChoice.pointsPerEpisode[playerDeathsStillPossible[key]], 10));
      }
    }
    return points.reduce(this.sumPoints, 0);
  }

  getPlayerSurvivorsStillPossible = (deadCharacters, playerDeathChoices) => {
    deadCharacters = deadCharacters.map(character => character.id);

    let playerSurvivorChoicesStillPossible = {};
    for (const key in playerDeathChoices) {
      if (playerDeathChoices[key] === "0" && !deadCharacters.includes(key)) {
        playerSurvivorChoicesStillPossible[key] = playerDeathChoices[key];
      }
    }
    return playerSurvivorChoicesStillPossible;
  }

  getPlayerPossibleThronePoints = (deadCharacters, throneChoice, characters) => {
    deadCharacters = deadCharacters.map(character => character.id);

    if (!deadCharacters.includes(throneChoice)) {
      return this.getThroneChoicePoints(throneChoice, characters);
    } else {
      return 0;
    }
  }

}
