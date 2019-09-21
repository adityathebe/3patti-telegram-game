// @ts-check
const Card = require('./Card');

class CardHand {
  /**
   * @constructor
   * @param {Card[]} cards
   */
  constructor(cards) {
    if (cards instanceof Array === false) {
      throw new TypeError('`cards` must be an array of Card');
    }

    if (cards.length !== 3) {
      throw new RangeError('A CardHand must consist of exactly 3 cards');
    }

    for (const card of cards) {
      if (card instanceof Card === false) {
        throw new TypeError('Every element in `cards` must be an instance of Card');
      }
    }

    // All cards must be unique
    const cardsStr = cards.map(card => card.format());
    const duplicates = cards.filter((card, idx) => cardsStr.indexOf(card.format()) !== idx);
    if (duplicates.length > 0) {
      throw new Error('Duplicate cards');
    }

    this.cards = cards;
  }

  getValues({ sort = false } = {}) {
    const values = this.cards.map(card => Number(card.value));
    if (sort) values.sort((a, b) => a - b);
    return values;
  }

  getSuits() {
    return this.cards.map(card => card.suit);
  }

  format() {
    return this.cards.map(card => card.format()).join(' ');
  }
}

module.exports = CardHand;
