
import "./app2"

let board = new Grid(8, 8, 350, 40, 500, 500)

// Color the board
for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
        if ((i + j) % 2 === 0) {
            board.cell(i, j).color = "pink"
        } else {
            board.cell(i, j).color = "white"
        }
    }
}

// SETUP BLACK PIECES 
let black_rook = await fetchImage("chess/black_rook.png")
board.cell(0, 0).image = black_rook
board.cell(0, 0).tag = { player: "black", piece: "rook" }
board.cell(0, 7).image = black_rook
board.cell(0, 7).tag = { player: "black", piece: "rook" }

let black_knight = await fetchImage("chess/black_knight.png")
board.cell(0, 1).image = black_knight
board.cell(0, 1).tag = { player: "black", piece: "knight" }
board.cell(0, 6).image = black_knight
board.cell(0, 6).tag = { player: "black", piece: "knight" }

let black_bishop = await fetchImage("chess/black_bishop.png")
board.cell(0, 2).image = black_bishop
board.cell(0, 2).tag = { player: "black", piece: "bishop" }
board.cell(0, 5).image = black_bishop
board.cell(0, 5).tag = { player: "black", piece: "bishop" }

let black_king = await fetchImage("chess/black_king.png")
board.cell(0, 4).image = black_king
board.cell(0, 4).tag = { player: "black", piece: "king" }

let black_queen = await fetchImage("chess/black_queen.png")
board.cell(0, 3).image = black_queen
board.cell(0, 3).tag = { player: "black", piece: "queen" }

//SETUP WHITE PIECES 
let white_rook = await fetchImage("chess/white_rook.png")
board.cell(7, 0).image = white_rook
board.cell(7, 0).tag = { player: "white", piece: "rook" }
board.cell(7, 7).image = white_rook
board.cell(7, 7).tag = { player: "white", piece: "rook" }

let white_knight = await fetchImage("chess/white_knight.png")
board.cell(7, 1).image = white_knight
board.cell(7, 1).tag = { player: "white", piece: "knight" }
board.cell(7, 6).image = white_knight
board.cell(7, 6).tag = { player: "white", piece: "knight" }

let white_bishop = await fetchImage("chess/white_bishop.png")
board.cell(7, 2).image = white_bishop
board.cell(7, 2).tag = { player: "white", piece: "bishop" }
board.cell(7, 5).image = white_bishop
board.cell(7, 5).tag = { player: "white", piece: "bishop" }

let white_king = await fetchImage("chess/white_king.png")
board.cell(7, 4).image = white_king
board.cell(7, 4).tag = { player: "white", piece: "king" }

let white_queen = await fetchImage("chess/white_queen.png")
board.cell(7, 3).image = white_queen
board.cell(7, 3).tag = { player: "white", piece: "queen" }

//  SETUP PAWNS 
let black_pawn = await fetchImage("chess/black_pawn.png")
for (let i = 0; i < 8; i++) {
    board.cell(1, i).image = black_pawn
    board.cell(1, i).tag = { player: "black", piece: "pawn" }
}

let white_pawn = await fetchImage("chess/white_pawn.png")
for (let i = 0; i < 8; i++) {
    board.cell(6, i).image = white_pawn
    board.cell(6, i).tag = { player: "white", piece: "pawn" }
}


//MOVEMENT RULES 

function kanTornetFlytta(från: any, till: any): boolean {
    let frånRad = från.row
    let frånKol = från.column
    let tillRad = till.row
    let tillKol = till.column
    
    // Måste gå rakt 
    if (frånRad !== tillRad && frånKol !== tillKol) {
        return false
    }
    
    // Kan inte ta egen pjäs
    if (till.tag && till.tag.player === från.tag.player) {
        return false
    }
    
    // Vägen måste vara fri
    if (frånRad === tillRad) {
        // Går horisontellt
        let start = Math.min(frånKol, tillKol) + 1
        let slut = Math.max(frånKol, tillKol)
        for (let k = start; k < slut; k++) {
            if (board.cell(frånRad, k).image) return false
        }
    } else {
        // Går vertikalt
        let start = Math.min(frånRad, tillRad) + 1
        let slut = Math.max(frånRad, tillRad)
        for (let r = start; r < slut; r++) {
            if (board.cell(r, frånKol).image) return false
        }
    }
    
    return true
}

function kanLöparenFlytta(från: any, till: any): boolean {
    let frånRad = från.row
    let frånKol = från.column
    let tillRad = till.row
    let tillKol = till.column
    
    // Regel 1: Måste gå diagonalt
    let radSkillnad = Math.abs(tillRad - frånRad)
    let kolSkillnad = Math.abs(tillKol - frånKol)
    
    if (radSkillnad !== kolSkillnad) {
        return false
    }
    
    // Regl 2: Kan inte ta egen pjäs
    if (till.tag && till.tag.player === från.tag.player) {
        return false
    }
    
    // Regel 3: Vägen måste vara fri
    let radRiktning = tillRad > frånRad ? 1 : -1
    let kolRiktning = tillKol > frånKol ? 1 : -1
    
    let r = frånRad + radRiktning
    let k = frånKol + kolRiktning
    
    while (r !== tillRad && k !== tillKol) {
        if (board.cell(r, k).image) return false
        r += radRiktning
        k += kolRiktning
    }
    
    return true
}

