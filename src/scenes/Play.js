//Play.js
    const STARFIELD_SCROLL_RATE = 1 // global const for tilesprite scroll rate
    var highScore = {
       hs: 0, //global for highscore
       isp1: true
    }
    var p1turn = true
    var showPlayerText = true
    var shipArr = []
    var interval_id

    let scoreConfig = {
        fontFamily: 'Courier',
        fontSize : '28px',
        backgroundColor : '#0000FF',
        color : '#000000',
        align : 'right', 
        padding : {top : 5, bottom : 5},
        fixedWidth : 0
    }


class Play extends Phaser.Scene {
    constructor(){
        super("playScene")
    }

    create() {
        //game over flag
        this.gameOver = true
        this.canPressX = true
        //score system
        this.p1Score = 0

        //place tile sprite for scrolling background
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0,0)

        //green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0xFF0000).setOrigin(0,0)

        //white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0)
        
        //add rocket
        this.p1Rocket = new Rocket(this, game.config.width / 2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0)

        //add spaceships (x4) MOD
        this.ship_01 = new Spaceship(this, game.config.width, borderUISize*8 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0, 0) //bottom ship
        this.ship_02 = new Spaceship(this, game.config.width + borderUISize * 3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 30).setOrigin(0, 0)
        this.ship_03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 20).setOrigin(0, 0)
        this.ship_04 = new Spaceship(this, game.config.width + borderUISize * 6, borderUISize * 4, 'alien', 0, 40, 4.5).setOrigin(0, 0)

 
        //encapsulate ships in arr for easy modification of all
        shipArr.push(this.ship_01)
        shipArr.push(this.ship_02)
        shipArr.push(this.ship_03)
        shipArr.push(this.ship_04)

        //define keyboard inputs
        keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
        keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
        keyStart = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X) // use x to return to menu and start instead of arrow keys

        //text on screen
        this.timeLeft = game.settings.gameTimer / 1000
        this.timeLeftTxt = this.add.text(game.config.width - borderUISize - borderPadding,game.config.height - borderUISize - borderPadding, this.timeLeft + 's', scoreConfig).setOrigin(1)
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, 'Score: ' + this.p1Score, scoreConfig)
        this.highScoreTxt = this.add.text(game.config.width - borderUISize - borderPadding, borderUISize + borderPadding * 2, 'High Score: ' + highScore.hs + '(' + (highScore.isp1 == true ? 'p1' : 'p2') + ')', scoreConfig).setOrigin(1,0)

        //conditional text
        if(this.gameOver && showPlayerText){
            this.playerTurnTxt = this.add.text(game.config.width/2, game.config.height/2, 'Player ' + (p1turn == true ? '1s' : '2s') + ' turn', scoreConfig).setOrigin(0.5)
            this.playerTurnTxt1 = this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press (X) to Start', scoreConfig).setOrigin(0.5)
        }
    }

    update() {  
        
        if(this.canPressX && this.gameOver && Phaser.Input.Keyboard.JustDown(keyStart)){
            this.gameOver = !this.gameOver
            this.canPressX = false
            this.startTimer()
        }

        //check for input to restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyRESET)){ 
            if(this.p1Score > highScore.hs){
                highScore.hs = this.p1Score
                highScore.isp1 = p1turn
            }
            p1turn = !p1turn
            this.canPressX = true
            this.scene.restart()
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyStart)){
            this.scene.start('menuScene')
        }

        this.starfield.tilePositionX -= STARFIELD_SCROLL_RATE

        if(!this.gameOver){
            this.playerTurnTxt.text = ''
            this.playerTurnTxt1.text = ''
            this.p1Rocket.update()
            this.ship_01.update()
            this.ship_02.update()
            this.ship_03.update()
            this.ship_04.update()
        }

        //check for collisions
        shipArr.forEach(element => {
            if(this.checkCollision(this.p1Rocket, element)){
                this.p1Rocket.reset()
                this.emitParticles(element)
                this.shipExplode(element)
            }
        });
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
        this.scoreLeft.text = 'Score: ' + this.p1Score
        this.sound.play('sfx-explosion')
    }

    emitParticles(ship){
        const emitter = this.add.particles(ship.x, ship.y, 'spark', {
            lifespan: 6000,
            speed: { min: 300, max: 350 },
            scale: { start: 0.8, end: 0 },
            gravityY: 100,
            emitting: false
        });
        emitter.explode(25)
    }

    startTimer(){
            //game clock
            interval_id = setInterval(() => this.updateTimer(), 1000)
            //speed increase after 30 sec TODO : change to 30000 ms
            this.clock = this.time.delayedCall(30000, () => {
                shipArr.forEach(element => {
                    element.moveSpeed = element.moveSpeed + 5
                });
            }, null, this)

            //set a 60sec play clock
            this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
                clearInterval(interval_id)
                this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5)
                this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or (X) for Menu', scoreConfig).setOrigin(0.5)
                this.gameOver = true
            }, null, this)
    }

    updateTimer(){
        this.timeLeft = this.timeLeft - 1
        this.timeLeftTxt.text = this.timeLeft + 's'
    }

}

