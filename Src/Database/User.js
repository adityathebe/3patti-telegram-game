// @ts-check
const mongoose = require('mongoose');
const UserModel = require('./Models/User');

class UserDB {
  /**
   * @typedef User
   * @property {String} chatId
   * @property {String} phoneNumber
   * @property {String} [username]
   * @property {String} [firstName]
   * @property {String} [lastName]
   * @property {String} [registered]
   *
   * @param {User} userData
   * @returns {Promise<mongoose.MongooseDocument>}
   */
  static async saveUser(userData) {
    const newUser = new UserModel({
      chatId: userData.chatId,
      username: userData.username,
      firstName: userData.firstName,
      lastName: userData.lastName,
      registered: userData.registered,
      phoneNumber: userData.phoneNumber,
    });

    const response = await newUser.save();
    return response;
  }

  /**
   *
   * @param {String} chatId
   * @return {Promise<User>}
   */
  static async findUser(chatId) {
    const user = await UserModel.findOne({ chatId });
    return user ? user.toObject() : null;
  }

  static async deleteUser(chatId) {
    const removedUser = await UserModel.findOneAndDelete({ chatId });
    return removedUser;
  }
}

module.exports = UserDB;
