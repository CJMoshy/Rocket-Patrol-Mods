// created by cj moshy 1/13/2024
// cmpm 120

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [Menu,Play]
}

let game = new Phaser.Game(config) //call phaser main class

//set UI
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3

//reserve keyboard bindings
let keyFIRE, keyRESET, keyLEFT, keyRIGHT, keyStart
