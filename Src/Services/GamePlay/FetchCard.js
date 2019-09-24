// @ts-check
const bot = require('../../bot');
const RoundDb = require('../../Database/Round');
const UserDB = require('../../Database/User');

const { Logger } = require('../../Utilities/Logger');
const AppError = require('../../Utilities/ErrorHandler');

const { REGISTER_FIRST_INFO } = require('../../constants');

bot.on('callback_query', async query => {
  const payload = query.data;
  if (payload.indexOf('FETCH-CARD-') !== 0) return;
  const payloadData = payload.replace('FETCH-CARD-', '');
  const cardIndex = parseInt(payloadData.split('-')[0]);
  const roundId = payloadData.split('-')[1];

  // User must be registered
  const userInDb = await UserDB.findUser(query.from.id.toString());
  if (!userInDb) {
    return bot
      .answerCallbackQuery(query.id, { text: REGISTER_FIRST_INFO })
      .then(sentMsg => Logger.debug({ telegramMsgSent: sentMsg, msgType: 'answerCallbackQuery' }))
      .catch(AppError.handle);
  }

  // Round must exist
  const round = await RoundDb.getRoundFromId(roundId);
  if (!round) {
    console.log('Round does not exist');
  }

  // Player must be participant of the round
  if (round.participants.includes(query.from.id.toString()) === false) {
    console.log('Not particiapant of the round');
  }

  // Get cardHand Send respective card
  let playerIndexInRound = -1;
  round.participants.filter((playerId, idx) => {
    if (playerId === query.from.id.toString()) {
      playerIndexInRound = idx;
    }
  });

  const cardHand = round.cardHands[playerIndexInRound];
  const card = cardHand.split(' ')[cardIndex];
  // @ts-ignore
  const replyMarkup = query.message.reply_markup;
  const firstRow = replyMarkup.inline_keyboard[0].map((data, idx) => {
    if (idx === cardIndex) {
      data.text = card;
    }
    return data;
  });

  replyMarkup.inline_keyboard[0] = firstRow;
  bot.answerCallbackQuery(query.id, { cache_time: 1000 });
  bot.editMessageText('Here are your cards.', {
    message_id: query.message.message_id,
    reply_markup: replyMarkup,
    chat_id: query.message.chat.id,
  });
});
