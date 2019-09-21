// @ts-check
const TelegramBot = require('node-telegram-bot-api');

const { GREETING_MSG } = require('./constants');
const { APIKEY_TG } = require('./config');
const Database = require('./Database/index');

const { Logger } = require('./Utilities/Logger');
const AppError = require('./Utilities/ErrorHandler');

const bot = new TelegramBot(APIKEY_TG, { polling: false });

module.exports = bot;

// @ts-ignore
if (require.main === module) {
  Database.connect()
    .then(_ => {
      Logger.info('Connected to database');
      return bot.startPolling();
    })
    .catch(err => {
      AppError.handle(err);
      process.exit(0);
    });

  // Greeting Message
  bot.onText(/\/start$/, async msg => {
    if (msg.chat.type !== 'private') return;
    bot
      .sendMessage(msg.chat.id, GREETING_MSG, {
        parse_mode: 'Markdown',
        reply_markup: { remove_keyboard: true },
      })
      .catch(AppError.handle);
  });

  /////////////
  // Logging //
  /////////////
  bot.on('text', async msg => {
    Logger.debug(msg.text, {
      telegramMessage: {
        type: 'text',
        message: msg,
      },
    });
  });

  bot.on('callback_query', async query => {
    Logger.debug(query.data, {
      telegramMessage: {
        query,
        type: 'callback_query',
      },
    });
  });

  bot.on('polling_error', AppError.handle);

  bot.on('new_chat_members', msg => {
    Logger.debug(msg.text, {
      telegramMessage: {
        message: msg,
        type: 'new_chat_members',
      },
    });
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
