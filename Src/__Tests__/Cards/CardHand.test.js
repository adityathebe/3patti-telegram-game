const { expect } = require('chai');

const Card = require('../../Core/Cards/Card');
const CardHand = require('../../Core/Cards/CardHand');

describe('CardHand Tests', () => {
  it('should throw `Duplicate cards` error on duplicates', () => {
    try {
      const cards = [new Card('2', 'spades'), new Card('3', 'diamonds'), new Card('2', 'spades')];
      new CardHand(cards);
    } catch (err) {
      expect(err.message).to.equal('Duplicate cards');
    }
  });

  it('should not throw `Duplicate cards` error on duplicates', () => {
    const cards = [new Card('2', 'spades'), new Card('3', 'diamonds'), new Card('4', 'spades')];
    new CardHand(cards);
  });
});
