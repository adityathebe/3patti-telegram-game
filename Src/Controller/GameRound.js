// @ts-check
const bot = require('../bot');
const CardDeck = require('../Core/Cards/CardDeck');
const GameRoundDb = require('../Database/Round');

function createCardsKeyboardMarkup(roundId) {
  return {
    inline_keyboard: [
      [
        { text: 'Card 1', callback_data: `FETCH-CARD-0-${roundId}` },
        { text: 'Card 2', callback_data: `FETCH-CARD-1-${roundId}` },
        { text: 'Card 3', callback_data: `FETCH-CARD-2-${roundId}` },
      ],
      [
        { text: 'Raise', callback_data: `RAISE-${roundId}` },
        { text: 'Blind', callback_data: `RAISE-${roundId}` },
        { text: 'Pack', callback_data: `RAISE-${roundId}` },
        { text: 'Show', callback_data: `RAISE-${roundId}` },
      ],
    ],
  };
}

class GameRound {
  static async createMaidenRound(gameId, gameData) {
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
      bot.sendMessage(participant, 'Here are your cards', {
        reply_markup: createCardsKeyboardMarkup(lastRound._id),
      });
    }
  }
}

module.exports = GameRound;
