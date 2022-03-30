////////////////
// Game setup //
////////////////

// Get player names
let p1Name = window.prompt("Player 1, please enter your name:", "Andy");
let p2Name = window.prompt("Player 2, please enter your name:", "Kristine");

// Get word list from public Google Sheet and then set up the game
// Not doing this for now. Just get word list from backupWords
// $.ajax({
//     url: "https://spreadsheets.google.com/feeds/cells/1bu6zVoDkMwdP1U9mJriq99YNh8OMtRV4ke-IeqULYhY/1/public/values?alt=json",
//     success: function (result) {
//         let wordBank = loadWordBankFromJson(result);
//         console.log(wordBank);
//         setUpCards(getWordList(wordBank));
//         setUpEventListeners();
//         setInstructions(
//             `${p2Name}, look away. ${p1Name}, press START`,
//             "START"
//         )
//     }
// });

var wordBank = backupWords;
console.log(wordBank);
setUpCards(getWordList(wordBank));
setUpEventListeners();
setInstructions(`${p2Name}, look away. ${p1Name}, press START`, "START");

// Generate answer keys for each player
const playerKeys = generateKeys();
const playerOneKey = playerKeys[0];
const playerTwoKey = playerKeys[1];

// Set up game phases. These are used for game flow
const gamePhases = {
    GAMESTART: 0,
    P1_GIVECLUE: 1,
    P2_GUESS: 2,
    P2_GIVECLUE: 3,
    P1_GUESS: 4,
    INVALID: 5
}
let gamePhase = gamePhases.GAMESTART;

// Set up board variables. Progress, score, number of turns
let boardProgress = "0".repeat(25).split('');
let gameScore = 0;
let gameTurn = 0;

// This is a global variable that keeps players from being able to guess after an incorrect guess is made
let guessActive = false;

// Set up some DOM elements
let cards, instructionHeader, instructionText, gameButton, clueForm, clueDisplay;

////////////////////
// End game setup //
////////////////////

function nextPhase() {
    // Cycle to the next game phase.
    // P1 Guess is the last phase, so if you're at or above that, cycle back to the first phase
    if (gamePhase >= gamePhases.P1_GUESS) {
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

    // Manage board and game
    clearBoard();
    showBoardProgress();
    showPlayerBoard();
    showClueForm();
    clueDisplay.hide();

    // Set instructions
    setInstructions(
        `${cluePlayer}, your words are written in green`,
        "DONE"
    );
}

function guess() {
    // Increment game turn counter
    gameTurn++;

    // Activate guessing
    guessActive = true;

    // Get correct player names
    let guessingPlayer = (gamePhase === gamePhases.P1_GUESS) ? p1Name : p2Name;
    let cluePlayer = (gamePhase === gamePhases.P1_GUESS) ? p2Name : p1Name;

    clearBoard();
    showBoardProgress();
    showClue();
    clueForm.hide();

    // Set instructions
    setInstructions(
        `${guessingPlayer}, guess cards based on your clue below:`,
        `DONE -- ${cluePlayer} look away`
    );
}

function showClue() {
    let clueDisplayText = `Your clue: "${$("#clue-input").val()}" applies to ${$("#clue-num-select").val()} cards`
    $("#clue-display-text").text(clueDisplayText);
    clueDisplay.show();
}

function showClueForm() {
    clueForm.show();
    $("#clue-input").val("");
    $("#clue-num-select").val("1");
}

function setUpEventListeners() {
    // Card hover
    cards.hover(function () {
        $(this).addClass("bg-secondary");
    }, function () {
        $(this).removeClass("bg-secondary");
    });

    // Card click
    cards.on('click', '*', function (event) {
        if (guessActive) {
            let card = getClickedCard(event);
            guessCard(card);
        }
    });
}

function guessCard(card) {
    // If card hasn't been guessed already, see whose turn it is to guess.
    // Whichever player is guessing, test against the other player's key and highlight card appropriately
    if (boardProgress[card.id] === "0") {
        if (gamePhase === gamePhases.P1_GUESS)
            if (playerTwoKey[card.id] === "1") {
                $(card).addClass("bg-success")
                boardProgress[card.id.toString()] = "1";
                gameScore++;
            } else {
                $(card).addClass("bg-danger")
                guessActive = false;
            } else if (gamePhase === gamePhases.P2_GUESS) {
            if (playerOneKey[card.id] === "1") {
                $(card).addClass("bg-success")
                boardProgress[card.id.toString()] = "1";
                gameScore++;
            } else {
                $(card).addClass("bg-danger")
                guessActive = false;
            }
        }
    }
    testForWin();
}

function testForWin() {
    if (gameScore > 14) {
        alert(`You won in ${gameTurn} turns!`);
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

function getWordList(wordBank) {
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

function setInstructions(headerMessage, buttonMessage) {
    instructionHeader.text(headerMessage);
    gameButton.text(buttonMessage);
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

    // Populate DOM element variables
    cards = $(".card");
    instructionHeader = $("#instruction-header");
    instructionText = $("#instruction-text");
    gameButton = $("#gameButton");
    clueForm = $("#clue-form");
    clueDisplay = $("#clue-display");

    // Hide elements not needed at start
    clueForm.hide();
    clueDisplay.hide();

}
