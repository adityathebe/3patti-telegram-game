// @ts-check
const bot = require('../bot');
const { USERNAME_TG } = require('../config');
const CardDeck = require('../Core/Cards/CardDeck');
const CardRule = require('../Core/Cards/CardRule');

const { Logger } = require('../Utilities/Logger');
const AppError = require('../Utilities/ErrorHandler');

bot.onText(new RegExp('^/cards$'), handleGetCard);
bot.onText(new RegExp('^/cards [2-9]$'), handleGetCard);
bot.onText(new RegExp(`^/cards@${USERNAME_TG}$`), handleGetCard);
bot.onText(new RegExp(`^/cards@${USERNAME_TG} [2-9]$`), handleGetCard);

async function handleGetCard(msg) {
  const deck = new CardDeck();
  const numPlayers = msg.text.split(' ')[1] || 2;
  const cardHands = deck.shuffle(10).distribute(numPlayers);
  let response = '';
  cardHands.forEach((hand, idx) => {
    const handStr = hand.toString();
    response += `Player ${idx + 1} :\n${handStr}`;
    response += '\n\n';
  });

  // Determine Winner
  const result = CardRule.determineWinners(cardHands);
  const numWinners = result.winnersIndices.length;
  const winners = result.winnersIndices.map(idx => idx + 1).join(' ');
  response += `*Winner = ${numWinners > 1 ? 'Players' : 'Player'} ${winners}*`;

  bot
    .sendMessage(msg.chat.id, response, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [[{ text: 'Re-draw', callback_data: `CARD-REDRAW-${msg.text}` }]],
      },
    })
    .then(sentMsg => Logger.debug({ telegramMsgSent: sentMsg, msgType: 'inline_keyboard' }))
    .catch(AppError.handle);
}

bot.on('callback_query', async query => {
  const payload = query.data;
  query.message.text = payload.replace('CARD-REDRAW-', '');
  if (payload.indexOf('CARD-REDRAW-') !== 0) return;
  bot
    .answerCallbackQuery(query.id, {})
    .then(sentMsg => Logger.debug({ telegramMsgSent: sentMsg, msgType: 'answerCallbackQuery' }))
    .catch(AppError.handle);
  handleGetCard(query.message);
});
