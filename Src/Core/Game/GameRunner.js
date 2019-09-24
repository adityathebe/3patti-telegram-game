// @ts-check

const GameState = require('./GameRound');

const CardDeck = require('../Cards/CardDeck');

class GameRunner {
  constructor(gameId) {
    this.id = gameId;
    this.deck = new CardDeck();

    const maidenState = new GameState();
    this.currentHistory = maidenState;
    this.stateHistory = [maidenState];
  }

  distribute() {}
}

module.exports = GameRunner;
