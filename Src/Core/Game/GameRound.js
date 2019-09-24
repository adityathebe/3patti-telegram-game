// @ts-check
const DEFAULT_GAME_STATE = {
  gameId: null,
  bootAmount: 2,
  roundNum: 1,
  initialMembers: [],
  currentMembers: [],
};

module.exports = class GameRound {
  constructor(options = DEFAULT_GAME_STATE) {
    this.gameId = options.gameId;
    this.roundNum = options.roundNum;
    this.bootAmount = options.bootAmount;
    this.initialMembers = options.initialMembers;
    this.currentMembers = options.currentMembers;
    this.playerHands = {};
  }
};
