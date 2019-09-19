// @ts-check
const MyTelegramBot = require('simple-telegram-bot-api');

const bot = require('../bot');

bot.sendMessage('451722605', 'hey');
bot.onText(/\/register/, handleUserRegisteration);
bot.on('contact', handleContactMessage);

async function handleContactMessage(msg, match) {
  const contact = msg.contact;
  const reply = `Phone : ${contact.phone_number}`;
  bot
    .sendMessage(msg.chat.id, reply)
    .then(_ => console.log('Msg sent'))
    .catch(console.error);
}

/**
 * @param {*} msg
 * @param {*} match
 */
async function handleUserRegisteration(msg, match) {
  const registerationMsg = 'In order to register, you will need to share your contact';
  const keyboardMarkup = MyTelegramBot.makeReplyKeyboardMarkup([
    [
      {
        text: 'Share Contact',
        request_contact: true,
      },
    ],
  ]);
  bot
    .sendMessage(msg.chat.id, registerationMsg, { reply_markup: keyboardMarkup })
    .then(_ => console.log('Msg sent'))
    .catch(console.error);
}
