
let board = new Grid(8, 8, 350, 40, 500, 500)

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
        let end = Math.max(fromColumn, toColumn)
        for (let k = start; k < end; k++) {
            if (board.cell(fromRow, k).image) return false
        }
    } else {
        // Goes vertically
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
    
    // Go straight forward in column
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
    // If it comes to the end it can change piece
    //switch ku
    
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
