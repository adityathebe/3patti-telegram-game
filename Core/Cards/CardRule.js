// @ts-check
const Card = require('./Card');

class CardRule {
  /**
   * @param {Card[]} cards
   * @returns {Boolean}
   */
  static _hasSequence(cards) {
    const cardValues = cards.map(card => Number(card.value));
    cardValues.sort();
    if (cardValues[0] + 1 === cardValues[1] && cardValues[1] === cardValues[2] - 1) return true;
    if (cardValues[0] === 1 && cardValues[1] == 11 && cardValues[2] == 12) return true;
    return false;
  }

  /**
   * @param {Card[]} cards
   * @returns {Number[]}
   */
  static _getSequenceValues(cards) {
    if (CardRule._hasSequence(cards) === false) throw new Error('Cards do not contain any sequence');
    return cards.map(card => Number(card.value)).sort();
  }

  /**
   * @param {Card[]} cards
   * @returns {Boolean}
   */
  static _hasColor(cards) {
    return cards[0].suit == cards[1].suit && cards[0].suit === cards[2].suit;
  }

  /**
   * @param {Card[]} cards
   * @returns {"spades" | "diamonds" | "hearts" | "clubs"}
   */
  static _getColorValue(cards) {
    if (CardRule._hasColor(cards) === false) throw new Error('Cards have no color in them');
    return cards[0].suit;
  }

  /**
   * @param {Card[]} cards
   * @returns {Boolean}
   */
  static _hasPair(cards) {
    return cards[0].value === cards[1].value || cards[0].value === cards[2].value || cards[1].value === cards[2].value;
  }

  /**
   * @param {Card[]} cards
   * @returns {Number}
   */
  static _getPairValue(cards) {
    if (CardRule._hasPair(cards) === false) throw new Error('Cards have no pair in them');
    if (cards[0].value === cards[1].value) return Number(cards[0].value);
    if (cards[0].value === cards[2].value) return Number(cards[0].value);
    if (cards[1].value === cards[2].value) return Number(cards[1].value);
  }

  /**
   * @param {Card[]} cards
   * @returns {Boolean}
   */
  static _hasTrial(cards) {
    return cards[0].value == cards[1].value && cards[0].value === cards[2].value;
  }

  /**
   * @param {Card[]} cards
   * @returns {Number}
   */
  static _getTrialValue(cards) {
    if (CardRule._hasTrial(cards) === false) throw new Error('Cards have no trial in them');
    return Number(cards[0].value);
  }

  /**
   * @param {Card[]} cards
   */
  static getInfo(cards) {
    const info = {
      pair: {
        status: CardRule._hasPair(cards),
      },
      trial: {
        status: CardRule._hasTrial(cards),
      },
      color: {
        status: CardRule._hasColor(cards),
      },
      sequence: {
        status: CardRule._hasSequence(cards),
      },
    };

    if (info.pair.status) info.pair.value = CardRule._getPairValue(cards);
    if (info.trial.status) info.trial.value = CardRule._getTrialValue(cards);
    if (info.color.status) info.color.value = CardRule._getColorValue(cards);
    if (info.sequence.status) info.sequence.value = CardRule._getSequenceValues(cards);
    return info;
  }

  /**
   * @param {Card[][]} cardsList
   * @returns {Number[]} winner's array index
   */
  static rankCards(cardsList) {
    const ranks = [];
    for (const cards of cardsList) {
      const cardInfo = CardRule.getInfo(cards);
    }

    // TODO
    return cardsList.map((_, idx) => idx);
  }

  /**
   * @param {Card[][]} cardsList
   * @returns {Number} winner's array index
   */
  static determineWinner(cardsList) {
    if (cardsList.length < 2) throw RangeError('cardsList should be at least length 2');
    const ranks = CardRule.rankCards(cardsList);
    let highestRank = -Infinity;
    let highestRankIndex = -Infinity;
    ranks.forEach((rank, idx) => {
      if (rank > highestRank) {
        highestRank = rank;
        highestRankIndex = idx;
      }
    });
    return highestRankIndex;
  }
}

module.exports = CardRule;
