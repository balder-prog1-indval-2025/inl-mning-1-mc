import { getBoard, pieceSetup } from "./board"

let board = getBoard()
pieceSetup(board)

/**
 * Allows the rook to move if the move is straight,
 * there is no piece from its side on the position and there is no piece in the way.
 * @param from the current position of the piece
 * @param to the position that it is trying to move to
 * @returns true if it can go
 */
export function canRookMove(from: any, to: any): boolean {
    let fromRow = from.row
    let fromColumn = from.column
    let toRow = to.row
    let toColumn = to.column
    
    // Go straight
    if (fromRow!== toRow && fromColumn !== toColumn) {
        return false
    }
    
    // Can not take own pieces
    if (to.tag && to.tag.player === from.tag.player) {
        return false
    }
    
    // The way must be empty   
    if (fromRow === toRow) {
        // Go horisontally
        let start = Math.min(fromColumn, toColumn) + 1
        let end = Math.max(fromColumn, toColumn)
        for (let k = start; k < end; k++) {
            if (board.cell(fromRow, k).image) return false
        }
    } else {
        // Go vertically
        let start = Math.min(fromRow, toRow) + 1
        let end = Math.max(fromRow, toRow)
        for (let r = start; r < end; r++) {
            if (board.cell(r, fromColumn).image) return false
        }
    }
    
    return true
}

/**
 * Allows the bishop to move if the move is diagonal, 
 * there is no piece from its side on the position and there is no piece in the way.
 * @param from the current position of the piece
 * @param to the position that it is trying to move to
 * @returns true if it can go
 */
