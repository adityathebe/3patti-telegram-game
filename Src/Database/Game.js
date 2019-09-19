// @ts-check
const GameModel = require('./Models/Game');

class GameDB {
  /**
   * @typedef Game
   * @property {String} groupId
   * @property {String} authorId
   * @property {String} [_id]
   * @property {Number} [playersCount]
   * @property {String} [status]
   * @property {String[]} [initialParticipants]
   * @property {String} [createdAt]
   *
   * @param {Game} gameData
   * @returns {Promise<Game>}
   */
  static async saveGame(gameData) {
    const newGame = new GameModel({
      groupId: gameData.groupId,
      authorId: gameData.authorId,
      initialParticipants: gameData.initialParticipants,
    });

    const response = await newGame.save();
    return response.toObject();
  }

  /**
   * @param {String} gameId
   * @return {Promise<Game>}
   */
  static async findGame(gameId) {
    const user = await GameModel.findById(gameId);
    return user ? user.toObject() : null;
  }

  static async addParticipant(gameId, participantId) {
    const response = await GameModel.update({ _id: gameId }, { $addToSet: { initialParticipants: participantId } });
    return response;
  }
}

module.exports = GameDB;
