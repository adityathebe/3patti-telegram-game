// @ts-check
const bot = require('../bot');

const GameDB = require('../Database/Game');
const UserDB = require('../Database/User');

const { Logger } = require('../Utilities/Logger');
const AppError = require('../Utilities/ErrorHandler');
const { AUTHOR_ONLY_CMD_INFO, GAME_NOT_EXIST_INFO, REGISTER_FIRST_INFO } = require('../constants');

bot.on('callback_query', async query => {
  const payload = query.data;
  if (payload.indexOf('DELETE-GAME-') !== 0) return;
  const gameId = payload.replace('DELETE-GAME-', '');

  // User must be registered
  const userInDb = await UserDB.findUser(query.from.id.toString());
  if (!userInDb) {
    return bot
      .answerCallbackQuery(query.id, { text: REGISTER_FIRST_INFO })
      .then(sentMsg => Logger.debug({ telegramMsgSent: sentMsg, msgType: 'answerCallbackQuery' }))
      .catch(AppError.handle);
  }

  // Game must exist
  const gameData = await GameDB.findGame(gameId);
  if (gameData === null) {
    bot
      .answerCallbackQuery(query.id, { text: GAME_NOT_EXIST_INFO })
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
        cache_time: 60,
        show_alert: true,
        text: AUTHOR_ONLY_CMD_INFO,
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
