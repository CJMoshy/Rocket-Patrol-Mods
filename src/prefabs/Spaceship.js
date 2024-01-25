//Spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, texture, frame, pointValue, _moveSpeed=game.settings.spaceshipSpeed){
        super(scene, x, y, texture, frame, pointValue)
        scene.add.existing(this)
        this.points = pointValue
        this.moveSpeed = _moveSpeed
        this.direction = Math.round(Math.random())
        if(this.direction == 0){
            this.flipX = true
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