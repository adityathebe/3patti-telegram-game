class Card {
  /**
   * @param {String} value
   * @param {String} suit "spades" | "diamonds" | "hearts" | "clubs"
   */
  constructor(value, suit) {
    this.value = value;
    this.suit = suit;
  }
}

module.exports = Card;
