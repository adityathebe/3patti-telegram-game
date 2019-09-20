// @ts-check
const Card = require('./Card');

const ArrayUtils = require('../../Utilities/Array');

class CardResult {
  /**
   * @param {Number[]} winners
   * @param {Object} [params]
   */
  constructor(winners, params = { isDraw: false }) {
    this.winners = winners;
    this.numWinners = winners.length;
  }
}

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
   * Commpare two cards
   * @param {Card[]} cardsA
   * @param {Card[]} cardsB
   * @returns {Card[]}
   */
  static compareCards(cardsA, cardsB) {
    const cardsAInfo = CardRule.getInfo(cardsA);
    const cardsBInfo = CardRule.getInfo(cardsB);
    if (cardsAInfo.trial.status === true && cardsBInfo.trial.status === false) return cardsA;
    if (cardsAInfo.sequence.status === true && cardsBInfo.sequence.status === false) return cardsA;
    if (cardsAInfo.color.status === true && cardsBInfo.color.status === false) return cardsA;
    if (cardsAInfo.pair.status === true && cardsBInfo.pair.status === false) return cardsA;

    if (cardsBInfo.trial.status === true && cardsAInfo.trial.status === false) return cardsB;
    if (cardsBInfo.sequence.status === true && cardsAInfo.sequence.status === false) return cardsB;
    if (cardsBInfo.color.status === true && cardsAInfo.color.status === false) return cardsB;
    if (cardsBInfo.pair.status === true && cardsAInfo.pair.status === false) return cardsB;

    return cardsA;
  }

  /**
   * @param {Card[][]} cardsList
   * @returns {CardResult}
   */
  static determineWinners(cardsList) {
    if (cardsList.length < 2) throw RangeError('cardsList should be at least of length 2');

    ////////////
    // Trials //
    ////////////
    const numTrialBearers = cardsList.filter(cards => CardRule._hasTrial(cards)).length;
    if (numTrialBearers === 1) {
      const winnersArray = [];
      cardsList.forEach((cards, idx) => {
        if (CardRule._hasTrial(cards)) {
          winnersArray.push(idx);
        }
      });
      return new CardResult(winnersArray);
    } else if (numTrialBearers > 1) {
      let maxTrialValue = 0;
      let maxTrialCardIndex = -1;
      cardsList.forEach((cards, idx) => {
        if (!CardRule._hasTrial(cards)) return;
        const trialValue = CardRule._getTrialValue(cards);
        if (trialValue > maxTrialValue) {
          maxTrialValue = trialValue;
          maxTrialCardIndex = idx;
        }
      });
      return new CardResult([maxTrialCardIndex]);
    }

    //////////////
    // Sequence //
    //////////////
    const sequenceRankMap = {
      '12-13-14': 12,
      '11-12-13': 11,
      '10-11-12': 10,
      '9-10-11': 9,
      '8-9-10': 8,
      '7-8-9': 7,
      '6-7-8': 6,
      '5-6-7': 5,
      '4-5-6': 4,
      '3-4-5': 3,
      '2-3-4': 2,
      '2-3-14': 1,
    };
    const sequenceWinners = [];
    let maxSequenceRank = 0;
    cardsList.forEach((cards, idx) => {
      if (CardRule._hasSequence(cards)) {
        const sortedCardStr = cards
          .map(x => Number(x.value))
          .sort((a, b) => a - b)
          .join('-');
        const sequenceRank = sequenceRankMap[sortedCardStr];
        if (sequenceRank > maxSequenceRank) {
          while (sequenceWinners.length !== 0) sequenceWinners.pop();
          sequenceWinners.push(idx);
          maxSequenceRank = sequenceRank;
        } else if (sequenceRank === maxSequenceRank) {
          sequenceWinners.push(idx);
        }
      }
    });
    if (sequenceWinners.length > 0) return new CardResult(sequenceWinners);

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
