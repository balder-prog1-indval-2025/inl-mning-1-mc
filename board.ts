
export function labelBoard(): any{
    // Column labels (A-H)
    for (let i = 65; i <= 72; i++) {
        let x = i - 65
        text(String.fromCharCode(i), 374 + x * 62, 35, 25)
    }
    // Row labels (1-8)
    for (let i = 0; i < 8; i++) {
        text(i + 1, 332, 76 + i * 63, 25)
    }
}

export function colorBoard(board): any{
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if ((i + j) % 2 === 0) {
                board.cell(i, j).color = "pink"
           } else {
                board.cell(i, j).color = "white"
            }
        }
    }
    
}

export async function pieceSetup (board): Promise<void>{
    //White pieces setup
    let whiteRook = await fetchImage("chess/white_rook.png")
    board.cell(7, 0).image = whiteRook
    board.cell(7, 0).tag = { player: "white", piece: "rook" }
    board.cell(7, 7).image = whiteRook
    board.cell(7, 7).tag = { player: "white", piece: "rook" }

    let whiteKnight = await fetchImage("chess/white_knight.png")
    board.cell(7, 1).image = whiteKnight
    board.cell(7, 1).tag = { player: "white", piece: "knight" }
    board.cell(7, 6).image = whiteKnight
    board.cell(7, 6).tag = { player: "white", piece: "knight" }

    let whiteBishop = await fetchImage("chess/white_bishop.png")
    board.cell(7, 2).image = whiteBishop
    board.cell(7, 2).tag = { player: "white", piece: "bishop" }
    board.cell(7, 5).image = whiteBishop
    board.cell(7, 5).tag = { player: "white", piece: "bishop" }

    let whiteKing = await fetchImage("chess/white_king.png")
    board.cell(7, 4).image = whiteKing
    board.cell(7, 4).tag = { player: "white", piece: "king" }

    let whiteQueen = await fetchImage("chess/white_queen.png")
    board.cell(7, 3).image = whiteQueen
    board.cell(7, 3).tag = { player: "white", piece: "queen" }

    // Black pieces setup
    let blackRook = await fetchImage("chess/black_rook.png")
    board.cell(0, 0).image = blackRook
    board.cell(0, 0).tag = { player: "black", piece: "rook" }
    board.cell(0, 7).image = blackRook
    board.cell(0, 7).tag = { player: "black", piece: "rook" }

    let blackKnight = await fetchImage("chess/black_knight.png")
    board.cell(0, 1).image = blackKnight
    board.cell(0, 1).tag = { player: "black", piece: "knight" }
    board.cell(0, 6).image = blackKnight
    board.cell(0, 6).tag = { player: "black", piece: "knight" }

    let blackBishop = await fetchImage("chess/black_bishop.png")
    board.cell(0, 2).image = blackBishop
    board.cell(0, 2).tag = { player: "black", piece: "bishop" }
    board.cell(0, 5).image = blackBishop
    board.cell(0, 5).tag = { player: "black", piece: "bishop" }

    let blackKing = await fetchImage("chess/black_king.png")
    board.cell(0, 4).image = blackKing
    board.cell(0, 4).tag = { player: "black", piece: "king" }

    let blackQueen = await fetchImage("chess/black_queen.png")
    board.cell(0, 3).image = blackQueen
    board.cell(0, 3).tag = { player: "black", piece: "queen" }

    // Pawn setup
    let blackPawn = await fetchImage("chess/black_pawn.png")
    for (let i = 0; i < 8; i++) {
    board.cell(1, i).image = blackPawn
    board.cell(1, i).tag = { player: "black", piece: "pawn" }
    }

    let whitePawn = await fetchImage("chess/white_pawn.png")
        for (let i = 0; i < 8; i++) {
        board.cell(6, i).image = whitePawn
        board.cell(6, i).tag = { player: "white", piece: "pawn" }
    }
}

// Colors
let pink = "#f5d7e6"
let yellow = "#fcfcdc"
let green = "#d7f5df"
let cyan = "#d0f5f1"
let blue = "#cde1f7"
let lavender = "#ecdcfc"

export function loadBackgrounds (): Grid{
    let backgrounds = new Grid(7, 1, 1200, 40, 30, 120)
    backgrounds.cell(0, 0).color = pink
    backgrounds.cell(1, 0).color = yellow
    backgrounds.cell(2, 0).color = green
    backgrounds.cell(3, 0).color = cyan
    backgrounds.cell(4, 0).color = blue
    backgrounds.cell(5, 0).color = lavender
    backgrounds.cell(6, 0).color = "white"
    return backgrounds
}

