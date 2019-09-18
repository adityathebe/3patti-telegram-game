// @ts-check

const Card = require('./Card');

class CardRule {
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
    if (cards[0].value === cards[1].value) return cards[0].value;
    if (cards[0].value === cards[2].value) return cards[0].value;
    if (cards[1].value === cards[2].value) return cards[1].value;
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
    return cards[0].value;
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
      color: { status: CardRule._hasColor(cards) },
    };

    if (info.pair.status) info.pair.value = CardRule._getPairValue(cards);
    if (info.trial.status) info.trial.value = CardRule._getTrialValue(cards);
    if (info.color.status) info.color.value = CardRule._getColorValue(cards);
    return info;
  }
}

module.exports = CardRule;
