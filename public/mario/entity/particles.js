// particles.js - Brick debris particles
class Particle extends Entity {
    constructor(tileset, posX, posY, width, height, velX, velY) {
        const sprite = new Sprite(tileset, 25, 6, 10, 7);
        super(sprite, 'particle', posX, posY, width, height);
        
        // Store velocities
        this.velX = velX;
        this.velY = velY;
        
        // Apply initial X velocity to position
        this.posX += this.velX;
    }
}