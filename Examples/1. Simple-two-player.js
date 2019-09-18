const CardDeck = require('../Core/Cards/CardDeck');
const CardRule = require('../Core/Cards/CardRule');

const deck = new CardDeck();
deck
  .shuffle(10)
  .distribute(2)
  .forEach(hand => {
    const handStr = hand.map(card => deck.formatCard(card));
    console.log(handStr.join('-'));
    console.log(JSON.stringify(CardRule.getInfo(hand), null, 2));
    console.log('\n\n');
  });
