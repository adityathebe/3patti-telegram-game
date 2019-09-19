// @ts-check
const bot = require('../bot');

const GameDB = require('../Database/Game');

bot.on('callback_query', async query => {
  const payload = query.data;
  if (payload.indexOf('START-GAME-') !== 0) return;
  const gameId = payload.replace('START-GAME-', '');
  const gameData = await GameDB.findGame(gameId);

  // The game must exist
  if (gameData === null) {
    bot.deleteMessage(query.message.chat.id, query.message.message_id.toString());
    bot.answerCallbackQuery({
      callback_query_id: query.id,
      text: 'Sorry, the game does not exist',
    });
    return;
  }

  // User must be the author of the game
  if (gameData.authorId !== query.from.id.toString()) {
    return bot.answerCallbackQuery({
      callback_query_id: query.id,
      text: 'Baatho hunchhas !',
    });
  }

  bot.answerCallbackQuery({ callback_query_id: query.id });
  bot.deleteMessage(query.message.chat.id, query.message.message_id.toString());
  bot.sendMessage(query.message.chat.id, '**La game suru**', { parse_mode: 'Markdown' });
});
