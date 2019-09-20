// @ts-check
const Card = require('./Card');
const CardHand = require('./CardHand');

const ArrayUtils = require('../../Utilities/Array');

class CardDeck {
  /**
   * @constructor
   * @param {Card[]} [cardsArray]
   */
  constructor(cardsArray) {
    this.cardsArray = CardDeck._generateDeckCards();
    if (cardsArray) {
      if (cardsArray instanceof Array === false) {
        throw new TypeError('`cardsArray` must be an Array');
      }

      for (const card of cardsArray) {
        if (card instanceof Card === false) {
          throw new TypeError('Every element in `cardsArray` must be of type Card');
        }
      }
      this.cardsArray = cardsArray;
    }
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
   * @param {Number} iter Number of times to shuffle the cards. Range [1,50]
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
    const randomCard = this.cardsArray.pop();
    return randomCard;
  }

  /**
   * @param {Number} numPlayers
   * @returns {CardHand[]}
   */
  distribute(numPlayers) {
    if (numPlayers * 3 > 52) throw new Error('Players count exceeded');
    const cardHands = [];
    for (let i = 0; i < numPlayers; i += 1) {
      const oneHand = [];
      for (let j = 0; j < 3; j += 1) {
        const randomCard = this._popRandom();
        oneHand.push(randomCard);
      }
      cardHands.push(new CardHand(oneHand));
    }
    return cardHands;
  }
}

module.exports = CardDeck;
