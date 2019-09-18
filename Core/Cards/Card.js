class Card {
  /**
   * @param {String} value
   * @param {"spades" | "diamonds" | "hearts" | "clubs"} suit
   */
  constructor(value, suit) {
    this.value = value;
    this.suit = suit;
  }
}

module.exports = Card;
