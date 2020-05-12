var wordList = getWordList()

setUpcards(wordList);

$(document).on('click', function() {
  alert("test2")
})

function getWordList () {
  var wordList = [
    ['one','two','three','four','five'],
    ['six','seven','eight','9','10'],
    ['11','12','13','14','15'],
    ['16','17','18','19','20'],
    ['21','22','23','24','25'],
  ]
  return wordList
};

function setUpcards(wordList) {

  for(currentRow = 0; currentRow < 5; currentRow++){
    for(currentCol = 0; currentCol < 5; currentCol++){

      row = document.getElementById("row"+currentRow)
      console.log(row);
      
      column = document.createElement("div")
      column.className = "col-sm"
  
      card = document.createElement("div")
      card.className = "card text-center"
      card.id = currentRow.toString()+","+currentCol.toString()
  
      cardbody = document.createElement("div")
      cardbody.className = "card-body"
  
      cardTitle = document.createElement("h2")
      cardTitle.className = "card-title"
      cardTitle.innerText = wordList[currentRow][currentCol];
  
      cardbody.appendChild(cardTitle);
      card.appendChild(cardbody);
      column.appendChild(card);
      row.appendChild(column);

    }
  }
}

function clickTest(){
  alert("great");
}