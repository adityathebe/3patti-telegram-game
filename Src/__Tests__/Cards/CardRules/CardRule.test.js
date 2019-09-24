const { expect } = require('chai');

const Card = require('../../../Core/Cards/Card');
const CardDeck = require('../../../Core/Cards/CardDeck');
const CardHand = require('../../../Core/Cards/CardHand');
const CardRule = require('../../../Core/Cards/CardRule');

describe('CardRule Tests', () => {
  describe('Sequence Tests', () => {
    it('should detect A-2-3', () => {
      const cards = new CardHand([new Card('2', 'spades'), new Card('14', 'hearts'), new Card('3', 'diamonds')]);
      const result = CardRule._hasSequence(cards);
      expect(result).equal(true);
    });

    it('should detect 8-9-10', () => {
      const cards = new CardHand([new Card('10', 'spades'), new Card('8', 'hearts'), new Card('9', 'diamonds')]);
      const result = CardRule._hasSequence(cards);
      expect(result).equal(true);
    });

    it('should detect 10-J-Q', () => {
      const cards = new CardHand([new Card('11', 'spades'), new Card('12', 'hearts'), new Card('10', 'diamonds')]);
      const result = CardRule._hasSequence(cards);
      expect(result).equal(true);
    });

    it('should detect Q-K-A', () => {
      const cards = new CardHand([new Card('12', 'spades'), new Card('14', 'hearts'), new Card('13', 'diamonds')]);
      const result = CardRule._hasSequence(cards);
      expect(result).equal(true);
    });

    it('should detect J-Q-K', () => {
      const cards = new CardHand([new Card('12', 'spades'), new Card('11', 'hearts'), new Card('13', 'diamonds')]);
      const result = CardRule._hasSequence(cards);
      expect(result).equal(true);
    });
  });

  describe('Trial Tests', () => {
    it('should detect A-A-A', () => {
      const cards = new CardHand([new Card('14', 'spades'), new Card('14', 'hearts'), new Card('14', 'diamonds')]);
      const result = CardRule._hasTrial(cards);
      expect(result).equal(true);
    });

    it('should detect 2-2-2', () => {
      const cards = new CardHand([new Card('2', 'spades'), new Card('2', 'hearts'), new Card('2', 'diamonds')]);
      const result = CardRule._hasTrial(cards);
      expect(result).equal(true);
    });

    it('should should detect 12-2-2', () => {
      const cards = new CardHand([new Card('12', 'spades'), new Card('2', 'hearts'), new Card('2', 'diamonds')]);
      const result = CardRule._hasTrial(cards);
      expect(result).equal(false);
    });
  });

  describe('Pairs Tests', () => {
    it('should detect A-A-A', () => {
      const cards = new CardHand([new Card('14', 'spades'), new Card('14', 'hearts'), new Card('14', 'diamonds')]);
      const result = CardRule._hasPair(cards);
      expect(result).equal(true);
    });

    it('should detect 2-5-2', () => {
      const cards = new CardHand([new Card('2', 'spades'), new Card('5', 'hearts'), new Card('2', 'diamonds')]);
      const result = CardRule._hasPair(cards);
      expect(result).equal(true);
    });

    it('should detect 10-10-14', () => {
      const cards = new CardHand([new Card('10', 'spades'), new Card('10', 'hearts'), new Card('14', 'diamonds')]);
      const result = CardRule._hasPair(cards);
      expect(result).equal(true);
    });

    it('should not detect 10-7-14', () => {
      const cards = new CardHand([new Card('10', 'spades'), new Card('7', 'hearts'), new Card('14', 'diamonds')]);
      const result = CardRule._hasPair(cards);
      expect(result).equal(false);
    });
  });

  describe('Colors Tests', () => {
    it('should detect ♠-♠-♠', () => {
      const cards = new CardHand([new Card('14', 'spades'), new Card('12', 'spades'), new Card('13', 'spades')]);
      const result = CardRule._hasColor(cards);
      expect(result).equal(true);
    });

    it('should detect ♥-♥-♥', () => {
      const cards = new CardHand([new Card('2', 'hearts'), new Card('5', 'hearts'), new Card('3', 'hearts')]);
      const result = CardRule._hasColor(cards);
      expect(result).equal(true);
    });

    it('should detect ♦-♦-♦', () => {
      const cards = new CardHand([new Card('10', 'diamonds'), new Card('5', 'diamonds'), new Card('14', 'diamonds')]);
      const result = CardRule._hasColor(cards);
      expect(result).equal(true);
    });

    it('should detect ♣-♣-♣', () => {
      const cards = new CardHand([new Card('4', 'clubs'), new Card('6', 'clubs'), new Card('8', 'clubs')]);
      const result = CardRule._hasColor(cards);
      expect(result).equal(true);
    });

    it('should not detect ♣-♥-♣', () => {
      const cards = new CardHand([new Card('4', 'clubs'), new Card('6', 'hearts'), new Card('8', 'clubs')]);
      const result = CardRule._hasColor(cards);
      expect(result).equal(false);
    });
  });

  describe('Determine Winners', () => {
    // Draw
    it('should handle draw', () => {
      const a = new CardHand([new Card('2', 'spades'), new Card('3', 'diamonds'), new Card('4', 'hearts')]);
      const b = new CardHand([new Card('2', 'diamonds'), new Card('3', 'hearts'), new Card('4', 'spades')]);
      const c = new CardHand([new Card('2', 'hearts'), new Card('3', 'spades'), new Card('4', 'diamonds')]);
      const x = CardRule.determineWinners([a, b, c]);
      expect(x.winner.toString()).equal(a.toString());
      expect(x.winnersIndices).deep.equal([0, 1, 2]);
    });
  });

  describe('CardRule.compareCards Win Tests', () => {
    // Trial
    it('should return winner = A trial when compared to J-Q-K Color Sequence', () => {
      const a = new CardHand([new Card('14', 'spades'), new Card('14', 'diamonds'), new Card('14', 'hearts')]);
      const b = new CardHand([new Card('12', 'spades'), new Card('13', 'spades'), new Card('11', 'spades')]);
      const x = CardRule.compareCards(a, b);
      expect(x.winner).equal(a);
      expect(x.isDraw).equal(false);
    });

    it('should return winner = A trial when compared to K trial', () => {
      const a = new CardHand([new Card('14', 'spades'), new Card('14', 'diamonds'), new Card('14', 'hearts')]);
      const b = new CardHand([new Card('13', 'spades'), new Card('13', 'diamonds'), new Card('13', 'hearts')]);
      const x = CardRule.compareCards(a, b);
      expect(x.winner).equal(a);
      expect(x.isDraw).equal(false);
    });

    // Color Sequence
    it('should return winner = 2-3-4 all spades when compared to 2-3-4 different', () => {
      const a = new CardHand([new Card('2', 'spades'), new Card('3', 'spades'), new Card('4', 'spades')]);
      const b = new CardHand([new Card('2', 'hearts'), new Card('3', 'clubs'), new Card('4', 'diamonds')]);
      const x = CardRule.compareCards(a, b);
      expect(x.winner).equal(a);
      expect(x.isDraw).equal(false);
    });

    it('should return winner = 6-9-J when compared to 2-3-4', () => {
      const a = new CardHand([new Card('2', 'spades'), new Card('3', 'spades'), new Card('4', 'spades')]);
      const b = new CardHand([new Card('6', 'spades'), new Card('9', 'spades'), new Card('11', 'spades')]);
      const x = CardRule.compareCards(a, b);
      expect(x.winner).equal(a);
      expect(x.isDraw).equal(false);
    });

    // Pairs Test
    it('should return winner = 6-9-J when compared to 2-3-4', () => {
      const a = new CardHand([new Card('2', 'spades'), new Card('2', 'hearts'), new Card('10', 'spades')]);
      const b = new CardHand([new Card('5', 'spades'), new Card('5', 'hearts'), new Card('6', 'spades')]);
      const x = CardRule.compareCards(a, b);
      expect(x.winner).equal(b);
      expect(x.isDraw).equal(false);
    });
  });

  describe('CardRule.compareCardValues Win Tests', () => {
    it('should return winner = A-2-3 when compared to J-Q-K', () => {
      const a = new CardHand([new Card('14', 'spades'), new Card('3', 'spades'), new Card('2', 'spades')]);
      const b = new CardHand([new Card('12', 'spades'), new Card('13', 'spades'), new Card('11', 'spades')]);
      const x = CardRule.compareCardValues(a, b);
      expect(x.winner).equal(a);
      expect(x.isDraw).equal(false);
    });

    it('should return winner = 6-9-J when compared to 2-3-4', () => {
      const a = new CardHand([new Card('2', 'spades'), new Card('3', 'spades'), new Card('4', 'spades')]);
      const b = new CardHand([new Card('6', 'spades'), new Card('9', 'spades'), new Card('11', 'spades')]);
      const x = CardRule.compareCardValues(a, b);
      expect(x.winner).equal(b);
      expect(x.isDraw).equal(false);
    });
  });

  describe('CardRule.compareCardValues Draw Tests', () => {
    it('should return isDraw = true for 12-13-11 & 11-13-12', () => {
      const a = new CardHand([new Card('12', 'spades'), new Card('13', 'spades'), new Card('11', 'spades')]);
      const b = new CardHand([new Card('11', 'hearts'), new Card('13', 'hearts'), new Card('12', 'hearts')]);
      const x = CardRule.compareCardValues(a, b);
      expect(x.winner).equal(null);
      expect(x.isDraw).equal(true);
    });
  });
});
