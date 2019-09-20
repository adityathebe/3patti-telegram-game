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

  /**
   * @param {String} gameId
   * @param {String} participantId
   */
  static async addParticipant(gameId, participantId) {
    const response = await GameModel.update({ _id: gameId }, { $addToSet: { initialParticipants: participantId } });
    return response;
  }

  /**
   * @param {String} gameId
   * @param {String} participantId
   */
  static async removeParticipant(gameId, participantId) {
    const response = await GameModel.update({ _id: gameId }, { $pull: { initialParticipants: participantId } });
    return response;
  }

  /**
   * @typedef GameUpdate
   * @property {Number} [playersCount]
   * @property {String} [status]
   * @property {String[]} [initialParticipants]
   *
   * @param {String} gameId
   * @param {GameUpdate} gameData
   */
  static async updateGame(gameId, gameData) {
    // @ts-ignore
    const response = await GameModel.findOneAndUpdate({ _id: gameId }, gameData, { returnOriginal: false });
    return response;
  }

  static async getAllActiveGamesInGroup(groupId) {
    const response = await GameModel.find({ groupId, $or: [{ status: 'pending' }, { status: 'active' }] });
    return response.map(res => res.toObject());
  }

  /**
   * @param {String} gameId
   */
  static async deleteGame(gameId) {
    const response = await GameModel.findByIdAndDelete(gameId);
    return response.toObject();
  }
}

module.exports = GameDB;
