// @ts-check
const Card = require('./Card');

const CARDS_ARRAY_RAW = require('./Data/arrCards');
const CARDS_ARRAY = CARDS_ARRAY_RAW.map(card => new Card(card.value, card.suit));

const ArrayUtils = require('../../Utilities/Array');
const CardUtils = require('./Utils');

class CardDeck {
  constructor(cardsArray) {
    this.cardsArray = ArrayUtils._cloneArray(CARDS_ARRAY);
    if (cardsArray) this.cardsArray = cardsArray;
  }

  /**
   * @param {Number} iter Number of times to shuffle the cards
   * @returns {CardDeck}
   */
  shuffle(iter = 1) {
    if (typeof iter !== 'number') iter = 1;
    if (iter < 1) iter = 1;
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
    this.cardsArray = ArrayUtils._cloneArray(CARDS_ARRAY);
  }

  /**
   * @returns {Card}
   */
  _popRandom() {
    if (this.cardsArray.length < 1) throw new Error('No cards left in the deck');
    this.shuffle();
    return this.cardsArray.pop();
  }

  formatCard(card) {
    let cardValue = CardUtils.valueMap[card.value];
    cardValue = cardValue ? cardValue : card.value;
    return `${cardValue}${CardUtils.suitsMap[card.suit]}`;
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
