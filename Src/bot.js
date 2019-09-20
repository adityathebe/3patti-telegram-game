// @ts-check
const TelegramBot = require('node-telegram-bot-api');

const { GREETING_MSG } = require('./constants');
const { APIKEY_TG } = require('./config');
const Database = require('./Database/index');

const bot = new TelegramBot(APIKEY_TG, { polling: false });

module.exports = bot;

// @ts-ignore
if (require.main === module) {
  Database.connect()
    .then(_ => {
      console.log('Connected to database');
      return bot.startPolling();
    })
    .catch(err => {
      console.error('Failed to connect to database');
      process.exit(0);
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
    const chatType = msg.chat.type;
    const time = new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kathmandu' });
    console.log(`[${time}] [${chatType}] ${from} => ${msg.text}`);
  });

  bot.on('callback_query', async query => {
    const msg = query.message;
    const from = query.from.username || query.from.first_name;
    const chatType = msg.chat.type;
    const time = new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kathmandu' });
    console.log(`[${time}] [${chatType}] [Callback] ${from} => ${query.data}`);
  });

  bot.on('polling_error', console.error);

  bot.on('new_chat_members', msg => {
    const group = msg.chat.title;
    const newMember = msg.new_chat_members.map(x => x.username || x.first_name);
    console.log(`New Member :: ${group} ${newMember}`);
  });

  ///////////////////////
  // Register services //
  ///////////////////////
  require('./Services/Wallet');
  require('./Services/GetCard');
  require('./Services/Settings');
  require('./Services/JoinGame');
  require('./Services/LeaveGame');
  require('./Services/DeleteGame');
  require('./Services/RegisterUser');
  require('./Services/StartNewGame');
  require('./Services/CreateNewGame');
}
