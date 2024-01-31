//Spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame, pointValue, _moveSpeed=game.settings.spaceshipSpeed){ //adjust constructor to accept additonal params and default some
        super(scene, x, y, texture, frame, pointValue)                                            //This makes it easy to add different spacehips
        scene.add.existing(this)
        this.points = pointValue //points
        this.moveSpeed = _moveSpeed //movespeed
        this.direction = Math.round(Math.random()) // random direction upon instanciation
        if(this.direction == 0){
            this.flipX = true // flip sprite if direction requires it
        }
    }

    update() {
        if(this.direction == 1){
            this.x -= this.moveSpeed
            //wrap left to right
            if(this.x <= 0){
                this.x = game.config.width
            }
        }else{
            this.x += this.moveSpeed
            //wrap from right to left edge
            if(this.x >= game.config.width){
                this.x = 0
            }
        }
    }

    //reset pos
    reset(){
        this.x = game.config.width
    }
}