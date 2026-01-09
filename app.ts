import "./app2"

let board = new Grid(8, 8, 350, 40, 500, 500)

for (let i = 65; i <= 72; i++) {
    let x = i - 65
    text(String.fromCharCode(i), 374+x*62, 35, 25)
}

for ( let i = 0; i < 8; i++) {
    text (i+1, 332, 76+i*63, 25)
}

for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++ ) {
        if ((i + j) % 2 === 0) {
            board.cell(i,j).color = "white"
        }
        else {
            board.cell(i,j).color = "pink"
        }
    }
}


let black_rook = await fetchImage("chess/black_rook.png")
board.cell(0,0).image = black_rook
board.cell(0,0).tag = {
    "player": "black",
    "piece": "rook"
}
board.cell(0,7).image = black_rook
board.cell(0,7).tag = {
    "player": "black",
    "piece": "rook"
}

let black_knight = await fetchImage("chess/black_knight.png")
board.cell(0,1).image = black_knight
board.cell(0,1).tag = {
    "player": "black",
    "piece": "knight"
}
board.cell(0,6).image = black_knight
board.cell(0,6).tag = {
    "player": "black",
    "piece": "knight"
}

let black_bishop = await fetchImage("chess/black_bishop.png")
board.cell(0,2).image = black_bishop
board.cell(0,2).tag = {
    "player": "black",
    "piece": "bishop"
}
board.cell(0,5).image = black_bishop
board.cell(0,5).tag = {
    "player": "black",
    "piece": "bishop"
}

let black_king = await fetchImage("chess/black_king.png")
board.cell(0,3).image = black_king
board.cell(0,3).tag = {
    "player": "black",
    "piece": "king"
}

let black_queen = await fetchImage("chess/black_queen.png")
board.cell(0,4).image = black_queen
board.cell(0,4).tag = {
    "player": "black",
    "piece": "queen"
}

let white_rook = await fetchImage("chess/white_rook.png")
board.cell(7,0).image = white_rook
board.cell(7,0).tag = {
    "player": "white",
    "piece": "rook"
}
board.cell(7,7).image = white_rook
board.cell(7,7).tag = {
    "player": "white",
    "piece": "rook"
}

let white_knight = await fetchImage("chess/white_knight.png")
board.cell(7,1).image = white_knight
board.cell(7,1).tag = {
    "player": "white",
    "piece": "knight"
}
board.cell(7,6).image = white_knight
board.cell(7,6).tag = {
    "player": "white",
    "piece": "knight"
}

let white_bishop = await fetchImage("chess/white_bishop.png")
board.cell(7,2).image = white_bishop
board.cell(7,2).tag = {
    "player": "white",
    "piece": "bishop"
}
board.cell(7,5).image = white_bishop
board.cell(7,5).tag = {
    "player": "white",
    "piece": "bishop"
}

let white_king = await fetchImage("chess/white_king.png")
board.cell(7,3).image = white_king
board.cell(0,0).tag = {
    "player": "white",
    "piece": "king"
}

let white_queen = await fetchImage("chess/white_queen.png")
board.cell(7,4).image = white_queen
board.cell(0,0).tag = {
    "player": "white",
    "piece": "queen"
}

let black_pawn = await fetchImage("chess/black_pawn.png")
for (let i = 0; i < 8; i++) {
    board.cell(1,i).image = black_pawn
    board.cell(0,0).tag = {
        "player": "black",
        "piece": "pawn"
    }
}

let white_pawn = await fetchImage("chess/white_pawn.png")
for (let i = 0; i < 8; i++) {
    board.cell(6,i).image = white_pawn
    board.cell(0,0).tag = {
        "player": "white",
        "piece": "pawn"
    }
}


