//Play.js

const STARFIELD_SCROLL_RATE = 1 // global const for tilesprite scroll rate

class Play extends Phaser.Scene {

    constructor(){
        super("playScene")
    }

    create() {

        //place tile sprite for scrolling background
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0,0)

        //green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0,0)

        //white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0)
        
        //add rocket
        this.p1Rocket = new Rocket(this, game.config.width / 2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0)

        //add spaceships (x3)
        this.ship_01 = new Spaceship(this, game.config.width + borderUISize * 6, borderUISize * 4, 'spaceship', 0, 30).setOrigin(0, 0)
        this.ship_02 = new Spaceship(this, game.config.width + borderUISize * 3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0, 0)
        this.ship_03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0, 0)

        //define keyboard inputs
        keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
        keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)

        //configure score system
        this.p1Score = 0
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize : '28px',
            backgroundColor : '#F3B141',
            color : '#843605',
            align : 'right', 
            padding : {top : 5, bottom : 5},
            fixedWidth : 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, this.p1Score, scoreConfig)

        //game over flag
        this.gameOver = false

        //set a 60sec play clock
        scoreConfig.fixedWidth = 0
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5)
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5)
            this.gameOver = true
        }, null, this)

    }

    update() {
        //check for input to restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyRESET)){
            this.scene.restart()
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)){
            this.scene.start('menuScene')
        }

        this.starfield.tilePositionX -= STARFIELD_SCROLL_RATE

        if(!this.gameOver){
            this.p1Rocket.update()
            this.ship_01.update()
            this.ship_02.update()
            this.ship_03.update()
        }

        //check for collisions
        if(this.checkCollision(this.p1Rocket, this.ship_01)){
            this.p1Rocket.reset()
            this.shipExplode(this.ship_01)
        }

        if(this.checkCollision(this.p1Rocket, this.ship_02)){
            this.p1Rocket.reset()
            this.shipExplode(this.ship_02)
        }

        if(this.checkCollision(this.p1Rocket, this.ship_03)){
            this.p1Rocket.reset()
            this.shipExplode(this.ship_03)
        }
    }

    //collision checker on two rectangles
    checkCollision(rocket, ship){
        //AABB collision checking
        if(rocket.x < ship.x + ship.width && rocket.x + rocket.width > ship.x && rocket.y < ship.y + ship.height && rocket.height + rocket.y > ship.y){
            return true
        } else return false
    }


    shipExplode(ship){
        //hide ship by setting alpha to 0
        ship.alpha = 0

        //create explosion sprite on ship
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0)
        boom.anims.play('explode')
        //A callback function is a function passed into another function as an argument, 
        //which is then invoked inside the outer function to complete some kind of routine or action
        boom.on('animationcomplete', () => {  
            ship.reset()
            ship.alpha = 1
            boom.destroy()
        })
        
        this.p1Score += ship.points
        this.scoreLeft.text = this.p1Score
        this.sound.play('sfx-explosion')
    }
}

