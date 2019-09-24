// @ts-check
const GameDb = require('../Database/Game');
const GameRoundDb = require('../Database/Round');

const CardDeck = require('../Core/Cards/CardDeck');
const bot = require('../bot');

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
      const cardDeck = new CardDeck();
      const cardHands = cardDeck.distribute(3);
      const cardHandsStr = cardHands.map(cardHand => cardHand.toString());
      await GameRoundDb.updateRound(latestRound._id, {
        cardHands: cardHandsStr,
      });

      for (let i = 0; i < latestRound.participants.length; i += 1) {
        const participant = latestRound.participants[i];
        bot.sendMessage(participant, cardHandsStr[i]);
      }
    }

    // 3. If the round is complete start new round
    if (latestRound.isComplete) {
      await GameRoundDb.saveRound({
        gameId: activeGame._id,
        potAmount: 0,
        isComplete: false,
        participants: latestRound.participants,
      });
    }
  }
}

module.exports = GameRunner;
