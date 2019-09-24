const CardUtils = {
  suitsMap: {
    diamonds: '♦',
    clubs: '♣',
    hearts: '♥',
    spades: '♠',
  },
  valueMap: {
    '11': 'J',
    '12': 'Q',
    '13': 'K',
    '14': 'A',
  },
  reverseValueMap: {
    J: '11',
    Q: '12',
    K: '13',
    A: '14',
  },
  reverseSuitMap: {
    '♦': 'diamonds',
    '♣': 'clubs',
    '♥': 'hearts',
    '♠': 'spades',
  },
};

module.exports = CardUtils;
