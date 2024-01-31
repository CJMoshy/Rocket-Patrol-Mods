// CJ Moshy
// Rocket Patrol: The Universe Expanded
//5 hours
//persistant highscore (1pt)
//speed increase after 30 seconds (1pt)
//random spaceship movement direction at start of each round (1pt)
//controlable rocket after fired (1pt)
//time remaning in seconds on screen (3pts)
//new enmemy spaceship with new art, smaller, moves faster, worth more points (5pts)
//alternating 2 player mode (5pts)
//phasers particle emitter used to make particle explosion on impact (5pts)

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
