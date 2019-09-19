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
  const gameData = await GameDB.findGame(gameId);
  if (gameData === null) {
    return Promise.all([
      bot.answerCallbackQuery({ callback_query_id: query.id, text: 'Sorry, the game does not exist' }),
      bot.deleteMessage(query.message.chat.id, query.message.message_id.toString()),
    ]);
  }

  const response = await GameDB.addParticipant(gameId, query.from.id);
  if (response.nModified === 0) {
    return bot.answerCallbackQuery({ callback_query_id: query.id, text: 'You have already joined the game' });
  }

  await bot.answerCallbackQuery({ callback_query_id: query.id, text: 'Success' });
  await bot.sendMessage(query.message.chat.id, `_${query.from.first_name} has joined the game_`, {
    parse_mode: 'Markdown'
  });

  const editedText = `Join the Game.\nCurrent Participants : ${gameData.initialParticipants.length + 1}`;
  await bot.editMessageText(editedText, {
    message_id: query.message.message_id,
    chat_id: query.message.chat.id,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Join',
            callback_data: payload,
          },
        ],
      ],
    },
  });
});
