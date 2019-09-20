const ArrayUtils = {
  _shuffleArray: function _shuffleArray(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },
  _cloneArray: function _cloneArray(a) {
    return JSON.parse(JSON.stringify(a));
  },
  _countOccurence: function _countOccurence(arr, query) {
    let numOccurence = 0;
    arr.forEach(val => {
      if (val === query) numOccurence += 1;
    });
    return numOccurence;
  },
  _getMaxValue: function _getMaxValue(arr) {
    let max = 0;
    arr.forEach(v => {
      if (v > max) max = v;
    });
    return max;
  },
};

module.exports = ArrayUtils;
