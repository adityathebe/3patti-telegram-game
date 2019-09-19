// @ts-check
const bot = require('../bot');

const UserDB = require('../Database/User');

bot.onText(/\/register$/, handleUserRegisteration);
bot.on('contact', handleContactMessage);

async function handleContactMessage(msg, match) {
  const contact = msg.contact;
  const reply = `You have been registered. Hurray !`;
  UserDB.saveUser({
    chatId: msg.chat.id,
    phoneNumber: contact.phone_number,
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
 * @param {*} match
 */
async function handleUserRegisteration(msg, match) {
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

  bot
    .sendMessage(msg.chat.id, registerationMsg, { reply_markup: inlineMarkup })
    .then(_ => console.log('Msg sent'))
    .catch(console.error);
}
