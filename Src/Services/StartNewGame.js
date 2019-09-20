// @ts-check
const bot = require('../bot');

const UserDB = require('../Database/User');
const GameDB = require('../Database/Game');
const CardDeck = require('../Core/Cards/CardDeck');

bot.on('callback_query', async query => {
  const payload = query.data;
  if (payload.indexOf('START-GAME-') !== 0) return;
  const gameId = payload.replace('START-GAME-', '');
  const gameData = await GameDB.findGame(gameId);

  // User must be registered
  const userInDb = await UserDB.findUser(query.from.id.toString());
  if (!userInDb) {
    return bot.answerCallbackQuery(query.id, {
      text: 'Please register first',
    });
  }

  // The game must exist
  if (gameData === null) {
    bot.deleteMessage(query.message.chat.id, query.message.message_id.toString());
    bot.answerCallbackQuery(query.id, {
      text: 'Sorry, the game does not exist',
    });
    return;
  }

  // User must be the author of the game
  if (gameData.authorId !== query.from.id.toString()) {
    return bot.answerCallbackQuery(query.id, {
      text: 'This action can only be initiated by the author of the game',
      show_alert: true,
      cache_time: 60,
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
  bot.answerCallbackQuery(query.id);
  bot.deleteMessage(query.message.chat.id, query.message.message_id.toString());
  bot.sendMessage(query.message.chat.id, '**Game has started**', {
    parse_mode: 'Markdown',
  });

  const cardDeck = new CardDeck();
  const cardHands = cardDeck.distribute(gameData.initialParticipants.length);
  gameData.initialParticipants.forEach((participant, idx) => {
    bot.sendMessage(participant, cardHands[idx].format());
  });
});
