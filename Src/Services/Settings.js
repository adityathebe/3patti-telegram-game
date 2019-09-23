// @ts-check
const bot = require('../bot');

const UserDB = require('../Database/User');
const GameDB = require('../Database/Game');

const { Logger } = require('../Utilities/Logger');
const AppError = require('../Utilities/ErrorHandler');
const { REGISTER_FIRST_INFO, MAIN_MENU_KEYBOARD } = require('../constants');

bot.onText(/\/settings$/, async msg => {
  if (msg.chat.type !== 'private') return;
  const userInDb = await UserDB.findUser(msg.from.id.toString());
  if (userInDb === null) {
    return bot
      .sendMessage(msg.chat.id, REGISTER_FIRST_INFO)
      .then(sentMsg => Logger.debug({ telegramMsgSent: sentMsg, msgType: 'text' }))
      .catch(AppError.handle);
  }

  let response = 'User Settings';
  bot
    .sendMessage(msg.chat.id, response, { reply_markup: MAIN_MENU_KEYBOARD })
    .then(sentMsg => Logger.debug({ telegramMsgSent: sentMsg, msgType: 'replyKeyboard' }))
    .catch(AppError.handle);
});

bot.onText(/Profile$/, async msg => {
  if (msg.chat.type !== 'private') return;

  const userInDb = await UserDB.findUser(msg.from.id.toString());
  let response = '';
  response += `Username : ${userInDb.username}\n`;
  response += `Contact : ${userInDb.phoneNumber}\n`;
  response += `Registered on : ${new Date(userInDb.registered).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
    weekday: 'long',
    day: '2-digit',
  })}`;
  bot
    .sendMessage(msg.chat.id, response)
    .then(sentMsg => Logger.debug({ telegramMsgSent: sentMsg, msgType: 'text' }))
    .catch(AppError.handle);
});

bot.onText(/Delete Account$/, async msg => {
  if (msg.chat.type !== 'private') return;

  bot
    .sendMessage(msg.from.id, 'Are you sure ?', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'No', callback_data: `DELETE-ACCOUNT-NO` }, { text: 'Yes', callback_data: `DELETE-ACCOUNT-YES` }],
        ],
      },
    })
    .then(sentMsg => Logger.debug({ telegramMsgSent: sentMsg, msgType: 'inline_keyboard' }))
    .catch(AppError.handle);
});

/**
 * There must not be any active games authored by the current user
 */
bot.on('callback_query', async query => {
  const payload = query.data;
  if (payload.indexOf('DELETE-ACCOUNT-') !== 0) return;
  const userSelected = payload.replace('DELETE-ACCOUNT-', '');

  if (userSelected === 'YES') {
    const activeAuthoredGames = await GameDB.getGamesAuthoredByUser(query.from.id, { status: 'active' });
    if (activeAuthoredGames.length !== 0) {
      bot
        .sendMessage(query.message.chat.id, 'You have active games. Cannot delete your account.')
        .then(sentMsg => Logger.debug({ telegramMsgSent: sentMsg, msgType: 'deleteMessage' }))
        .catch(AppError.handle);
    } else {
      const numGamesDeleted = await GameDB.deleteAllGamesOfAuthor(query.from.id.toString());
      await UserDB.deleteUser(query.from.id.toString());
      Promise.all([
        bot.sendMessage(query.message.chat.id, 'Your account has been deleted', {
          reply_markup: { remove_keyboard: true },
        }),
        bot.sendMessage(query.message.chat.id, `All of the ${numGamesDeleted} game(s) you authored have been deleted.`),
      ])
        .then(sentMsg => Logger.debug({ telegramMsgSent: sentMsg, msgType: 'delete-account' }))
        .catch(AppError.handle);
    }
  }

  Promise.all([
    bot.deleteMessage(query.message.chat.id, query.message.message_id.toString()),
    bot.answerCallbackQuery(query.id),
  ])
    .then(sentMsg => Logger.debug({ telegramMsgSent: sentMsg, msgType: 'deleteMessage' }))
    .catch(AppError.handle);
});
