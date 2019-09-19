// @ts-check
const bot = require('../bot');

const UserDB = require('../Database/User');

bot.onText(/\/settings$/, async msg => {
  if (msg.chat.type !== 'private') return;
  const userInDb = await UserDB.findUser(msg.from.id.toString());
  if (userInDb === null) {
    return bot.sendMessage(msg.chat.id, 'Please /register first');
  }

  let response = 'User Settings';
  const replyKeyboardMarkup = {
    keyboard: [[{ text: 'Profile' }, { text: 'Wallet' }], [{ text: 'Delete Account' }]],
    resize_keyboard: true,
    one_time_keyboard: false,
  };
  bot.sendMessage(msg.chat.id, response, {
    reply_markup: replyKeyboardMarkup,
  });
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
  bot.sendMessage(msg.chat.id, response);
});

bot.onText(/Delete Account$/, async msg => {
  if (msg.chat.type !== 'private') return;

  bot.sendMessage(msg.from.id, 'Are you sure ?', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'No', callback_data: `DELETE-ACCOUNT-NO` }, { text: 'Yes', callback_data: `DELETE-ACCOUNT-YES` }],
      ],
    },
  });
});

bot.on('callback_query', async query => {
  const payload = query.data;
  if (payload.indexOf('DELETE-ACCOUNT-') !== 0) return;
  const userSelected = payload.replace('DELETE-ACCOUNT-', '');

  if (userSelected === 'YES') {
    await UserDB.deleteUser(query.from.id.toString());
    bot.sendMessage(query.message.chat.id, 'Your account has been deleted', {
      reply_markup: { remove_keyboard: true },
    });
  }

  bot.deleteMessage(query.message.chat.id, query.message.message_id.toString());
  bot.answerCallbackQuery(query.id);
});
