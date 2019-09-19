// @ts-check
const bot = require('../bot');
const { USERNAME_TG } = require('../config');
const CardDeck = require('../Core/Cards/CardDeck');

bot.onText(new RegExp('(/cards [2-9]|10)|(/cards)$'), handleGetCard);
bot.onText(new RegExp(`(/cards@${USERNAME_TG} [2-9]|10)|(\/cards@${USERNAME_TG})$`), handleGetCard);

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
