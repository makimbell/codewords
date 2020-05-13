
var wordList = getWordList();
setUpCards(wordList);
var playerOneKey = generateKey();
var playerTwoKey = generateKey();

console.log(playerOneKey)
console.log(playerTwoKey)

var cards = $(".card");

// Card hover
cards.hover(function() {
    $(this).addClass("bg-secondary");
}, function(){
    $(this).removeClass("bg-secondary");
});

// Card click
cards.on('click', '*', function (event) {
    let clickedCard = getClickedCard(event);
    guessCard(clickedCard);
});

function guessCard(card){

    if (playerOneKey[card.id] === "1"){
        $(card).addClass("bg-success")
    } else {
        $(card).addClass("bg-danger")
    }
}

function getClickedCard(event){
    event.stopImmediatePropagation(); //This prevents this from running twice when the inner element is clicked. It's a bad solution
    let target = event.target;
    let id = target.id;
    while(id===""){
        target = target.parentElement;
        id = target.id;
    }
    return document.getElementById(id);
}

function getWordList() {
    return [
        'one', 'two', 'three', 'four', 'five',
        'six', 'seven', 'eight', '9', '10',
        '11', '12', '13', '14', '15',
        '16', '17', '18', '19', '20',
        '21', '22', '23', '24', '25',
    ]
}

function generateKey() {
    // Start with a string of sixteen 0's
    let key = "0".repeat(16);

    // Instert nine 1's into the key in random places
    let arrayKey = key.split('')
    while(arrayKey.length < 25){
        arrayKey.splice(Math.round(Math.random() * arrayKey.length),0,"1");
    }

    return arrayKey
}

function setUpCards(wordList) {

    let row, column, card, cardBody, cardTitle;

    for (let currentRow = 0; currentRow < 5; currentRow++) {
        for (let currentCol = 0; currentCol < 5; currentCol++) {
            
            let currentCardNum = (currentRow * 5) + currentCol;

            row = document.getElementById("row" + currentRow);

            column = document.createElement("div");
            column.className = "col-sm";

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
