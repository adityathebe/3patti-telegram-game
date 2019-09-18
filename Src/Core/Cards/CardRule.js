// @ts-check
const Card = require('./Card');

const ArrayUtils = require('../../Utilities/Array');

class CardRule {
  /**
   * @param {Card[]} cards
   * @returns {Boolean}
   */
  static _hasSequence(cards) {
    const cardValues = cards.map(card => Number(card.value));
    cardValues.sort((a, b) => a - b);
    if (cardValues[0] + 1 === cardValues[1] && cardValues[1] === cardValues[2] - 1) return true;
    if (cardValues[0] === 2 && cardValues[1] === 3 && cardValues[2] === 14) return true; // A, 2, 3
    return false;
  }

  /**
   * @param {Card[]} cards
   * @returns {Number[]}
   */
  static _getSequenceValues(cards) {
    if (CardRule._hasSequence(cards) === false) throw new Error('Cards do not contain any sequence');
    return cards.map(card => Number(card.value)).sort((a, b) => a - b);
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
   * @returns {String}
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
   * @returns {Boolean[]} One hot encoded array
   */
  static determineWinners(cardsList) {
    if (cardsList.length < 2) throw RangeError('cardsList should be at least of length 2');

    ////////////
    // Trials //
    ////////////
    const trialBearersEncoding = cardsList.map(cards => CardRule._hasTrial(cards));
    const numTrialBearers = ArrayUtils._countOccurence(trialBearersEncoding, true);
    if (numTrialBearers === 1) {
      return trialBearersEncoding;
    } else if (numTrialBearers > 1) {
      let maxTrialValue = 0;
      let maxTrialCardIndex = -1;
      cardsList.forEach((cards, idx) => {
        if (!CardRule._hasTrial(cards)) return false;
        const trialValue = CardRule._getTrialValue(cards);
        if (trialValue > maxTrialValue) {
          maxTrialValue = trialValue;
          maxTrialCardIndex = idx;
        }
      });
      return cardsList.map((_, idx) => idx === maxTrialCardIndex);
    }

    //////////////
    // Sequence //
    //////////////
    const seqBearersEncoding = cardsList.map(cards => CardRule._hasSequence(cards));
    const numSeqBearers = ArrayUtils._countOccurence(seqBearersEncoding, true);
    if (numSeqBearers === 1) {
      return seqBearersEncoding;
    } else if (numSeqBearers > 1) {
      let maxSeqVal = 0;
      let maxSeqCardIndex = -1;
      cardsList.forEach((cards, idx) => {
        if (!CardRule._hasSequence(cards)) return false;
        const seqValues = CardRule._getSequenceValues(cards);
        const maxValueInSequence = ArrayUtils._getMaxValue(seqValues);
        if (maxValueInSequence > maxSeqVal) {
          maxSeqVal = maxValueInSequence;
          maxSeqCardIndex = idx;
        }
      });
      return cardsList.map((_, idx) => idx === maxSeqCardIndex);
    }

    ////////////
    // Colors //
    ////////////
    const colorBearersEncoding = cardsList.map(cards => CardRule._hasSequence(cards));
    const numColorBearers = ArrayUtils._countOccurence(colorBearersEncoding, true);
    if (numColorBearers === 1) {
      return colorBearersEncoding;
    } else if (numColorBearers > 1) {
      let maxSeqVal = 0;
      let maxSeqCardIndex = -1;
      cardsList.forEach((cards, idx) => {
        if (!CardRule._hasSequence(cards)) return false;
        const seqValues = CardRule._getSequenceValues(cards);
        const maxValueInSequence = ArrayUtils._getMaxValue(seqValues);
        if (maxValueInSequence > maxSeqVal) {
          maxSeqVal = maxValueInSequence;
          maxSeqCardIndex = idx;
        }
      });
      return cardsList.map((_, idx) => idx === maxSeqCardIndex);
    }

    ///////////
    // Pairs //
    ///////////
  }
}

module.exports = CardRule;
