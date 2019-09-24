const { expect } = require('chai');

const Card = require('../../Core/Cards/Card');
const CardDeck = require('../../Core/Cards/CardDeck');
const CardHand = require('../../Core/Cards/CardHand');

describe('CardDeck Tests', () => {
  describe('Shuffle', () => {
    const deck = new CardDeck();
    it('should shuffle', () => {
      const beforeShuffle = deck.cardsArray.map(card => card.format());
      deck.shuffle();
      const afterShuffle = deck.cardsArray.map(card => card.format());
      expect(beforeShuffle).to.not.equal(afterShuffle);
    });

    it('should shuffle 10 times', () => {
      const beforeShuffle = deck.cardsArray.map(card => card.format());
      deck.shuffle(10);
      const afterShuffle = deck.cardsArray.map(card => card.format());
      expect(beforeShuffle).to.not.equal(afterShuffle);
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

  describe('CardDeck Creation from String', () => {
    it('should create a card deck from string', () => {
      const cardHandStr = 'A♦-J♦-Q♣';
      const targetValues = ['14', '11', '12'];
      const targetSuits = ['diamonds', 'diamonds', 'clubs'];

      const cardHand = CardHand.fromString(cardHandStr);
      expect(cardHand).to.be.an.instanceof(CardHand);
      for (let i = 0; i < 3; i += 1) {
        const card = cardHand.cards[i];
        expect(card).to.be.an.instanceof(Card);
        expect(card.value).equal(targetValues[i]);
        expect(card.suit).equal(targetSuits[i]);
      }
    });

    it('should create a card deck from string', () => {
      const cardHandStr = '2♠-5♥-7♣';
      const targetValues = ['2', '5', '7'];
      const targetSuits = ['spades', 'hearts', 'clubs'];

      const cardHand = CardHand.fromString(cardHandStr);
      expect(cardHand).to.be.an.instanceof(CardHand);
      for (let i = 0; i < 3; i += 1) {
        const card = cardHand.cards[i];
        expect(card).to.be.an.instanceof(Card);
        expect(card.value).equal(targetValues[i]);
        expect(card.suit).equal(targetSuits[i]);
      }
    });

    it('should throw error on invalid card deck string', () => {
      const cardHandStr = '2♠5♥-7♣';
      try {
        CardHand.fromString(cardHandStr);
      } catch (err) {
        expect(err.message).equal('Invalid cardHandStr. Must be of length 8');
        expect(err).to.be.an.instanceof(Error);
      }
    });
  });
});
