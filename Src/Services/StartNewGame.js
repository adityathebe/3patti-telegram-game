// @ts-check
const bot = require('../bot');

const UserDB = require('../Database/User');
const GameDB = require('../Database/Game');
const GameRoundDb = require('../Database/Round');

const CardDeck = require('../Core/Cards/CardDeck');
const { GAME_NOT_EXIST_INFO, REGISTER_FIRST_INFO, AUTHOR_ONLY_CMD_INFO } = require('../constants');

bot.on('callback_query', async query => {
  const payload = query.data;
  if (payload.indexOf('START-GAME-') !== 0) return;
  const gameId = payload.replace('START-GAME-', '');
  const gameData = await GameDB.findGame(gameId);

  // User must be registered
  const userInDb = await UserDB.findUser(query.from.id.toString());
  if (!userInDb) {
    return bot.answerCallbackQuery(query.id, {
      text: REGISTER_FIRST_INFO,
    });
  }

  // The game must exist
  if (gameData === null) {
    bot.deleteMessage(query.message.chat.id, query.message.message_id.toString());
    bot.answerCallbackQuery(query.id, {
      text: GAME_NOT_EXIST_INFO,
    });
    return;
  }

  // User must be the author of the game
  if (gameData.authorId !== query.from.id.toString()) {
    return bot.answerCallbackQuery(query.id, {
      cache_time: 60,
      show_alert: true,
      text: AUTHOR_ONLY_CMD_INFO,
    });
  }

  // Game must have at least 2 memebers
  if (gameData.initialParticipants.length < 2) {
    return bot.answerCallbackQuery(query.id, {
      text: 'Cannot start a game with less than 2 users',
      show_alert: true,
    });
  }

  // Start game
  await GameDB.updateGame(gameId, { status: 'active' });
  await GameRoundDb.saveRound({
    gameId: gameId,
    potAmount: 0,
    cardHands: [],
    isComplete: false,
    participants: gameData.initialParticipants,
  });
  
  bot.answerCallbackQuery(query.id);
  bot.deleteMessage(query.message.chat.id, query.message.message_id.toString());
  bot.sendMessage(query.message.chat.id, '**Game has started**', {
    parse_mode: 'Markdown',
  });
});
