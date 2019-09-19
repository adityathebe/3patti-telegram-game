// @ts-check
const TelegramBot = require('node-telegram-bot-api');

const { GREETING_MSG } = require('./constants');
const { APIKEY_TG } = require('./config');
const Database = require('./Database/index');

const bot = new TelegramBot(APIKEY_TG, { polling: false });

module.exports = bot;

// @ts-ignore
if (require.main === module) {
  Database.connect().then(_ => {
    bot.startPolling();
    console.log('Connected to database');
  });

  // Greeting Message
  bot.onText(/\/start$/, async msg => {
    if (msg.chat.type !== 'private') return;
    bot.sendMessage(msg.chat.id, GREETING_MSG, {
      parse_mode: 'Markdown',
      reply_markup: { remove_keyboard: true },
    });
  });

  /////////////
  // Logging //
  /////////////
  bot.on('text', async msg => {
    const from = msg.from.username || msg.from.first_name;
    console.log(
      '[' + new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kathmandu' }) + '] ' + from + ' ' + msg.text
    );
  });

  bot.on('polling_error', console.error);

  bot.on('new_chat_members', msg => {
    const group = msg.chat.title;
    const newMember = msg.new_chat_members.map(x => x.username || x.first_name);
    console.log(`New Member :: ${group} ${newMember}`);
  });

  // Register services
  require('./Services/Wallet');
  require('./Services/GetCard');
  require('./Services/Settings');
  require('./Services/JoinGame');
  require('./Services/RegisterUser');
  require('./Services/StartNewGame');
  require('./Services/CreateNewGame');
}