function kanDrottningenFlytta(från: any, till: any): boolean {
    return kanTornetFlytta(från, till) || kanLöparenFlytta(från, till)
}

function kanSpringarenFlytta(från: any, till: any): boolean {
    let frånRad = från.row
    let frånKol = från.column
    let tillRad = till.row
    let tillKol = till.column
    
    let radSkillnad = Math.abs(tillRad - frånRad)
    let kolSkillnad = Math.abs(tillKol - frånKol)
    
    let ärLForm = (radSkillnad === 2 && kolSkillnad === 1) || 
                  (radSkillnad === 1 && kolSkillnad === 2)
    
    if (!ärLForm) {
        return false
    }
    
    if (till.tag && till.tag.player === från.tag.player) {
        return false
    }
    
    return true
}

function kanKungenFlytta(från: any, till: any): boolean {
    let frånRad = från.row
    let frånKol = från.column
    let tillRad = till.row
    let tillKol = till.column
    
    let radSkillnad = Math.abs(tillRad - frånRad)
    let kolSkillnad = Math.abs(tillKol - frånKol)
    
    if (radSkillnad > 1 || kolSkillnad > 1) {
        return false
    }
    
    if (till.tag && till.tag.player === från.tag.player) {
        return false
    }
    
    return true
}

function kanBondenFlytta(från: any, till: any): boolean {
    let frånRad = från.row
    let frånKol = från.column
    let tillRad = till.row
    let tillKol = till.column
    
    let färg = från.tag.player
    let riktning = färg === "white" ? -1 : 1
    
    // Går rakt framåt 1 steg
    if (frånKol === tillKol && tillRad === frånRad + riktning) {
        if (till.image) return false
        return true
    }
    
    // Går rakt framåt 2 steg (första draget)
    let startRad = färg === "white" ? 6 : 1
    if (frånRad === startRad && frånKol === tillKol && tillRad === frånRad + 2 * riktning) {
        if (till.image) return false
        if (board.cell(frånRad + riktning, frånKol).image) return false
        return true
    }
    
    // Tar diagonalt
    if (Math.abs(tillKol - frånKol) === 1 && tillRad === frånRad + riktning) {
        if (till.tag && till.tag.player !== färg && till.image) {
            return true
        }
        return false
    }
    
    return false
}

function kanPjäsenFlytta(från: any, till: any): boolean {
    if (!från.tag || !från.tag.piece) {
        return false
    }
    
    let typ = från.tag.piece
    
    if (typ === "rook") {
        return kanTornetFlytta(från, till)
    } else if (typ === "bishop") {
        return kanLöparenFlytta(från, till)
    } else if (typ === "queen") {
        return kanDrottningenFlytta(från, till)
    } else if (typ === "knight") {
        return kanSpringarenFlytta(från, till)
    } else if (typ === "king") {
        return kanKungenFlytta(från, till)
    } else if (typ === "pawn") {
        return kanBondenFlytta(från, till)
    }
    
    return false
}


// GAME LOGIC

let selectedCell: any = null
let selectedPiece: any = null
let selectedTag: any = null
let originalColor: string = ""
let dragging = false

update = () => {
    clear()
    board.draw()
    // Draw column labels (A-H)
for (let i = 65; i <= 72; i++) {
    let x = i - 65
    text(String.fromCharCode(i), 374 + x * 62, 35, 25)
}

// Draw row labels (1-8)
for (let i = 0; i < 8; i++) {
    text(i + 1, 332, 76 + i * 63, 25)
}
    
    // Börja draga
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
    
    // Rita bilden vid dragging
    if (dragging && selectedPiece) {
        let dragX = mouse.x - 31
        let dragY = mouse.y - 31
        ctx.drawImage(selectedPiece, dragX, dragY, 62, 62)
    }
    
    // Släpp pjäsen
    if (!mouse.left && dragging) {
        let dropCell = board.cellFromPoint(mouse.x, mouse.y)
        
        if (dropCell && kanPjäsenFlytta(selectedCell, dropCell)) {
            // Giltig flytt:)
            dropCell.image = selectedPiece
            dropCell.tag = selectedTag
            selectedCell.tag = null
        } else {
            // Ogiltig flytt - flytta tillbaka
            selectedCell.image = selectedPiece
        }
        
        // Återställ färg
        selectedCell.color = originalColor
        
        // Resetta
        dragging = false
        selectedCell = null
        selectedPiece = null
        selectedTag = null
    }
}