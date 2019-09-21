// @ts-check
const bot = require('../bot');
const { USERNAME_TG } = require('../config');
const CardDeck = require('../Core/Cards/CardDeck');

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
    const handStr = hand.format();
    response += `Player ${idx + 1} :\n${handStr}`;
    response += '\n\n';
  });
  bot
    .sendMessage(msg.chat.id, response, {
      reply_markup: {
        inline_keyboard: [[{ text: 'Re-draw', callback_data: msg.text }]],
      },
    })
    .then(sentMsg => Logger.debug({ telegramMsgSent: sentMsg, msgType: 'inline_keyboard' }))
    .catch(AppError.handle);
}

bot.on('callback_query', async query => {
  const msg = query.message;
  msg.text = query.data;
  bot
    .answerCallbackQuery(query.id, {})
    .then(sentMsg => Logger.debug({ telegramMsgSent: sentMsg, msgType: 'answerCallbackQuery' }))
    .catch(AppError.handle);
  handleGetCard(msg);
});
