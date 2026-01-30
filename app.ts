import { labelBoard, colourBoard, pieceSetup, loadBackgrounds} from "./app2"

let board = new Grid(8, 8, 350, 40, 500, 500)
let backgrounds: Grid = loadBackgrounds()

colourBoard(board)
pieceSetup(board)

// Movement rules

function canRookMove(from: any, to: any): boolean {
    let fromRow = from.row
    let fromColumn = from.column
    let toRow = to.row
    let toColumn = to.column
    
    // Must go straight
    if (fromRow!== toRow && fromColumn !== toColumn) {
        return false
    }
    
    // Can not take own pieces
    if (to.tag && to.tag.player === from.tag.player) {
        return false
    }
    
    // The way must be empty
    if (fromRow === toRow) {
        // Goes horisontally
        let start = Math.min(fromColumn, toColumn) + 1
        let slut = Math.max(fromColumn, toColumn)
        for (let k = start; k < slut; k++) {
            if (board.cell(fromRow, k).image) return false
        }
    } else {
        // Goes vertically
        let start = Math.min(fromRow, toRow) + 1
        let slut = Math.max(fromRow, toRow)
        for (let r = start; r < slut; r++) {
            if (board.cell(r, fromColumn).image) return false
        }
    }
    
    return true
}

function canBishopMove(from: any, to: any): boolean {
    let fromRow = from.row
    let fromColumn = from.column
    let toRow = to.row
    let toColumn = to.column
    
    // Has to go diagonal
    let rowDifference = Math.abs(toRow - fromRow)
    let columnDifference = Math.abs(toColumn - fromColumn)
    
    if (rowDifference !== columnDifference) {
        return false
    }
    
    // Can not take own pieces
    if (to.tag && to.tag.player === from.tag.player) {
        return false
    }
    
    // The way must be ampty
    let rowDirection = toRow > fromRow ? 1 : -1
    let columnDirection = toColumn > fromColumn ? 1 : -1
    
    let r = fromRow + rowDirection
    let k = fromColumn + columnDirection
    
    while (r !== toRow && k !== toColumn) {
        if (board.cell(r, k).image) return false
        r += rowDirection
        k += columnDirection
    }
    
    return true
}

function canQueenMove(from: any, to: any): boolean {
    return canRookMove(from, to) || canBishopMove(from, to)
}

function canKnightMove(from: any, to: any): boolean {
    let fromRow = from.row
    let fromColumn = from.column
    let toRow = to.row
    let toColumn = to.column
   
    let rowDifference = Math.abs(toRow - fromRow)
    let columnDifference = Math.abs(toColumn - fromColumn)
   
    let isL = (rowDifference === 2 && columnDifference === 1) ||
                  (rowDifference === 1 && columnDifference === 2)
   
    if (!isL) {
        return false
    }
   
    if (to.tag && to.tag.player === from.tag.player) {
        return false
    }
   
    return true
}

function canKingMove(from: any, to: any): boolean {
    let fromRow = from.row
    let fromColumn = from.column
    let toRow = to.row
    let toColumn = to.column
    
    let rowDifference = Math.abs(toRow - fromRow)
    let columnDifference = Math.abs(toColumn - fromColumn)
     
    if (rowDifference > 1 || columnDifference > 1) {
        return false
    }
    
    if (to.tag && to.tag.player === from.tag.player) {
        return false
    }
    
    return true
}

function canPawnMove(from: any, to: any): boolean {
    let fromRow = from.row
    let fromColumn = from.column
    let toRow = to.row
    let toColumn = to.column
    
    let colour = from.tag.player
    let direction = colour === "white" ? -1 : 1
    
    // Go straight forward in column
    if (fromColumn === toColumn && toRow === fromRow + direction) {
        if (to.image) return false
        return true
    }
    
    // Go straight forward 2 tiles (first move)
    let startRow = colour === "white" ? 6 : 1
    if (fromRow === startRow && fromColumn === toColumn && toRow === fromRow + 2 * direction) {
        if (to.image) return false
        if (board.cell(fromRow + direction, fromColumn).image) return false
        return true
    }
    
    // Take diagonally
    if (Math.abs(toColumn - fromColumn) === 1 && toRow === fromRow + direction) {
        if (to.tag && to.tag.player !== colour && to.image) {
            return true
        }
        return false
    }
    
    return false
}

function canPieceMove(from: any, to: any): boolean {
    if (!from.tag || !from.tag.piece) {
        return false
    }
    
    let typ = from.tag.piece
    
    if (typ === "rook") {
        return canRookMove(from, to)
    } else if (typ === "bishop") {
        return canBishopMove(from, to)
    } else if (typ === "queen") {
        return canQueenMove(from, to)
    } else if (typ === "knight") {
        return canKnightMove(from, to)
    } else if (typ === "king") {
        return canKingMove(from, to)
    } else if (typ === "pawn") {
        return canPawnMove(from, to)
    }
    
    return false
}


// Game logic

let selectedCell: any = null
let selectedPiece: any = null
let selectedTag: any = null
let originalColor: string = ""
let dragging = false

let selectedBackground: any = null
let selectedColour: any = "white"

update = () => {
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
        } else {
            // Invalid move - move back
            selectedCell.image = selectedPiece
        }
        
        // Reset colour
        selectedCell.color = originalColor
        
        // Reset
        dragging = false
        selectedCell = null
        selectedPiece = null
        selectedTag = null
    }
    
    
}

