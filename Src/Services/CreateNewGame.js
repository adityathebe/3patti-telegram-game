// @ts-check
const bot = require('../bot');
const { USERNAME_TG } = require('../config');

const UserDB = require('../Database/User');
const GameDb = require('../Database/Game');
const { GAME_CREATED_MSG } = require('../constants');

bot.onText(new RegExp(`(/creategame$)|(/creategame@${USERNAME_TG}$)`), async (msg, match) => {
  // Only on group
  if (msg.chat.type === 'private') {
    return bot.sendMessage(msg.chat.id, 'This command only works on groups');
  }

  // Check if user is already registtered
  const doc = await UserDB.findUser(msg.from.id.toString());
  if (doc === null) {
    return bot.sendMessage(msg.chat.id, 'Please register first. Send /register in private message', {
      reply_to_message_id: msg.message_id,
    });
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
        { text: 'Start', callback_data: `START-GAME-${dbResponse._id}` },
      ],
    ],
  };
  await bot.sendMessage(msg.chat.id, gameInfo, {
    reply_markup: replyMarkup,
    reply_to_message_id: msg.message_id,
    parse_mode: 'Markdown',
  });
});
