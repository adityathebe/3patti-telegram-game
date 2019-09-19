// @ts-check
const bot = require('../bot');

const GameDB = require('../Database/Game');
const UserDB = require('../Database/User');

bot.on('callback_query', async query => {
  const payload = query.data;
  if (payload.indexOf('JOIN-GAME-') !== 0) return;

  // User must be registered
  const userInDb = await UserDB.findUser(query.from.id.toString());
  if (!userInDb) {
    return bot.answerCallbackQuery({ callback_query_id: query.id, text: 'Please register first' });
  }

  const gameId = payload.replace('JOIN-GAME-', '');
  const response = await GameDB.addParticipant(gameId, query.from.id);
  if (response.nModified) {
    await bot.answerCallbackQuery({ callback_query_id: query.id, text: 'Success' });
    await bot.sendMessage(query.message.chat.id, `${query.from.first_name} has joined the game`);
  } else {
    await bot.answerCallbackQuery({ callback_query_id: query.id, text: 'You have already joined the game' });
  }
});
