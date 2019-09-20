// @ts-check
const bot = require('../bot');

const GameDB = require('../Database/Game');
const UserDB = require('../Database/User');

bot.on('callback_query', async query => {
  const payload = query.data;
  if (payload.indexOf('DELETE-GAME-') !== 0) return;
  const gameId = payload.replace('DELETE-GAME-', '');

  // User must be registered
  const userInDb = await UserDB.findUser(query.from.id.toString());
  if (!userInDb) {
    return bot.answerCallbackQuery({ callback_query_id: query.id, text: 'Please register first' });
  }

  // Game must exist
  const gameData = await GameDB.findGame(gameId);
  if (gameData === null) {
    return Promise.all([
      bot.answerCallbackQuery({ callback_query_id: query.id, text: 'Sorry, the game does not exist' }),
      bot.deleteMessage(query.message.chat.id, query.message.message_id.toString()),
    ]);
  }

  // User must be the author of the game
  if (gameData.authorId !== userInDb.chatId) {
    return bot.answerCallbackQuery({
      callback_query_id: query.id,
      text: 'This action can only be initiated by the author of the game',
      show_alert: true,
      cache_time: 60,
    });
  }

  // Delete Game
  await GameDB.deleteGame(gameId);
  bot.answerCallbackQuery({ callback_query_id: query.id, text: 'Game deleted succesfully' });
  bot.deleteMessage(query.message.chat.id, query.message.message_id.toString());
});
