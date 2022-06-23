// 1. Make a grid with all hidden tiles
// 2. Mark 10 random tiles with mines

var numCols = 10;
var numRows = 10;

var numMines = 10;

// When page loads up, run the following function to load up all the hidden tiles
window.onload = function() {
    gameSetup();
};

// learn about document object: https://www.w3schools.com/jsref/dom_obj_document.asp
function gameSetup() {
    rowList = [];
    for (let r=0; r<numRows; r++) {
        colList = [];
        for (let c=0; c<numCols; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            document.getElementById("board").append(tile);
            colList.push(tile);
        };
        rowList.push(colList);
    }
    console.log(rowList);
};