// @ts-check
const bot = require('../bot');

const GameDB = require('../Database/Game');
const UserDB = require('../Database/User');

const { Logger } = require('../Utilities/Logger');
const AppError = require('../Utilities/ErrorHandler');

bot.on('callback_query', async query => {
  const payload = query.data;
  if (payload.indexOf('DELETE-GAME-') !== 0) return;
  const gameId = payload.replace('DELETE-GAME-', '');

  // User must be registered
  const userInDb = await UserDB.findUser(query.from.id.toString());
  if (!userInDb) {
    return bot
      .answerCallbackQuery(query.id, { text: 'Please register first' })
      .then(sentMsg => Logger.debug({ telegramMsgSent: sentMsg, msgType: 'answerCallbackQuery' }))
      .catch(AppError.handle);
  }

  // Game must exist
  const gameData = await GameDB.findGame(gameId);
  if (gameData === null) {
    bot
      .answerCallbackQuery(query.id, { text: 'Sorry, the game does not exist' })
      .then(sentMsg => Logger.debug({ telegramMsgSent: sentMsg, msgType: 'answerCallbackQuery' }))
      .catch(AppError.handle);
    bot
      .deleteMessage(query.message.chat.id, query.message.message_id.toString())
      .then(sentMsg => Logger.debug({ telegramMsgSent: sentMsg, msgType: 'deleteMessage' }))
      .catch(AppError.handle);
  }

  // User must be the author of the game
  if (gameData.authorId !== userInDb.chatId) {
    return bot
      .answerCallbackQuery(query.id, {
        text: 'This action can only be initiated by the author of the game',
        show_alert: true,
        cache_time: 60,
      })
      .then(sentMsg => Logger.debug({ telegramMsgSent: sentMsg, msgType: 'answerCallbackQuery' }))
      .catch(AppError.handle);
  }

  // Delete Game
  await GameDB.deleteGame(gameId);
  bot
    .answerCallbackQuery(query.id, { text: 'Game deleted succesfully' })
    .then(sentMsg => Logger.debug({ telegramMsgSent: sentMsg, msgType: 'answerCallbackQuery' }))
    .catch(AppError.handle);
  bot
    .deleteMessage(query.message.chat.id, query.message.message_id.toString())
    .then(sentMsg => Logger.debug({ telegramMsgSent: sentMsg, msgType: 'deleteMessage' }))
    .catch(AppError.handle);
});
