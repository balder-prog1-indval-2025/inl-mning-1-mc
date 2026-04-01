import {getBoard, labelBoard, colorBoard, pieceSetup, loadBackgrounds} from "./board"
import {canRookMove, canBishopMove, canQueenMove, canKnightMove, canKingMove, canPawnMove, canPieceMove, isKingInCheck, checkForWinner } from "./rules"

let board = getBoard()
let backgrounds: Grid = loadBackgrounds()

colorBoard(board)
await pieceSetup(board)

async function promotePawn(dropCell, oldFromTag) {
     // Check if it's a pawn
     if (dropCell.tag.piece !== "pawn") { 
        return
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
let selectedColor: any = "white"

// Turn managment
let gameOver = false
let isPromoting = false
let currentPlayer: "white" | "black" = "white"
let gameMessage = ""

update = async () => {

    if (isPromoting) {
        return 
    }

    clear()
    board.draw()
    labelBoard()
    loadBackgrounds()
    rectangle(1, 1, W, H, selectedColor)
    
    if (gameMessage !== "") {
        text("Illegal move:", 20, 110, 26, "#913F74")
        text("king would be in check!", 20, 135, 26, "#913F74")
    }
    
    
    // Picking background
    if (mouse.left) {
        selectedBackground = backgrounds.cellFromPoint(mouse.x, mouse.y)
        if (selectedBackground) {
            selectedColor = selectedBackground.color
            rectangle(1, 1, W, H, "selecetdColor")
        }
    }

    board.draw()
    labelBoard()
    loadBackgrounds()

    // Start dragging
    if (mouse.left && !dragging) {
        gameMessage = ""
        let clickedCell = board.cellFromPoint(mouse.x, mouse.y)
        if (clickedCell && clickedCell.image && clickedCell.tag){
            // Turn reminder
            if (clickedCell.tag.player !== currentPlayer){
                text("It's " + currentPlayer+ "'s turn!!", 20, 110, 26, "#913F74")
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

            // Save old state
            let oldDropImage = dropCell.image
            let oldDropTag = dropCell.tag
            let oldFromImage = selectedPiece
            let oldFromTag = selectedTag
        
            // Make move temporarily
            dropCell.image = oldFromImage
            dropCell.tag = oldFromTag
            selectedCell.image = null
            selectedCell.tag = null
        
            // Check if king is in check
            if (isKingInCheck(currentPlayer)) {
        
                // Undo move
                dropCell.image = oldDropImage
                dropCell.tag = oldDropTag
                selectedCell.image = oldFromImage
                selectedCell.tag = oldFromTag
        
                gameMessage = "Illegal move: king would be in check!"
        
            } else {
        
                // Move is legal -->  promotion
                isPromoting = true
                await promotePawn(dropCell, oldFromTag)
                isPromoting = false
        
                // Switch turn
                currentPlayer = currentPlayer === "white" ? "black" : "white"
        
                // Checkmate / stalemate / king captured
                checkForWinner(currentPlayer)
            }
        
        } else {
            // Invalid move --> put piece back
            if (selectedCell) selectedCell.image = selectedPiece
        }
        
        // Reset color
        selectedCell.color = originalColor
        
        // Reset
        dragging = false
        selectedCell = null
        selectedPiece = null
        selectedTag = null
    }

    checkForWinner(currentPlayer)
}
