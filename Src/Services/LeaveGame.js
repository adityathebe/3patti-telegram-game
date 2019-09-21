// @ts-check
const bot = require('../bot');

const GameDB = require('../Database/Game');
const UserDB = require('../Database/User');
const { USERNAME_TG } = require('../config');
const { GAME_CREATED_MSG } = require('../constants');

const { Logger } = require('../Utilities/Logger');
const AppError = require('../Utilities/ErrorHandler');

bot.on('callback_query', async query => {
  const payload = query.data;
  if (payload.indexOf('LEAVE-GAME-') !== 0) return;
  const gameId = payload.replace('LEAVE-GAME-', '');

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

  // User must be one of the participants on the game
  if (gameData.initialParticipants.includes(userInDb.chatId) === false) {
    return bot
      .answerCallbackQuery(query.id, {
        text: 'You have not joined the game',
      })
      .then(sentMsg => Logger.debug({ telegramMsgSent: sentMsg, msgType: 'answerCallbackQuery' }))
      .catch(AppError.handle);
  }

  // Delete Game
  await GameDB.removeParticipant(gameId, userInDb.chatId);
  bot
    .answerCallbackQuery(query.id, { text: 'Success' })
    .then(sentMsg => Logger.debug({ telegramMsgSent: sentMsg, msgType: 'answerCallbackQuery' }))
    .catch(AppError.handle);

  bot
    .sendMessage(query.message.chat.id, `_${query.from.first_name} has left the game_`, {
      parse_mode: 'Markdown',
    })
    .then(sentMsg => Logger.debug({ telegramMsgSent: sentMsg, msgType: 'text' }))
    .catch(AppError.handle);

  const editedText = `${GAME_CREATED_MSG}\n\nCurrent Participants: ${gameData.initialParticipants.length - 1}`;
  bot
    .editMessageText(editedText, {
      parse_mode: 'Markdown',
      chat_id: query.message.chat.id,
      message_id: query.message.message_id,
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Join', callback_data: `JOIN-GAME-${gameId}` },
            { text: 'Leave', callback_data: `LEAVE-GAME-${gameId}` },
          ],
          [
            { text: 'Start', callback_data: `START-GAME-${gameId}` },
            { text: 'Delete', callback_data: `DELETE-GAME-${gameId}` },
          ],
          [{ text: 'Register', url: `t.me/${USERNAME_TG}?start=register` }],
        ],
      },
    })
    .then(sentMsg => Logger.debug({ telegramMsgSent: sentMsg, msgType: 'inline_keyboard' }))
    .catch(AppError.handle);
});
