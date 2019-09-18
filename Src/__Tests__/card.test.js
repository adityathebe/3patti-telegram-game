const { expect } = require('chai');

const Card = require('../Core/Cards/Card');
const CardDeck = require('../Core/Cards/CardDeck');
const CardRule = require('../Core/Cards/CardRule');

describe('CardDeck Tests', () => {
  describe('Shuffle', () => {
    const deck = new CardDeck();
    it('should shuffle', () => {
      const before = {
        firstCard: deck.cardsArray[0],
        lastCard: deck.cardsArray[51],
      };
      deck.shuffle();
      const after = {
        firstCard: deck.cardsArray[0],
        lastCard: deck.cardsArray[51],
      };
      expect(before.firstCard.value).to.not.equal(after.firstCard.value);
      expect(before.lastCard.value).to.not.equal(after.lastCard.value);
    });

    it('should shuffle 10 times', () => {
      const before = {
        firstCard: deck.cardsArray[0],
        lastCard: deck.cardsArray[51],
      };
      deck.shuffle(10);
      const after = {
        firstCard: deck.cardsArray[0],
        lastCard: deck.cardsArray[51],
      };
      expect(before.firstCard.value).to.not.equal(after.firstCard.value);
      expect(before.lastCard.value).to.not.equal(after.lastCard.value);
    });

    it('should throw a RangeError if shuffle is passed with value outside [1,50]', () => {
      try {
        deck.shuffle(100);
      } catch (err) {
        expect(err.name).to.equal('RangeError');
      }
    });

    it('should throw a TypeError if shuffle is passed with value that is not a number', () => {
      try {
        deck.shuffle('100');
      } catch (err) {
        expect(err.name).to.equal('TypeError');
      }
    });
  });
});

describe('CardRule Tests', () => {
  describe('Sequence Tests', () => {
    it('should detect A-2-3', () => {
      const cards = [new Card('2', 'spades'), new Card('14', 'hearts'), new Card('3', 'diamonds')];
      const result = CardRule._hasSequence(cards);
      expect(result).equal(true);
    });

    it('should detect 8-9-10', () => {
      const cards = [new Card('10', 'spades'), new Card('8', 'hearts'), new Card('9', 'diamonds')];
      const result = CardRule._hasSequence(cards);
      expect(result).equal(true);
    });

    it('should detect 10-J-Q', () => {
      const cards = [new Card('11', 'spades'), new Card('12', 'hearts'), new Card('10', 'diamonds')];
      const result = CardRule._hasSequence(cards);
      expect(result).equal(true);
    });

    it('should detect Q-K-A', () => {
      const cards = [new Card('12', 'spades'), new Card('14', 'hearts'), new Card('13', 'diamonds')];
      const result = CardRule._hasSequence(cards);
      expect(result).equal(true);
    });

    it('should detect J-Q-K', () => {
      const cards = [new Card('12', 'spades'), new Card('11', 'hearts'), new Card('13', 'diamonds')];
      const result = CardRule._hasSequence(cards);
      expect(result).equal(true);
    });
  });

  describe('Trial Tests', () => {
    it('should detect A-A-A', () => {
      const cards = [new Card('14', 'spades'), new Card('14', 'hearts'), new Card('14', 'diamonds')];
      const result = CardRule._hasTrial(cards);
      expect(result).equal(true);
    });

    it('should detect 2-2-2', () => {
      const cards = [new Card('2', 'spades'), new Card('2', 'hearts'), new Card('2', 'diamonds')];
      const result = CardRule._hasTrial(cards);
      expect(result).equal(true);
    });

    it('should should detect 12-2-2', () => {
      const cards = [new Card('12', 'spades'), new Card('2', 'hearts'), new Card('2', 'diamonds')];
      const result = CardRule._hasTrial(cards);
      expect(result).equal(false);
    });
  });

  describe('Pairs Tests', () => {
    it('should detect A-A-A', () => {
      const cards = [new Card('14', 'spades'), new Card('14', 'hearts'), new Card('14', 'diamonds')];
      const result = CardRule._hasPair(cards);
      expect(result).equal(true);
    });

    it('should detect 2-5-2', () => {
      const cards = [new Card('2', 'spades'), new Card('5', 'hearts'), new Card('2', 'diamonds')];
      const result = CardRule._hasPair(cards);
      expect(result).equal(true);
    });

    it('should detect 10-10-14', () => {
      const cards = [new Card('10', 'spades'), new Card('10', 'hearts'), new Card('14', 'diamonds')];
      const result = CardRule._hasPair(cards);
      expect(result).equal(true);
    });

    it('should not detect 10-7-14', () => {
      const cards = [new Card('10', 'spades'), new Card('7', 'hearts'), new Card('14', 'diamonds')];
      const result = CardRule._hasPair(cards);
      expect(result).equal(false);
    });
  });

  describe('Colors Tests', () => {
    it('should detect ♠-♠-♠', () => {
      const cards = [new Card('14', 'spades'), new Card('12', 'spades'), new Card('13', 'spades')];
      const result = CardRule._hasColor(cards);
      expect(result).equal(true);
    });

    it('should detect ♥-♥-♥', () => {
      const cards = [new Card('2', 'hearts'), new Card('5', 'hearts'), new Card('3', 'hearts')];
      const result = CardRule._hasColor(cards);
      expect(result).equal(true);
    });

    it('should detect ♦-♦-♦', () => {
      const cards = [new Card('10', 'diamonds'), new Card('5', 'diamonds'), new Card('14', 'diamonds')];
      const result = CardRule._hasColor(cards);
      expect(result).equal(true);
    });

    it('should detect ♣-♣-♣', () => {
      const cards = [new Card('4', 'clubs'), new Card('6', 'clubs'), new Card('8', 'clubs')];
      const result = CardRule._hasColor(cards);
      expect(result).equal(true);
    });

    it('should not detect ♣-♥-♣', () => {
      const cards = [new Card('4', 'clubs'), new Card('6', 'hearts'), new Card('8', 'clubs')];
      const result = CardRule._hasColor(cards);
      expect(result).equal(false);
    });
  });

  describe('Win Tests', () => {});
});
