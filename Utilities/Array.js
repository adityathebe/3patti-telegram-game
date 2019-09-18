const ArrayUtils = {
  _shuffleArray: function _shuffleArray(a) {
    a = JSON.parse(JSON.stringify(a));
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },
  _cloneArray: function _cloneArray(a) {
    return JSON.parse(JSON.stringify(a));
  },
};


module.exports = ArrayUtils;