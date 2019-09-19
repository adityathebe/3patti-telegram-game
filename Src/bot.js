// @ts-check
const TelegramBot = require('node-telegram-bot-api');

const { APIKEY_TG } = require('./config');

const bot = new TelegramBot(APIKEY_TG, { polling: true });

module.exports = bot;

// Register
require('./Services/RegisterUser');
