// @ts-check
const Card = require('./Card');

const ArrayUtils = require('../../Utilities/Array');
const CardUtils = require('./Utils');

class CardDeck {
  constructor(cardsArray) {
    this.cardsArray = CardDeck._generateDeckCards();
    if (cardsArray) this.cardsArray = cardsArray;
  }

  /**
   * @returns {Card[]}
   */
  static _generateDeckCards() {
    const cards = [];
    const suits = ['spades', 'hearts', 'diamonds', 'clubs'];
    for (let i = 2; i <= 14; i += 1) {
      for (let j = 0; j < 4; j += 1) {
        cards.push(new Card(i.toString(), suits[j]));
      }
    }
    return cards;
  }

  /**
   * @param {Number} iter Number of times to shuffle the cards
   * @returns {CardDeck}
   */
  shuffle(iter = 1) {
    if (typeof iter !== 'number') throw new TypeError('iter should be a number');
    if (iter < 1 || iter > 50) throw new RangeError('iter can only take value in range [1, 50]');
    for (let i = 0; i < iter; i += 1) {
      this.cardsArray = ArrayUtils._shuffleArray(this.cardsArray);
    }
    return this;
  }

  /**
   * @returns {CardDeck}
   */
  clone() {
    const clonedCardsArray = ArrayUtils._cloneArray(this.cardsArray);
    return new CardDeck(clonedCardsArray);
  }

  reset() {
    this.cardsArray = ArrayUtils._cloneArray(CardDeck._generateDeckCards());
  }

  /**
   * @returns {Card}
   */
  _popRandom() {
    if (this.cardsArray.length < 1) throw new Error('No cards left in the deck');
    this.shuffle();
    return this.cardsArray.pop();
  }

  /**
   * @param {Card} card
   * @returns {String}
   */
  formatCard(card) {
    const cardSuit = CardUtils.suitsMap[card.suit];
    let cardValue = CardUtils.valueMap[card.value];
    cardValue = cardValue ? cardValue : card.value;
    return `${cardValue}${cardSuit}`;
  }

  /**
   * @param {Number} numPlayers
   * @returns {Card[][]}
   */
  distribute(numPlayers) {
    if (numPlayers * 3 > 52) throw new Error('Players count exceeded');
    const cards = [];
    for (let i = 0; i < numPlayers; i += 1) {
      const oneHand = [];
      for (let j = 0; j < 3; j += 1) {
        oneHand.push(this._popRandom());
      }
      cards.push(oneHand);
    }
    return cards;
  }
}

module.exports = CardDeck;
