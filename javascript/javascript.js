//Game setup
const wordList = getWordList();
setUpCards(wordList);
const playerKeys = generateKeys();
const playerOneKey = playerKeys[0];
const playerTwoKey = playerKeys[1];
let boardProgress = "0".repeat(25).split(''); // TODO: Need something to compare this to for win condition -- actually when 15 have been guessed, that's a win, right?
let gameOver = false;
let playerGuessing = 2;
const cards = $(".card");

function p1GiveClue(){
    playerGuessing = 2;
    showPlayerBoard(playerGuessing);
}
function p2GiveClue(){
    playerGuessing = 1;
    showPlayerBoard(playerGuessing);
}
function p1Guess(){
    playerGuessing = 1;
    showGuessBoard();
}
function p2Guess(){
    playerGuessing = 2;
    showGuessBoard();
}


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
        } else {
            $(card).addClass("bg-danger")
        } else {
        if (playerOneKey[card.id] === "1") {
            $(card).addClass("bg-success")
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
        wordBank.splice(wordIndex, 1);
        wordList.push(wordBank[wordIndex]);
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

function showGuessBoard() {
    //TODO: Show current state of board. All spaces either blank with word (unguessed)
    // or something to indicate that the card has been correctly guessed OR incorrectly guessed
    // Need to know whose turn it is so we know which state to show the board in. Or pass in playerOneProgress[]?
}

function showPlayerBoard(playerGuessing) {
    let currentCard;

    // Turn = 1 means player 1 will be guessing this turn, so we are showing playerTwoKey to playerTwo
    if (playerGuessing === 1) {
        for (let i = 0; i < playerTwoKey.length; i++) {
            currentCard = document.getElementById(i.toString());
            if (playerTwoKey[i] === "1") {
                // This means the card is part of PlayerTwo key
                $(currentCard).addClass("text-success")
            }
        }
    } else {
        for (let i = 0; i < playerOneKey.length; i++) {
            currentCard = document.getElementById(i.toString());
            if (playerOneKey[i] === "1") {
                // This means the card is part of PlayerOne key
                $(currentCard).addClass("text-success")
            }
        }
    }
}

function clearBoard() {
    //TODO: Implement
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
