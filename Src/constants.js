// @ts-check

let GREETING_MSG = '**Private Commands:**\n';
GREETING_MSG += '/register - Register with mobile\n';
GREETING_MSG += '/wallet - Wallet options\n';
GREETING_MSG += '/settings - Private options\n';
GREETING_MSG += '\n**Group Commands:**\n';
GREETING_MSG += '/creategame - Private options\n';
GREETING_MSG += '\n**Hybrid Commands:**\n';
GREETING_MSG += '/cards - Distribute cards\n';

const GAME_CREATED_MSG = '**✅ New game created**\n\n_Please make sure you register first._';

//////////////////////////
// Information messages //
//////////////////////////
const GROUP_ONLY_CMD_INFO = 'This command only works on groups';

const AUTHOR_ONLY_CMD_INFO = 'This action can only be initiated by the author of the game';

const GAME_NOT_EXIST_INFO = 'Sorry, the game does not exist';

const REGISTER_FIRST_INFO = 'Please /register first';

///////////////
// Keyboards //
///////////////
const MAIN_MENU_KEYBOARD = {
  keyboard: [[{ text: 'Profile' }, { text: 'Wallet' }], [{ text: 'Delete Account' }]],
  resize_keyboard: true,
  one_time_keyboard: false,
};

module.exports = {
  GREETING_MSG,
  GAME_CREATED_MSG,
  MAIN_MENU_KEYBOARD,
  REGISTER_FIRST_INFO,
  GAME_NOT_EXIST_INFO,
  GROUP_ONLY_CMD_INFO,
  AUTHOR_ONLY_CMD_INFO,
};
