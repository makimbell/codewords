var wordList = getWordList();

setUpCards(wordList);

// Handle card click
$(".card").on('click', '*', function (event) {

    // Find id of Card that was clicked on, whether user clicked card, cardTitle, or cardBody
    let target = event.target;
    let id = target.id;
    while(id===""){
        target = target.parentElement;
        id = target.id;
    }
    console.log(id);
});

// Handle card hover
$(".card").hover(function() {
    $(this).addClass("bg-secondary");
    }, function(){
    $(this).removeClass("bg-secondary");
});

function getWordList() {
    var wordList = [
        ['one', 'two', 'three', 'four', 'five'],
        ['six', 'seven', 'eight', '9', '10'],
        ['11', '12', '13', '14', '15'],
        ['16', '17', '18', '19', '20'],
        ['21', '22', '23', '24', '25'],
    ];
    return wordList
}

function setUpCards(wordList) {

    for (currentRow = 0; currentRow < 5; currentRow++) {
        for (currentCol = 0; currentCol < 5; currentCol++) {

            row = document.getElementById("row" + currentRow);
            console.log(row);

            column = document.createElement("div");
            column.className = "col-sm";

            card = document.createElement("div");
            card.className = "card text-center";
            card.id = currentRow.toString() + "," + currentCol.toString();

            cardbody = document.createElement("div");
            cardbody.className = "card-body";

            cardTitle = document.createElement("h4");
            cardTitle.className = "card-title";
            cardTitle.innerText = wordList[currentRow][currentCol];

            cardbody.appendChild(cardTitle);
            card.appendChild(cardbody);
            column.appendChild(card);
            row.appendChild(column);

        }
    }
}
