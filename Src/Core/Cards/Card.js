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
  static formatCard(card) {
    const cardSuit = CardUtils.suitsMap[card.suit];
    let cardValue = CardUtils.valueMap[card.value];
    cardValue = cardValue ? cardValue : card.value;
    return `${cardValue}${cardSuit}`;
  }

  formatCard() {
    return Card.formatCard(this);
  }
}

module.exports = Card;
