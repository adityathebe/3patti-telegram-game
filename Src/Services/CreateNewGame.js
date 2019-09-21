// @ts-check
const bot = require('../bot');
const { USERNAME_TG } = require('../config');

const UserDB = require('../Database/User');
const GameDb = require('../Database/Game');
const { GAME_CREATED_MSG } = require('../constants');

const AppError = require('../Utilities/ErrorHandler');

bot.onText(new RegExp(`(/creategame$)|(/creategame@${USERNAME_TG}$)`), async msg => {
  // Only on group
  if (msg.chat.type === 'private') {
    return bot.sendMessage('msg.chat.id', 'This command only works on groups').catch(AppError.handle);
  }

  // Check if user is registered
  const doc = await UserDB.findUser(msg.from.id.toString());
  if (doc === null) {
    const replyMarkup = {
      inline_keyboard: [[{ text: 'Register', url: `t.me/${USERNAME_TG}?start=register` }]],
    };
    return bot
      .sendMessage(msg.chat.id, 'You cannot create a game without registering', {
        reply_to_message_id: msg.message_id,
        reply_markup: replyMarkup,
      })
      .catch(AppError.handle);
  }

  // Cannot create more than one game in a single group by a single user
  const gamesInThisGroup = await GameDb.getAllActiveGamesInGroup(msg.chat.id);
  if (gamesInThisGroup.length > 0) {
    if (gamesInThisGroup.filter(game => game.authorId === msg.from.id.toString()).length > 0) {
      return bot
        .sendMessage(msg.chat.id, 'You cannot create more than one game in the same group', {
          reply_to_message_id: msg.message_id,
        })
        .catch(AppError.handle);
    }
  }

  const authorId = msg.from.id.toString();
  const groupId = msg.chat.id.toString();
  const dbResponse = await GameDb.saveGame({
    authorId,
    groupId,
    initialParticipants: [authorId],
  });

  const gameInfo = GAME_CREATED_MSG + '\n\nCurrent Participants: 1';
  const replyMarkup = {
    inline_keyboard: [
      [
        { text: 'Join', callback_data: `JOIN-GAME-${dbResponse._id}` },
        { text: 'Leave', callback_data: `LEAVE-GAME-${dbResponse._id}` },
      ],
      [
        { text: 'Start', callback_data: `START-GAME-${dbResponse._id}` },
        { text: 'Delete', callback_data: `DELETE-GAME-${dbResponse._id}` },
      ],
      [{ text: 'Register', url: `t.me/${USERNAME_TG}?start=register` }],
    ],
  };

  bot
    .sendMessage(msg.chat.id, gameInfo, {
      reply_markup: replyMarkup,
      reply_to_message_id: msg.message_id,
      parse_mode: 'Markdown',
    })
    .catch(AppError.handle);
});
