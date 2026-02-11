import {labelBoard, colourBoard, pieceSetup, loadBackgrounds} from "./board"
import {canRookMove, canBishopMove, canQueenMove, canKnightMove, canKingMove, canPawnMove, canPieceMove } from "./rules"

let board = new Grid(8, 8, 350, 40, 500, 500)
let backgrounds: Grid = loadBackgrounds()

colourBoard(board)
pieceSetup(board)

async function promotePawn(dropCell: any, selectedTag: any) {
    // Check if it's a pawn
    if (selectedTag.piece !== "pawn") {
        return  // Not a pawn, do nothing
    }
    
    // White pawn reaches row 0
    if (selectedTag.player === "white" && dropCell.row === 0) {
        let choice = await read("Promote to: queen, rook, knight, or bishop?")
        if (choice === "queen") {
            let whiteQueen = await fetchImage("chess/white_queen.png")
            dropCell.image = whiteQueen
            dropCell.tag = {player: "white", piece: "queen"}
        } else if (choice === "rook") {
            let whiteRook = await fetchImage("chess/white_rook.png")
            dropCell.image = whiteRook
            dropCell.tag = {player: "white", piece: "rook"}
        } else if (choice === "knight") {
            let whiteKnight = await fetchImage("chess/white_knight.png")
            dropCell.image = whiteKnight
            dropCell.tag = {player: "white", piece: "knight"}
        } else if (choice === "bishop") {
            let whiteBishop = await fetchImage("chess/white_bishop.png")
            dropCell.image = whiteBishop
            dropCell.tag = {player: "white", piece: "bishop"}
        } else {
            // Default to queen if invalid input
            let whiteQueen = await fetchImage("chess/white_queen.png")
            dropCell.image = whiteQueen
            dropCell.tag = {player: "white", piece: "queen"}
        }
    }
    
    // Black pawn reaches row 7
    if (selectedTag.player === "black" && dropCell.row === 7) {
        let choice = await read("Promote to: queen, rook, knight, or bishop?")

        if (choice === "queen") {
            let blackQueen = await fetchImage("chess/black_queen.png")
            dropCell.image = blackQueen
            dropCell.tag = {player: "black", piece: "queen"}
        } else if (choice === "rook") {
            let blackRook = await fetchImage("chess/black_rook.png")
            dropCell.image = blackRook
            dropCell.tag = {player: "black", piece: "rook"}
        } else if (choice === "knight") {
            let blackKnight = await fetchImage("chess/black_knight.png")
            dropCell.image = blackKnight
            dropCell.tag = {player: "black", piece: "knight"}
        } else if (choice === "bishop") {
            let blackBishop = await fetchImage("chess/black_bishop.png")
            dropCell.image = blackBishop
            dropCell.tag = {player: "black", piece: "bishop"}
        } else {
            // Default to queen if invalid input
            let blackQueen = await fetchImage("chess/black_queen.png")
            dropCell.image = blackQueen
            dropCell.tag = {player: "black", piece: "queen"}
        }
    }
}

// Game logic

let selectedCell: any = null
let selectedPiece: any = null
let selectedTag: any = null
let originalColor: string = ""
let dragging = false

let selectedBackground: any = null
let selectedColour: any = "white"

//Turn managment
let currentPlayer = "white" 
update = async () => {
    clear()
    board.draw()
    labelBoard()
    loadBackgrounds()
    rectangle(1, 1, W, H, selectedColour)

    // Picking background
    if (mouse.left) {
        selectedBackground = backgrounds.cellFromPoint(mouse.x, mouse.y)
        if (selectedBackground) {
            selectedColour = selectedBackground.color
            rectangle(1, 1, W, H, "selecetdColour")
        }
    }

    board.draw()
    labelBoard()
    loadBackgrounds()

    // Start dragging
    if (mouse.left && !dragging) {
        let clickedCell = board.cellFromPoint(mouse.x, mouse.y)
        if (clickedCell && clickedCell.image && clickedCell.tag){
            if (clickedCell.tag.player !== currentPlayer){
                text("It's " + currentPlayer+ "'s turn!!",20, 110, 26, "#913F74")
                return}
            }

        if (clickedCell && clickedCell.image) {
            selectedCell = clickedCell
            selectedPiece = clickedCell.image
            selectedTag = clickedCell.tag
            originalColor = clickedCell.color!
            dragging = true
            
            selectedCell.color = "grey"  // Highlight selected cell
            selectedCell.image = null
        }
    }
    
    // Draw while dragging
    if (dragging && selectedPiece) {
        let dragX = mouse.x - 31
        let dragY = mouse.y - 31
        ctx.drawImage(selectedPiece, dragX, dragY, 62, 62)
    }
    
    // Drop the piece
    if (!mouse.left && dragging) {
        let dropCell = board.cellFromPoint(mouse.x, mouse.y)
        
        if (dropCell && canPieceMove(selectedCell, dropCell)) {
            // Valid move
            dropCell.image = selectedPiece
            dropCell.tag = selectedTag
            selectedCell.tag = null

            await promotePawn(dropCell, selectedTag)
            
            if(currentPlayer === "white"){
                currentPlayer = "black"
            }else{
                currentPlayer = "white"
            }
        } else {
            // Invalid move - move back
            selectedCell.image = selectedPiece
        }
        console.log (board.cell(1,1).image)

        // Reset colour
        if (selectedCell != null) {
            selectedCell.color = originalColor
        }
        // Reset
        dragging = false
        selectedCell = null
        selectedPiece = null
        selectedTag = null
    }
    
}

