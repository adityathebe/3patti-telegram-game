const CardDeck = require('../Core/Cards/CardDeck');
const CardRule = require('../Core/Cards/CardRule');

const deck = new CardDeck();
const cards = deck.shuffle(10).distribute(2);

cards.forEach(hand => {
  const handStr = hand.map(card => deck.formatCard(card));
  console.log(handStr.join('-'));
});

const winnerIndex = CardRule.determineWinner(cards);
console.log(`Winner :: Player ${winnerIndex + 1}`);