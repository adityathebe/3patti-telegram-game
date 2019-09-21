## Classes

<dl>
<dt><a href="#Card">Card</a></dt>
<dd></dd>
<dt><a href="#CardDeck">CardDeck</a></dt>
<dd></dd>
<dt><a href="#CardHand">CardHand</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#CompareResult">CompareResult</a> ⇒ <code><a href="#CompareResult">CompareResult</a></code></dt>
<dd><p>Compare two cards</p>
</dd>
<dt><a href="#WinnersResult">WinnersResult</a> ⇒ <code><a href="#WinnersResult">WinnersResult</a></code></dt>
<dd></dd>
</dl>

<a name="Card"></a>

## Card
**Kind**: global class  

* [Card](#Card)
    * [new Card(value, suit)](#new_Card_new)
    * [.formatCard(card)](#Card.formatCard) ⇒ <code>String</code>

<a name="new_Card_new"></a>

### new Card(value, suit)

| Param | Type | Description |
| --- | --- | --- |
| value | <code>String</code> |  |
| suit | <code>String</code> | 'spades' | 'diamonds' | 'hearts' | 'clubs' |

<a name="Card.formatCard"></a>

### Card.formatCard(card) ⇒ <code>String</code>
**Kind**: static method of [<code>Card</code>](#Card)  

| Param | Type |
| --- | --- |
| card | [<code>Card</code>](#Card) | 

<a name="CardDeck"></a>

## CardDeck
**Kind**: global class  

* [CardDeck](#CardDeck)
    * [new CardDeck([cardsArray])](#new_CardDeck_new)
    * _instance_
        * [.shuffle(iter)](#CardDeck+shuffle) ⇒ [<code>CardDeck</code>](#CardDeck)
        * [.clone()](#CardDeck+clone) ⇒ [<code>CardDeck</code>](#CardDeck)
        * [._popRandom()](#CardDeck+_popRandom) ⇒ [<code>Card</code>](#Card)
        * [.distribute(numPlayers)](#CardDeck+distribute) ⇒ [<code>Array.&lt;CardHand&gt;</code>](#CardHand)
    * _static_
        * [._generateDeckCards()](#CardDeck._generateDeckCards) ⇒ [<code>Array.&lt;Card&gt;</code>](#Card)

<a name="new_CardDeck_new"></a>

### new CardDeck([cardsArray])

| Param | Type |
| --- | --- |
| [cardsArray] | [<code>Array.&lt;Card&gt;</code>](#Card) | 

<a name="CardDeck+shuffle"></a>

### cardDeck.shuffle(iter) ⇒ [<code>CardDeck</code>](#CardDeck)
**Kind**: instance method of [<code>CardDeck</code>](#CardDeck)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| iter | <code>Number</code> | <code>1</code> | Number of times to shuffle the cards. Range [1,50] |

<a name="CardDeck+clone"></a>

### cardDeck.clone() ⇒ [<code>CardDeck</code>](#CardDeck)
**Kind**: instance method of [<code>CardDeck</code>](#CardDeck)  
<a name="CardDeck+_popRandom"></a>

### cardDeck.\_popRandom() ⇒ [<code>Card</code>](#Card)
**Kind**: instance method of [<code>CardDeck</code>](#CardDeck)  
<a name="CardDeck+distribute"></a>

### cardDeck.distribute(numPlayers) ⇒ [<code>Array.&lt;CardHand&gt;</code>](#CardHand)
**Kind**: instance method of [<code>CardDeck</code>](#CardDeck)  

| Param | Type |
| --- | --- |
| numPlayers | <code>Number</code> | 

<a name="CardDeck._generateDeckCards"></a>

### CardDeck.\_generateDeckCards() ⇒ [<code>Array.&lt;Card&gt;</code>](#Card)
**Kind**: static method of [<code>CardDeck</code>](#CardDeck)  
<a name="CardHand"></a>

## CardHand
**Kind**: global class  
<a name="new_CardHand_new"></a>

### new CardHand(cards)

| Param | Type |
| --- | --- |
| cards | [<code>Array.&lt;Card&gt;</code>](#Card) | 

<a name="CompareResult"></a>

## CompareResult ⇒ [<code>CompareResult</code>](#CompareResult)
Compare two cards

**Kind**: global typedef  

| Param | Type |
| --- | --- |
| cardHandA | [<code>CardHand</code>](#CardHand) | 
| cardHandB | [<code>CardHand</code>](#CardHand) | 

**Properties**

| Name | Type |
| --- | --- |
| winner | [<code>CardHand</code>](#CardHand) \| <code>null</code> | 
| isDraw | <code>Boolean</code> | 

<a name="WinnersResult"></a>

## WinnersResult ⇒ [<code>WinnersResult</code>](#WinnersResult)
**Kind**: global typedef  

| Param | Type |
| --- | --- |
| cardHands | [<code>Array.&lt;CardHand&gt;</code>](#CardHand) | 

**Properties**

| Name | Type |
| --- | --- |
| winner; | [<code>CardHand</code>](#CardHand) | 
| winnersIndices | <code>Array.&lt;Number&gt;</code> | 

