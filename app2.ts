import "./app"
let selectedCell = null
let selectedPiece = null
let dragging = false
let dragX = 0
let dragY = 0
let board= new Grid(8, 8, 350, 40, 500, 500)
update = () => {
    clear() 
    board.draw()
    
    
    // börja draga
    if (mouse.left && !dragging) {
        let clickedCell = board.cellFromPoint(mouse.x, mouse.y)
        if (clickedCell && clickedCell.image) {
            selectedCell = clickedCell
            selectedPiece = clickedCell.image
            dragging = true
            selectedCell.tag = selectedCell.color
            selectedCell.color = "grey"
            selectedCell.image = null
        }
    }
    
    // Rita bilden vid draging
    if (dragging && selectedPiece) {
        dragX = mouse.x - 31  
        dragY = mouse.y - 31
        ctx.drawImage(selectedPiece, dragX, dragY, 62, 62)
    }
    
    // Sätt ner bilden
    if (!mouse.left && dragging) {
        let dropCell = board.cellFromPoint(mouse.x, mouse.y)
        
        if (dropCell) {
            dropCell.image = selectedPiece
        } else {
            selectedCell.image = selectedPiece
        }
        
        // till og färg
        selectedCell.color = selectedCell.tag
        
        // Resetta
        dragging = false
        selectedCell = null
        selectedPiece = null
    }
}
