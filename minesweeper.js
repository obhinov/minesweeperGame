// 1. Make a grid with all hidden tiles
// 2. Mark 10 random tiles with mines

var numXs = 10;
var numYs = 10;

var numMines = 10;

mineLocationsList = mineLocationsGenerator();
board = [];
gameOver = false;

TILE_STATUS = {
    H: "hidden",
    R: "revealed",
    M: "marked",
    B: "bombed"
};

// When page loads up, run the following function to load up all the hidden tiles
window.onload = function() {
    gameSetup();
};

// learn about document object: https://www.w3schools.com/jsref/dom_obj_document.asp
function gameSetup() {
    YList = [];
    for (let y=0; y<numYs; y++) {
        XList = [];
        for (let x=0; x<numXs; x++) {
            let tile = document.createElement("div");
            tile.id = x.toString() + "-" + y.toString();
            tile.dataset.xCord = x;
            tile.dataset.yCord = y;
            tile.dataset.status = TILE_STATUS.H;
            tile.addEventListener("click", tileClicked); // left click
            tile.addEventListener("contextmenu", flagClicked); // right click
            document.getElementById("board").append(tile);
            XList.push(tile);
        };
        YList.push(XList);
        board = YList;
    }

    // printing stuff for debugging purposes 
    console.log(YList);
    console.log(mineLocationsList);
};

function mineLocationsGenerator(){
    mineLocations = [];
    for (let m=0; m<numMines; m++) {
        do {
            mineLocX = Math.floor(Math.random() * numXs);
            mineLocY = Math.floor(Math.random() * numYs);
            mineLocID = mineLocX.toString() + "-" + mineLocY.toString();
        } while (mineLocations.includes(mineLocID));
        mineLocations.push(mineLocID);
    }
    return mineLocations;
};

function tileClicked() {
    if (!gameOver){
        tile = this;
        console.log(tile);
        // only do something when a tile_status is set to "hidden"
        if (tile.dataset.status==TILE_STATUS.H){
            if (mineLocationsList.includes(tile.id)){
                gameOverState();
            }
            else {
                revealTiles(tile);
            }
        }
    }
};

function flagClicked(evento) {
    if (!gameOver){
        evento.preventDefault();
        tile = this;
    
        if (tile.dataset.status==TILE_STATUS.H){
            console.log("marking tile");
            tile.dataset.status = TILE_STATUS.M;
            tile.innerText = "🏁";
        }
        else if (tile.dataset.status==TILE_STATUS.M){
            console.log("unmarking tile");
            tile.dataset.status = TILE_STATUS.H;
            tile.innerText = "";
        }
    }
}

// tile reveal function
function revealTiles(tile){

    // Obviously don't reveal it if it's a mine
    if (checkTileForMine(tile.dataset.xCord, tile.dataset.yCord)){
        return;
    }
    
    // Reveal only this tile if it's adjacent to a mine
    numAdjacentMines = adjacentMinesExist(tile);
    if (numAdjacentMines>0){
        tile.dataset.status = TILE_STATUS.R;
        tile.innerText = numAdjacentMines;
        return;
    }

    // Otherwise, reveal adjacent
    else if (numAdjacentMines==0){
        tile.dataset.status = TILE_STATUS.R;
        
        // Reveal tiles within 3x3 boundary, capped at the board limit
        const xlower = Math.max(tile.dataset.xCord - 1, 0)
        const xupper = Math.min(tile.dataset.xCord + 1, numXs - 1);
        const ylower = Math.max(tile.dataset.yCord - 1, 0)
        const yupper = Math.min(tile.dataset.yCord + 1, numYs - 1);

        for (let xi = xlower; xi <= xupper; xi++) {
            for (let yi = ylower; yi <= yupper; yi++){
                tileToReveal = board[yi][xi]
                // Only reveal tiles that are hidden (prevents infinite recursion)
                if (tileToReveal.dataset.status == TILE_STATUS.H){
                    revealTiles(board[yi][xi])
                }
            }
        }
    }

    // TO WRITE: go through process of revealing tiles.
    // Recursive, so it keeps revealing until...
    //      a. the tile we clicked on is adjacent to a mine.
    //      b. the adjacent tiles are all adjacent to mines.
    //      c. there are no more tiles to reveal because they either have all been revealed, or we reached the border of the grid where no tiles exist.
    
}

// Checks if adjacent tiles have mines. Returns number of adjacent mines that exist.
function adjacentMinesExist(tile){
    numBombs = 0;
    x = parseInt(tile.dataset.xCord);
    y = parseInt(tile.dataset.yCord);

    // TOP TILES
    numBombs += checkTileForMine(x-1,y-1);
    numBombs += checkTileForMine(x,y-1);
    numBombs += checkTileForMine(x+1,y-1);

    // SIDE TILES
    numBombs += checkTileForMine(x-1,y);
    numBombs += checkTileForMine(x+1,y);

    // BOTTOM TILES
    numBombs += checkTileForMine(x-1,y+1);
    numBombs += checkTileForMine(x,y+1);
    numBombs += checkTileForMine(x+1,y+1);
    
    console.log(numBombs);

    return numBombs;

}

// check if a mine exists at a specific tile
function checkTileForMine(X,Y){
    if (tileDoesExist(X,Y)) {
        // tile exists
        if (mineLocationsList.includes(X.toString()+"-"+Y.toString())){
            return 1; // tile is a mine
        }
        else {
            return 0; // tile is a blank
        }
    }
    else {
        // tile doesn't exist
        return 0;
    }
}

// check if a specific tile exists on the board
function tileDoesExist(X,Y){
    console.log("Checking if theres a tile at",X,"-",Y);
    if (X>=0 && X<numXs && Y>=0 && Y<numYs){
        return true;
    }
    else {
        return false;
    }
}

// game over function: reveals where all the mines are
function gameOverState() {
    gameOver = true;
    console.log("GAME OVER");
    for (let x=0; x<numXs; x++){
        for (let y=0; y<numYs; y++){
            let tile = board[y][x];
            if (mineLocationsList.includes(x.toString()+"-"+y.toString())){
                tile.dataset.status = TILE_STATUS.B;
                tile.innerText = "💣";
            }
        }
    }
}