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

  // Register services
  require('./Services/RegisterUser');
  require('./Services/GetCard');
}
