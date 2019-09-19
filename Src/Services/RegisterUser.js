// @ts-check
const bot = require('../bot');

const UserDB = require('../Database/User');

bot.onText(/\/register$/, handleUserRegisteration);
bot.onText(/\/start register$/, handleUserRegisteration);
bot.on('contact', handleContactMessage);

async function handleContactMessage(msg) {
  const reply = `You have been registered. Hurray !`;
  UserDB.saveUser({
    chatId: msg.chat.id,
    phoneNumber: msg.contact.phone_number,
    username: msg.chat.username,
  })
    .then(_ => bot.sendMessage(msg.chat.id, reply))
    .catch(err => {
      if (err.code === 11000) {
        return bot.sendMessage(msg.chat.id, 'You have already registered.');
      }
    });
}

/**
 * @param {*} msg
 */
async function handleUserRegisteration(msg) {
  if (msg.chat.type !== 'private') return;

  const userInDb = await UserDB.findUser(msg.from.id.toString());
  if (userInDb !== null) {
    return bot.sendMessage(msg.chat.id, 'You have already registered', {
      reply_to_message_id: msg.message_id,
    });
  }

  const registerationMsg = 'In order to register you will need to share your contact';
  const inlineMarkup = {
    keyboard: [
      [
        {
          text: 'Share Contact',
          request_contact: true,
        },
      ],
    ],
    resize_keyboard: true,
    one_time_keyboard: true,
  };

  return bot.sendMessage(msg.chat.id, registerationMsg, { reply_markup: inlineMarkup }).catch(console.error);
}
