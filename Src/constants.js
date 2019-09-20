// @ts-check

let GREETING_MSG = '**Private Commands:**\n';
GREETING_MSG += '/register - Register with mobile\n';
GREETING_MSG += '/wallet - Wallet options\n';
GREETING_MSG += '/settings - Private options\n';
GREETING_MSG += '\n**Group Commands:**\n';
GREETING_MSG += '/creategame - Private options\n';
GREETING_MSG += '\n**Hybrid Commands:**\n';
GREETING_MSG += '/cards - Distribute cards\n';

let GAME_CREATED_MSG = '**✅ New game created**';
GAME_CREATED_MSG += '\n\n_Please make sure you register first._';

module.exports = {
  GREETING_MSG,
  GAME_CREATED_MSG,
};
