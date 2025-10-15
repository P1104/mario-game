class Mushroom extends Entity {
    constructor(tileset, posX, posY, width, height) {
        let sprite = new Sprite(tileset, 625, 5, 16, 16);
        super(sprite, 'mushroom', posX, posY, width, height);
        const self = this;
        this.velX = 1.3;
        this.velY = 0;
        
        // Frames
        this.animFrame = {
            moving: new Sprite(spriteSheetImage, 625, 5, 16, 16)
        };
        
        // States
        this.states = {
            moving: {
                movement() {
                    if (self.currentDirection == "right") {
                        self.posX += self.velX;
                    } else {
                        self.posX -= self.velX;
                    }
                }
            }
        };
        
        this.currentDirection = "right";
        this.currentState = this.states.moving;
    }
}