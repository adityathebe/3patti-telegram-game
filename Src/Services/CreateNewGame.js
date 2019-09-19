// @ts-check
const bot = require('../bot');

const UserDB = require('../Database/User');
const GameDb = require('../Database/Game');

bot.onText(/\/creategame$/, async (msg, match) => {
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

  const gameInfo = 'Join the Game.\nCurrent Participants: 1';
  const replyMarkup = {
    inline_keyboard: [
      [
        {
          text: 'Join',
          callback_data: `JOIN-GAME-${dbResponse._id}`,
        },
      ],
    ],
  };
  await bot.sendMessage(msg.chat.id, gameInfo, {
    reply_markup: replyMarkup,
    reply_to_message_id: msg.message_id,
  });
});
