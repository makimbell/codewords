var wordList = getWordList();

setUpCards(wordList);

var cards = $(".card");

// Handle card hover
cards.hover(function() {
    $(this).addClass("bg-secondary");
}, function(){
    $(this).removeClass("bg-secondary");
});

// Handle card click (this will need to be changed based on whose turn it is, state of the board, etc.)
cards.on('click', '*', function (event) {
    let id = getClickedCard(event);
    console.log(id);
});

function getClickedCard(event){
    event.stopImmediatePropagation(); //This prevents this from running twice when the inner element is clicked. It's a bad solution
    let target = event.target;
    let id = target.id;
    while(id===""){
        target = target.parentElement;
        id = target.id;
    }
    return id;
}

function getWordList() {
    return [
        ['one', 'two', 'three', 'four', 'five'],
        ['six', 'seven', 'eight', '9', '10'],
        ['11', '12', '13', '14', '15'],
        ['16', '17', '18', '19', '20'],
        ['21', '22', '23', '24', '25'],
    ]
}

function setUpCards(wordList) {

    let row, column, card, cardBody, cardTitle;

    for (let currentRow = 0; currentRow < 5; currentRow++) {
        for (let currentCol = 0; currentCol < 5; currentCol++) {

            row = document.getElementById("row" + currentRow);

            column = document.createElement("div");
            column.className = "col-sm";

            card = document.createElement("div");
            card.className = "card text-center";
            card.id = currentRow.toString() + "," + currentCol.toString();

            cardBody = document.createElement("div");
            cardBody.className = "card-body";

            cardTitle = document.createElement("h4");
            cardTitle.className = "card-title";
            cardTitle.innerText = wordList[currentRow][currentCol];

            cardBody.appendChild(cardTitle);
            card.appendChild(cardBody);
            column.appendChild(card);
            row.appendChild(column);

        }
    }
}
