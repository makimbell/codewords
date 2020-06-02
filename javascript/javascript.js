// Game setup
const wordList = getWordList();
setUpCards(wordList);

const playerKeys = generateKeys();
const playerOneKey = playerKeys[0];
const playerTwoKey = playerKeys[1];

let boardProgress = "0".repeat(25).split(''); // TODO: Need something to compare this to for win condition -- actually when 15 have been guessed, that's a win, right?
let gameOver = false;
let playerGuessing = 2;

const cards = $(".card");
const instructionHeader = $("#instruction-header")[0];
const instructionText = $("#instruction-text")[0];


// Testing functions (NOT PERMANENT)
function p1GiveClue() {
    // Manage board and game
    clearBoard();
    showBoardProgress();
    playerGuessing = 2;
    showPlayerBoard(playerGuessing);

    // Set instructions
    setInstructions(
        "Player 1 Clue Phase:",
        "Your words are highlighted in green. Think of a clue to give player 2, then click p2 Guess"
    );
}

function p2GiveClue() {
    clearBoard();
    showBoardProgress();
    playerGuessing = 1;
    showPlayerBoard(playerGuessing);

    // Set instructions
    setInstructions(
        "Player 2 Clue Phase:",
        "Your words are highlighted in green. Think of a clue to give player 1, then click p1 Guess"
    );
}

function p1Guess() {
    clearBoard();
    playerGuessing = 1;
    showBoardProgress();

    // Set instructions
    setInstructions(
        "Player 1 Guess Phase:",
        "Use the clue Player 2 gave you to click on as many cards as you want. Then click player 1 Give Clue"
    );
}

function p2Guess() {
    clearBoard();
    playerGuessing = 2;
    showBoardProgress();

    // Set instructions
    setInstructions(
        "Player 2 Guess Phase:",
        "Use the clue Player 1 gave you to click on as many cards as you want. Then click player 2 Give Clue"
    );
}
// Testing functions end


// Card hover
cards.hover(function () {
    $(this).addClass("bg-secondary");
}, function () {
    $(this).removeClass("bg-secondary");
});

// Card click
cards.on('click', '*', function (event) {
    let card = getClickedCard(event);
    guessCard(card, playerGuessing);
});

function guessCard(card, playerGuessing) {
    if (playerGuessing === 1)
        if (playerTwoKey[card.id] === "1") {
            $(card).addClass("bg-success")
            boardProgress[card.id.toString()] = "1";
        } else {
            $(card).addClass("bg-danger")
        } else {
        if (playerOneKey[card.id] === "1") {
            $(card).addClass("bg-success")
            boardProgress[card.id.toString()] = "1";
        } else {
            $(card).addClass("bg-danger")
        }
    }
}

function getClickedCard(event) {
    event.stopImmediatePropagation(); //Prevents this from running twice when the inner element is clicked. It's a bad solution
    let target = event.target;
    let id = target.id;
    while (id === "") {
        target = target.parentElement;
        id = target.id;
    }
    return document.getElementById(id);
}

function getWordList() {
    let wordList = [];
    for (let i = 0; i < 25; i++) {
        let wordIndex = Math.floor(Math.random() * wordBank.length);
        wordList.push(wordBank[wordIndex]);
        wordBank.splice(wordIndex, 1); // Remove used word
    }
    return wordList;
}

function generateKeys() {
    let key1 = generatePlayerOneKey();
    let key2 = generatePlayerTwoKey(key1);
    return [key1, key2];
}

function generatePlayerOneKey() {
    // Start with a blank key
    let key = "0".repeat(25);
    let arrayKey = key.split('');

    // Choose 9 unique spots to be correct answers
    let num = 0;
    let index;
    while (num < 9) {
        index = Math.round(Math.random() * 25);
        if (arrayKey[index] === "0") {
            arrayKey[index] = "1";
            num++;
        }
    }
    return arrayKey
}

function generatePlayerTwoKey(seedKeyArray) {
    // Start with a blank key
    let key = "0".repeat(25);
    let arrayKey = key.split('');

    // Choose 9 unique spots to be correct answers
    //  Exactly 3 must match the seedKey
    let num = 0;
    let matches = 0;
    let index;
    while (num < 9) {
        // First get 3 matches
        while (matches < 3) {
            index = Math.round(Math.random() * 25);
            if (arrayKey[index] === "0" && seedKeyArray[index] === "1") {
                arrayKey[index] = "1";
                matches++;
                num++;
            }
        }
        // Now fill in the rest of the key
        index = Math.round(Math.random() * 25);
        if (arrayKey[index] === "0" && seedKeyArray[index] === "0") {
            arrayKey[index] = "1";
            num++;
        }
    }
    return arrayKey
}

function showBoardProgress() {
    for (let i = 0; i < 25; i++) {
        if (boardProgress[i] === "1") {
            $(cards[i]).addClass("bg-success");
        }
    }

}

function showPlayerBoard(playerGuessing) {
    let currentCard;

    // Turn = 1 means player 1 will be guessing this turn, so we are showing playerTwoKey to playerTwo
    if (playerGuessing === 1) {
        for (let i = 0; i < playerTwoKey.length; i++) {
            if (playerTwoKey[i] === "1") {
                // This means the card is part of PlayerTwo key
                $(cards[i]).addClass("text-success")
            }
        }
    } else {
        for (let i = 0; i < playerOneKey.length; i++) {
            if (playerOneKey[i] === "1") {
                // This means the card is part of PlayerOne key
                $(cards[i]).addClass("text-success")
            }
        }
    }
}

function clearBoard() {
    cards.removeClass();
    cards.addClass("card text-center");
}

function setInstructions(headerMessage, instructionMessage){
    instructionHeader.innerText = headerMessage;
    instructionText.innerText = instructionMessage;
}


function setUpCards(wordList) {

    let row, column, card, cardBody, cardTitle;

    for (let currentRow = 0; currentRow < 5; currentRow++) {

        for (let currentCol = 0; currentCol < 5; currentCol++) {

            let currentCardNum = (currentRow * 5) + currentCol;

            row = document.getElementById("row" + currentRow);

            column = document.createElement("div");
            column.className = "col";

            card = document.createElement("div");
            card.className = "card text-center";
            card.id = currentCardNum.toString();

            cardBody = document.createElement("div");
            cardBody.className = "card-body";

            cardTitle = document.createElement("h4");
            cardTitle.className = "card-title";
            cardTitle.innerText = wordList[currentCardNum];

            cardBody.appendChild(cardTitle);
            card.appendChild(cardBody);
            column.appendChild(card);
            row.appendChild(column);
        }
    }
}


// Game loop
while (!gameOver) {
    //alert("Player 1 turn to give clue. [Display instructions]");


    gameOver = true;
}
