// @ts-check
const bot = require('../../bot');
const CardDeck = require('../../Core/Cards/CardDeck');
const GameRoundDb = require('../../Database/Round');

class GameRound {
  static async createMaidenRound(gameId, gameData) {
    console.log(gameData);
    await GameRoundDb.saveRound({
      gameId,
      potAmount: 0,
      cardHands: [],
      isComplete: false,
      participants: gameData.initialParticipants,
    });
  }

  static async createNewRound(game, lastRound) {
    await GameRoundDb.saveRound({
      gameId: game._id,
      potAmount: 0,
      isComplete: false,
      participants: lastRound.participants,
    });
  }

  static async createAndDistributeCards(lastRound) {
    const cardDeck = new CardDeck();
    const cardHands = cardDeck.distribute(3);
    const cardHandsStr = cardHands.map(cardHand => cardHand.toString());
    await GameRoundDb.updateRound(lastRound._id, {
      cardHands: cardHandsStr,
    });

    for (let i = 0; i < lastRound.participants.length; i += 1) {
      const participant = lastRound.participants[i];
      bot.sendMessage(participant, cardHandsStr[i]);
    }
  }
}

module.exports = GameRound;
