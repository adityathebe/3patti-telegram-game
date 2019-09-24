// @ts-check

const POSSIBLE_VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'];
const POSSIBLE_SUITS = ['spades', 'diamonds', 'hearts', 'clubs'];

const CardUtils = require('./Utils');

class Card {
  /**
   * @param {String} value
   * @param {String} suit 'spades' | 'diamonds' | 'hearts' | 'clubs'
   */
  constructor(value, suit) {
    if (POSSIBLE_VALUES.includes(value) === false) {
      throw new RangeError('Value can only take value in range [2, 14]');
    }

    if (POSSIBLE_SUITS.includes(suit) === false) {
      throw new Error("`suit` can only be one of 'spades' | 'diamonds' | 'hearts' | 'clubs'");
    }

    this.value = value;
    this.suit = suit;
  }

  /**
   * @param {Card} card
   * @returns {String}
   */
  static toString(card) {
    const cardSuit = CardUtils.suitsMap[card.suit];
    let cardValue = CardUtils.valueMap[card.value];
    cardValue = cardValue ? cardValue : card.value;
    return `${cardValue}${cardSuit}`;
  }

  /**
   * Returns a string of the given card
   * @returns {String} Card String
   */
  toString() {
    return Card.toString(this);
  }

  /**
   * Create a new Card object from a card string
   * @param {String} cardString
   * @returns {Card}
   */
  static fromString(cardString) {
    if (typeof cardString !== 'string') {
      throw new TypeError('`cardString` must be a string');
    }
    if (cardString.length !== 2) throw new Error('Invalid card string. Must be of length 2.');

    // Convert symbols and values
    const value = CardUtils.reverseValueMap[cardString[0]] || cardString[0];
    const suit = CardUtils.reverseSuitMap[cardString[1]] || cardString[1];
    if (!POSSIBLE_VALUES.includes(value)) throw new Error('Invalid card value.');
    if (!POSSIBLE_SUITS.includes(suit)) throw new Error('Invalid card suit');

    return new Card(value, suit);
  }
}

module.exports = Card;
