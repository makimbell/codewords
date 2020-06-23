// Game setup
let p1Name = window.prompt("Player 1, please enter your name:","Andy");
let p2Name = window.prompt("Player 2, please enter your name:", "Kristine");

const wordList = getWordList();
setUpCards(wordList);

const playerKeys = generateKeys();
const playerOneKey = playerKeys[0];
const playerTwoKey = playerKeys[1];

const gamePhases = {
    GAMESTART : 0,
    P1_GIVECLUE : 1,
    P2_GUESS : 2,
    P2_GIVECLUE : 3,
    P1_GUESS : 4,
    INVALID : 5
}

let boardProgress = "0".repeat(25).split('');
let gameScore = 0;
let gameOver = false;
let gamePhase = gamePhases.GAMESTART;

const cards = $(".card");
const instructionHeader = document.getElementById("instruction-header");
const instructionText = document.getElementById("instruction-text");
const gameButton = document.getElementById("gameButton");

setInstructions(
    "GAME START",
    `${p2Name}, look away. ${p1Name}, press "Start"`,
    "START GAME"
)
// End game setup


function nextPhase(){
    if (gamePhase === gamePhases.P1_GUESS)
    {
        gamePhase = gamePhases.P1_GIVECLUE;
    } else {
        gamePhase++;
    }

    switch (gamePhase) {
        case gamePhases.P1_GIVECLUE:
            giveClue();
            break;
        case gamePhases.P2_GUESS:
            guess();
            break;
        case gamePhases.P2_GIVECLUE:
            giveClue();
            break;
        case gamePhases.P1_GUESS:
            guess();
            break;
    }
}

function giveClue() {
    // Get correct player names
    let cluePlayer = (gamePhase === gamePhases.P1_GIVECLUE) ? p1Name : p2Name;
    let guessingPlayer = (gamePhase === gamePhases.P1_GIVECLUE) ? p2Name : p1Name;

    // Manage board and game
    clearBoard();
    showBoardProgress();
    showPlayerBoard();

    // Set instructions
    setInstructions(
        `${cluePlayer}, Think of a Clue`,

        `Your cards are highlighted in green. Think of a clue to give to ${guessingPlayer}.
        A clue consists of:
        1) A single word that can hint at multiple cards
        2) The number of cards your clue applies to`,

        "DONE"
    );
}

function guess() {
    // Get correct player names
    let guessingPlayer = (gamePhase === gamePhases.P1_GUESS) ? p1Name : p2Name;
    let cluePlayer = (gamePhase === gamePhases.P1_GUESS) ? p2Name : p1Name;

    clearBoard();
    showBoardProgress();

    // Set instructions
    setInstructions(
        `${guessingPlayer}, Guess`,

        `Use the clue given to guess as many cards as you want -- but try not to make a wrong guess!`,

        `DONE -- ${cluePlayer} look away`
    );
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
    guessCard(card);
});

function guessCard(card) {
    // If card hasn't been guessed already, see whose turn it is to guess.
    // Whichever player is guessing, test against the other player's key and highlight card appropriately
    if (boardProgress[card.id] === "0"){
        if (gamePhase === gamePhases.P1_GUESS)
            if (playerTwoKey[card.id] === "1") {
                $(card).addClass("bg-success")
                boardProgress[card.id.toString()] = "1";
                gameScore++;
            } else {
                $(card).addClass("bg-danger")
        } else if (gamePhase ===gamePhases.P2_GUESS) {
            if (playerOneKey[card.id] === "1") {
                $(card).addClass("bg-success")
                boardProgress[card.id.toString()] = "1";
                gameScore++;
            } else {
                $(card).addClass("bg-danger")
            }
        }
    }
    testForWin();
}

function testForWin(){
    if (gameScore > 14){
        alert("Win!");
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

function showPlayerBoard() {
    let currentCard;

    if (gamePhase === gamePhases.P2_GIVECLUE) {
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

function setInstructions(headerMessage, instructionMessage, buttonMessage){
    instructionHeader.innerText = headerMessage;
    instructionText.innerText = instructionMessage;
    gameButton.innerText = buttonMessage;
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
