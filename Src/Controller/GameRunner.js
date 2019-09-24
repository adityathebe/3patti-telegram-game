// @ts-check
const GameDb = require('../Database/Game');
const GameRoundDb = require('../Database/Round');
const GameRoundController = require('./GameRound');

const SLEEP_PERDIOD = 2;
const sleep = sec => new Promise(a => setTimeout(a, sec * 1000));

class GameRunner {
  /**
   * Fetch all active games and process them
   */
  static async processGames() {
    const activeGames = await GameDb.getAllActiveGames();
    for (const activeGame of activeGames) {
      GameRunner._processGame(activeGame);
    }
    await sleep(SLEEP_PERDIOD);
    GameRunner.processGames();
  }

  /**
   * Process a single game
   * @private
   */
  static async _processGame(activeGame) {
    // 1. Get the latest round
    const rounds = await GameRoundDb.getRoundsOfGame(activeGame._id);
    const latestRound = rounds[rounds.length - 1];

    // 2. If the latestRound has no cards, generate and distribute them
    if (latestRound.cardHands.length === 0) {
      await GameRoundController.createAndDistributeCards(latestRound);
    }

    // 3. If the round is complete start new round
    if (latestRound.isComplete) {
      await GameRoundController.createNewRound(activeGame, latestRound);
    }
  }
}

module.exports = GameRunner;
