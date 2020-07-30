# Codewords
## My Code Louisville Javascript class project

### Game Summary and Instructions
Codewords is a game for two players. The board consists of a grid of 25 cards, each displaying a single word. Begin the game by entering the players' names and then pressing the START button. 

On your turn, the other player looks away, and your Codewords are highlighted. These are the words that you must get the other player to guess. You enter a single-word clue into the text box provided and indicate how many of your cards relate to that clue. Click the button and show the screen to the other player.

The other player looks at your clue and tries to guess which cards you are indicating. If he or she makes a wrong guess, the turn is over.

This is repeated until all Codewords are guessed by both players. There are 15 Codewords to guess -- 9 for each player, with 3 overlapping. Try to guess them all in the lowest number of turns you can!

### Info for Code Louisville
The requirements I completed with this project are listed below.
* Read and parse an external file (such as JSON or CSV) into your application and display some data from that in your app
  * This was done through an AJAX call to a Google Sheet I created. The sheet information is imported and parsed in wordbank.js
* Retrieve data from an external API and display data in your app (such as with fetch() or with AJAX)
  * This is combined with the other requirement. Google Sheets returns JSON data with the word bank I use for the game cards
* Create a dictionary or list, populate it with several values, retrieve at least one value, and use it in your program
  * The wordbank list is populated from my external word bank, and it is used to randomly populate the game cards with words
* Create and use a function that accepts two or more values, calculates or determines a new value based on those inputs, and returns a value
  * I have multiple functions that fit these requirements
* Other features can be added to this list - just ask if your project needs something specific and as long as it’s a good demonstration of your programming skills, it almost certainly will count!  Basically, we just want to see you do something interesting and challenging!
  * Please look over my code and determine if I have done something interesting and challenging :)

### Future Development
Please see the issues list for planned work on the project. Feel free to submit your own or work on one of the issues listed.

### Online Version
https://makimbell.github.io/codewords/
