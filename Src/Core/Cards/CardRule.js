// @ts-check
const CardHand = require('./CardHand');

class CardRule {
  /**
   * @param {CardHand} cardHand
   * @returns {Boolean}
   */
  static _hasSequence(cardHand) {
    const cardValues = cardHand.getValues({ sort: true });
    if (cardValues[0] + 1 === cardValues[1] && cardValues[1] === cardValues[2] - 1) return true;
    if (cardValues[0] === 2 && cardValues[1] === 3 && cardValues[2] === 14) return true; // A, 2, 3
    return false;
  }

  /**
   * @param {CardHand} cardHand
   * @returns {Number[]}
   */
  static _getSequenceValues(cardHand) {
    if (CardRule._hasSequence(cardHand) === false) throw new Error('Cards do not contain any sequence');
    return cardHand.getValues({ sort: true });
  }

  /**
   * @param {CardHand} cardHand
   * @returns {Boolean}
   */
  static _hasColor(cardHand) {
    const suits = cardHand.getSuits();
    return suits[0] == suits[1] && suits[0] === suits[2];
  }

  /**
   * @param {CardHand} cardHand
   * @returns {String}
   */
  static _getColorValue(cardHand) {
    if (CardRule._hasColor(cardHand) === false) throw new Error('Cards have no color in them');
    return cardHand.getSuits()[0];
  }

  /**
   * @param {CardHand} cardHand
   * @returns {Boolean}
   */
  static _hasPair(cardHand) {
    const values = cardHand.getValues();
    return values[0] === values[1] || values[0] === values[2] || values[1] === values[2];
  }

  /**
   * @param {CardHand} cardHand
   * @returns {Number}
   */
  static _getPairValue(cardHand) {
    if (CardRule._hasPair(cardHand) === false) throw new Error('Cards have no pair in them');
    const values = cardHand.getValues();
    if (values[0] === values[1]) return Number(values[0]);
    if (values[0] === values[2]) return Number(values[0]);
    if (values[1] === values[2]) return Number(values[1]);
  }

  /**
   * @param {CardHand} cardHand
   * @returns {Boolean}
   */
  static _hasTrial(cardHand) {
    const values = cardHand.getValues();
    return values[0] == values[1] && values[0] === values[2];
  }

  /**
   * @param {CardHand} cardHand
   * @returns {Number}
   */
  static _getTrialValue(cardHand) {
    if (CardRule._hasTrial(cardHand) === false) throw new Error('Cards have no trial in them');
    return Number(cardHand.getValues()[0]);
  }

  /**
   * @param {CardHand} cardHand
   */
  static getInfo(cardHand) {
    const info = {
      pair: {
        status: CardRule._hasPair(cardHand),
      },
      trial: {
        status: CardRule._hasTrial(cardHand),
      },
      color: {
        status: CardRule._hasColor(cardHand),
      },
      sequence: {
        status: CardRule._hasSequence(cardHand),
      },
    };

    if (info.pair.status) info.pair.value = CardRule._getPairValue(cardHand);
    if (info.trial.status) info.trial.value = CardRule._getTrialValue(cardHand);
    if (info.color.status) info.color.value = CardRule._getColorValue(cardHand);
    if (info.sequence.status) info.sequence.value = CardRule._getSequenceValues(cardHand);
    return info;
  }

