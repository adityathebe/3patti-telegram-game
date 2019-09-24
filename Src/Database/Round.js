// @ts-check
const GameRoundModel = require('./Models/Round');

class RoundDb {
  /**
   * @typedef GameRound
   * @property {String} [gameId]
   * @property {Number} [potAmount]
   * @property {String[]} [cardHands]
   * @property {Boolean} [isComplete]
   * @property {String[]} [participants]
   * @property {String} [createdAt]
   *
   * @param {GameRound} roundData
   * @returns {Promise<GameRound>}
   */
  static async saveRound(roundData) {
    const newRound = new GameRoundModel({
      gameId: roundData.gameId,
      potAmount: roundData.potAmount,
      cardHands: roundData.cardHands,
      isComplete: roundData.isComplete,
      participants: roundData.participants,
    });

    const response = await newRound.save();
    return response.toObject();
  }

  static async getRoundsOfGame(gameId) {
    const rounds = await GameRoundModel.find({ gameId });
    return rounds.map(round => round.toObject());
  }

  /**
   * @param {String} roundId
   * @param {GameRound} data
   */
  static async updateRound(roundId, data) {
    const response = await GameRoundModel.findByIdAndUpdate(roundId, data);
    return response;
  }
}

module.exports = RoundDb;
