import "./app2"

let board= new Grid(8, 8, 350, 40, 500, 500)

for (let i=65; i<=72; i++) {
    let x = i-65
    text(String.fromCharCode(i), 374+x*62, 35, 25)
}

for ( let i=0; i<8; i++) {
    text (i+1, 332, 76+i*63, 25)
}

for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++ ) {
        if ((i + j) % 2 === 0) {
            board.cell(i,j).color = "black"
        }
        else {
            board.cell(i,j).color = "white"
        }
    }
}

