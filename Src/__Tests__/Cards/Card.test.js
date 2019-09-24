const { expect } = require('chai');

const Card = require('../../Core/Cards/Card');

describe('Card Test', () => {
  it('should create a card', () => {
    const card = new Card('4', 'spades');
    expect(card.suit).equal('spades');
    expect(card.value).equal('4');
  });

  it('should throw error on invalid value', () => {
    try {
      new Card('1', 'spades');
    } catch (err) {
      expect(err.name).equal('RangeError');
    }
  });

  it('should throw error when a number is provided as card value', () => {
    try {
      new Card(1, 'spades');
    } catch (err) {
      expect(err.name).equal('RangeError');
    }
  });

  it('should throw error when a invalid suit is provided', () => {
    try {
      new Card('2', 'spadess');
    } catch (err) {
      expect(err.name).equal('Error');
      expect(err.message).equal("`suit` can only be one of 'spades' | 'diamonds' | 'hearts' | 'clubs'");
    }
  });
});
