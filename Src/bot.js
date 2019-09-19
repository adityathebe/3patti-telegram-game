// @ts-check
const TelegramBot = require('node-telegram-bot-api');

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
  let greetingMsg = '**Private Commands:**\n';
  greetingMsg += '/register - Register with mobile\n';
  greetingMsg += '/wallet - Wallet options\n';
  greetingMsg += '/settings - Private options\n';
  greetingMsg += '\n**Group Commands:**\n';
  greetingMsg += '/creategame - Private options\n';
  greetingMsg += '\n**Hybrid Commands:**\n';
  greetingMsg += '/cards - Distribute cards\n';

  bot.onText(/\/start$/, async msg => {
    if (msg.chat.type !== 'private') return;
    bot.sendMessage(msg.chat.id, greetingMsg, { parse_mode: 'Markdown', reply_markup: { remove_keyboard: true } });
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