  /**
   * Compare two cards
   * @param {CardHand} cardHandA
   * @param {CardHand} cardHandB
   * @returns {CompareResult}
   */
  static compareCards(cardHandA, cardHandB) {
    const infoA = CardRule.getInfo(cardHandA);
    const infoB = CardRule.getInfo(cardHandB);

    // Trial Checks
    if (infoA.trial.status && infoB.trial.status) return CardRule.compareCardValues(cardHandA, cardHandB);
    if (infoA.trial.status && infoB.trial.status === false) return { winner: cardHandA, isDraw: false };
    if (infoB.trial.status && infoA.trial.status === false) return { winner: cardHandB, isDraw: false };

    // Sequence with color
    if (infoA.sequence.status && infoB.sequence.status) {
      if (infoA.color.status && infoB.color.status) return CardRule.compareCardValues(cardHandA, cardHandB);
      if (infoA.color.status && !infoB.color.status) return { winner: cardHandA, isDraw: false };
      if (!infoA.color.status && infoB.color.status) return { winner: cardHandB, isDraw: false };
    }

    // Sequence
    if (infoA.sequence.status && infoB.sequence.status) return CardRule.compareCardValues(cardHandA, cardHandB);
    if (infoA.sequence.status && !infoB.sequence.status) return { winner: cardHandA, isDraw: false };
    if (!infoA.sequence.status && infoB.sequence.status) return { winner: cardHandB, isDraw: false };

    // Color
    if (infoA.color.status && infoB.color.status) {
      if (infoA.pair.status && infoB.pair.status) {
        const pairAVal = CardRule._getPairValue(cardHandA);
        const pairBVal = CardRule._getPairValue(cardHandB);
        if (pairAVal > pairBVal) return { winner: cardHandA, isDraw: false };
        if (pairAVal < pairBVal) return { winner: cardHandB, isDraw: false };
        if (pairAVal == pairBVal) return CardRule.compareCardValues(cardHandA, cardHandB);
      }
      if (infoA.pair.status && !infoB.pair.status) return { winner: cardHandA, isDraw: false };
      if (!infoA.pair.status && infoB.pair.status) return { winner: cardHandB, isDraw: false };
      if (!infoA.pair.status && !infoB.pair.status) return CardRule.compareCardValues(cardHandA, cardHandB);
    }
    if (infoA.color.status && !infoB.color.status) return { winner: cardHandA, isDraw: false };
    if (!infoA.color.status && infoB.color.status) return { winner: cardHandB, isDraw: false };

    // Pair
    if (infoA.pair.status && infoB.pair.status) {
      const pairAVal = CardRule._getPairValue(cardHandA);
      const pairBVal = CardRule._getPairValue(cardHandB);
      if (pairAVal > pairBVal) return { winner: cardHandA, isDraw: false };
      if (pairAVal < pairBVal) return { winner: cardHandB, isDraw: false };
      if (pairAVal == pairBVal) return CardRule.compareCardValues(cardHandA, cardHandB);
    }
    if (infoA.pair.status && !infoB.pair.status) return { winner: cardHandA, isDraw: false };
    if (!infoA.pair.status && infoB.pair.status) return { winner: cardHandB, isDraw: false };

    // Just values
    return CardRule.compareCardValues(cardHandA, cardHandB);
  }

  /**
   * Compare two cards
   * @param {CardHand} cardHandA
   * @param {CardHand} cardHandB
   *
   * @typedef CompareResult
   * @property {CardHand|null} winner
   * @property {Boolean} isDraw
   * @returns {CompareResult}
   */
  static compareCardValues(cardHandA, cardHandB) {
    const valA = cardHandA.getValues({ sort: true });
    const valB = cardHandB.getValues({ sort: true });
    for (let i = 2; i >= 0; i -= 1) {
      if (valA[i] > valB[i]) return { winner: cardHandA, isDraw: false };
      else if (valB[i] > valA[i]) return { winner: cardHandB, isDraw: false };
    }
    return { winner: null, isDraw: true };
  }

  /**
   * @param {CardHand[]} cardHands
   *
   * @typedef WinnersResult
   * @property {CardHand} winner;
   * @property {Number[]} winnersIndices
   * @returns {WinnersResult}
   */
  static determineWinners(cardHands) {
    if (cardHands.length < 2) throw RangeError('cardsList should be at least of length 2');
    let winnersIndices = [0];
    let winnerHand = cardHands[0];
    for (let i = 1; i < cardHands.length; i += 1) {
      const challengerHand = cardHands[i];
      const result = CardRule.compareCards(winnerHand, challengerHand);
      if (result.isDraw) {
        winnersIndices.push(i);
        continue;
      }
      const winnerStr = result.winner.format();
      if (winnerStr === winnerHand.format()) {
        if (challengerHand.format() === winnerStr) {
          winnersIndices.push(i);
        }
      } else {
        winnerHand = challengerHand;
        winnersIndices = [i];
      }
    }
    return { winner: winnerHand, winnersIndices };
  }
}

module.exports = CardRule;