export function canBishopMove(from: any, to: any): boolean {
    let fromRow = from.row
    let fromColumn = from.column
    let toRow = to.row
    let toColumn = to.column
    
    // Go diagonally
    let rowDifference = Math.abs(toRow - fromRow)
    let columnDifference = Math.abs(toColumn - fromColumn)
    
    if (rowDifference !== columnDifference) {
        return false
    }
    
    // Can not take own pieces
    if (to.tag && to.tag.player === from.tag.player) {
        return false
    }
    
    // The way must be empty
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

/**
 * Allows the queen to move if the move is straight or diagonal,
 * there is no piece in the way and there is no piece from its side on the position.
 * @param from the current position of the piece
 * @param to the position that it is trying to move to
 * @returns true if it can go
 */
export function canQueenMove(from: any, to: any): boolean {
    return canRookMove(from, to) || canBishopMove(from, to)
}

/**
 * Allows the knight to move if the move is L-shaped and 
 * there is no piece from its side on the position.
 * @param from the current position of the piece
 * @param to the position that it is trying to move to
 * @returns true if it can go
 */
export function canKnightMove(from: any, to: any): boolean {
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
   
/**
 * Allows the king to move if the move is one tile to any side and
 * there is no piece from its side on the position.
 * @param from the current position of the piece
 * @param to the position that it is trying to move to
 * @returns true if it can go
 */
export function canKingMove(from: any, to: any): boolean {
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

/**
 * Allows the pawn to move if the move is straight forward one tile or 2 tiles on first move,
 * or it is taking a piece diagonally.
 * @param from the current position of the piece
 * @param to the position that it is trying to move to
 * @returns true if it can go
 */
export function canPawnMove(from: any, to: any): boolean {
    let fromRow = from.row
    let fromColumn = from.column
    let toRow = to.row
    let toColumn = to.column
    
    let color = from.tag.player
    let direction = color === "white" ? -1 : 1
    
    // Go straight in column
    if (fromColumn === toColumn && toRow === fromRow + direction) {
        if (to.image) return false
        return true
    }
    
    // Go straight forward 2 tiles (first move)
    let startRow = color === "white" ? 6 : 1
    if (fromRow === startRow && fromColumn === toColumn && toRow === fromRow + 2 * direction) {
        if (to.image) return false
        if (board.cell(fromRow + direction, fromColumn).image) return false
        return true
    }
    
    // Take diagonally
    if (Math.abs(toColumn - fromColumn) === 1 && toRow === fromRow + direction) {
        if (to.tag && to.tag.player !== color && to.image) {
            return true
        }
        return false
    }

    return false
}

/**
 * Checks if the move is valid. The piece must move according to its type.
 * There must be a piece.
 * @param from the current position of the piece
 * @param to the position that it is trying to move to
 * @returns returns false if piece can not move
 */
export function canPieceMove(from: any, to: any): boolean {
    if (!from.tag || !from.tag.piece) {
        return false
    }
    
    let type = from.tag.piece
    
    if (type === "rook") {
        return canRookMove(from, to)
    } else if (type === "bishop") {
        return canBishopMove(from, to)
    } else if (type === "queen") {
        return canQueenMove(from, to)
    } else if (type === "knight") {
        return canKnightMove(from, to)
    } else if (type === "king") {
        return canKingMove(from, to)
    } else if (type === "pawn") {
        return canPawnMove(from, to)
    }
    
    return false
}

export function isKingInCheck(player) {
    let king = null

    // Find the king
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            let cell = board.cell(r, c)
            if (cell.tag && cell.tag.player === player && cell.tag.piece === "king") {
                king = cell
            }
        }
    }

    if (!king) return false

    let kr = king.row
    let kc = king.column

    // Knight attacks
    const knightMoves = [
        [2,1],[2,-1],[-2,1],[-2,-1],
        [1,2],[1,-2],[-1,2],[-1,-2]
    ]
    for (let [dr, dc] of knightMoves) {
        let r = kr + dr, c = kc + dc
        if (r>=0 && r<8 && c>=0 && c<8) {
            let cell = board.cell(r,c)
            if (cell.tag && cell.tag.player !== player && cell.tag.piece === "knight") {
                return true
            }
        }
    }

    // Pawn attacks
    let direction = player === "white" ? -1 : 1
    for (let dc of [-1, 1]) {
        let r = kr + direction
        let c = kc + dc
        if (r>=0 && r<8 && c>=0 && c<8) {
            let cell = board.cell(r,c)
            if (cell.tag && cell.tag.player !== player && cell.tag.piece === "pawn") {
                return true
            }
        }
    }

    // King adjacency
    for (let dr=-1; dr<=1; dr++) {
        for (let dc=-1; dc<=1; dc++) {
            if (dr===0 && dc===0) continue
            let r = kr+dr, c = kc+dc
            if (r>=0 && r<8 && c>=0 && c<8) {
                let cell = board.cell(r,c)
                if (cell.tag && cell.tag.player !== player && cell.tag.piece === "king") {
                    return true
                }
            }
        }
    }

    // Rook / Queen lines
    const rookDirs = [[1,0],[-1,0],[0,1],[0,-1]]
    for (let [dr,dc] of rookDirs) {
        let r = kr+dr, c = kc+dc
        while (r>=0 && r<8 && c>=0 && c<8) {
            let cell = board.cell(r,c)
            if (cell.tag) {
                if (cell.tag.player !== player &&
                    (cell.tag.piece === "rook" || cell.tag.piece === "queen")) {
                    return true
                }
                break
            }
            r+=dr; c+=dc
        }
    }

    // Bishop / Queen diagonals
    const bishopDirs = [[1,1],[1,-1],[-1,1],[-1,-1]]
    for (let [dr,dc] of bishopDirs) {
        let r = kr+dr, c = kc+dc
        while (r>=0 && r<8 && c>=0 && c<8) {
            let cell = board.cell(r,c)
            if (cell.tag) {
                if (cell.tag.player !== player &&
                    (cell.tag.piece === "bishop" || cell.tag.piece === "queen")) {
                    return true
                }
                break
            }
            r+=dr; c+=dc
        }
    }

    return false
}

export function hasLegalMove(player) {
    let board = getBoard()

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {

            let from = board.cell(r, c)

            if (from.tag && from.tag.player === player) {

                for (let r2 = 0; r2 < 8; r2++) {
                    for (let c2 = 0; c2 < 8; c2++) {

                        let to = board.cell(r2, c2)

                        if (canPieceMove(from, to)) {

                            // Simulate move
                            let oldToImage = to.image
                            let oldToTag = to.tag
                            let oldFromImage = from.image
                            let oldFromTag = from.tag

                            to.image = oldFromImage
                            to.tag = oldFromTag
                            from.image = null
                            from.tag = null

                            let legal = !isKingInCheck(player)

                            // Undo
                            to.image = oldToImage
                            to.tag = oldToTag
                            from.image = oldFromImage
                            from.tag = oldFromTag

                            if (legal) return true
                        }
                    }
                }
            }
        }
    }

    return false
}

function isInsufficientMaterial(board) {
    let pieces = []

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const cell = board.cell(r, c)
            if (cell.tag) pieces.push(cell.tag)
        }
    }

    // Only kings
    if (pieces.length === 2) return true

    // King + minor piece vs King
    if (pieces.length === 3) {
        return pieces.some(p => p.piece === "bishop" || p.piece === "knight")
    }

    // King + bishop vs King + bishop (same color squares)
    if (pieces.length === 4) {
        const bishops = pieces.filter(p => p.piece === "bishop")
        if (bishops.length === 2) {
            const colors = bishops.map(b => (b.squareColor)) // you must track this
            return colors[0] === colors[1]
        }
    }

    return false
}


export function checkForWinner(player: "white" | "black") {
    const opponent = player === "white" ? "black" : "white"
    let gameOver = false

    const kingInCheck = isKingInCheck(player)
    const legalMovesExist = hasLegalMove(player)

    // Checkmate
    if (kingInCheck && !legalMovesExist) {
        clear()
        text("CHECKMATE!", 360, 275, 90, "#D64279")
        text(opponent.toUpperCase() + " WINS 🤩", 360, 355, 90, "#D64279")
        gameOver = true
        return "checkmate"
    }

    // Stalemate
    if (!kingInCheck && !legalMovesExist) {
        clear()
        text("STALEMATE — DRAW!", 360, 300, 60, "#D64279")
        gameOver = true
        return "stalemate"
    }

    return null
}
