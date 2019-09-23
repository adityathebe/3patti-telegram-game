// @ts-check
const WalletModel = require('./Models/Wallet');

class WalletDb {
  /**
   * @typedef Wallet
   * @property {String} owner
   *
   * @param {Wallet} walletData
   * @returns {Promise<Wallet>}
   */
  static async saveWallet(walletData) {
    const newWallet = new WalletModel({
      owner: walletData.owner,
    });

    const response = await newWallet.save();
    return response.toObject();
  }

  /**
   * @param {String} walletId
   * @param {Number} additionalAmt
   * @return {Promise<Wallet>}
   */
  static async addAmount(walletId, additionalAmt) {
    const user = await WalletModel.findOneAndUpdate(
      { _id: walletId },
      {
        $inc: {
          amount: additionalAmt,
        },
      }
    );
    return user ? user.toObject() : null;
  }

  /**
   * @param {String} walletId
   * @return {Promise<Wallet>}
   */
  static async deleteWallet(walletId) {
    const removedWallet = await WalletModel.findById({ _id: walletId });
    return removedWallet.toObject();
  }
}

module.exports = WalletDb;
