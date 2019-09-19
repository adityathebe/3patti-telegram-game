// @ts-check
const bot = require('../bot');

const CardDeck = require('../Core/Cards/CardDeck');

bot.onText(/(\/cards [2-9]|10)|(\/cards)$/, handleGetCard);

async function handleGetCard(msg, match) {
  const deck = new CardDeck();
  const numPlayers = msg.text.split(' ')[1] || 2;
  const cards = deck.shuffle(10).distribute(numPlayers);
  let response = '';
  cards.forEach((hand, idx) => {
    const handStr = hand.map(card => deck.formatCard(card));
    response += `Player ${idx + 1} :\n${handStr.join('  ')}`;
    response += '\n\n';
  });
  bot.sendMessage(msg.chat.id, response);
}
