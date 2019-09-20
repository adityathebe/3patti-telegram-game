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
      if (card instanceof Card) continue;
      throw new TypeError('Every element in the `cards` must be an instance of Card');
    }

    // All cards must be unique

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
}

module.exports = CardHand;
