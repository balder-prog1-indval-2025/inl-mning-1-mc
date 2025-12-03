import "./app2"

new Grid(8, 8, 350, 40, 500, 500)

for (let i=65; i<=72; i++) {
    let x = i-65
    text(String.fromCharCode(i), 374+x*62, 35, 25)
}

for (let i=0; i<8; i++) {
    text(i+1, 330, 80+i*62, 25)
}


