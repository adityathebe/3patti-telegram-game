// @ts-check
const mongoose = require('mongoose')
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
}

module.exports = UserDB;
