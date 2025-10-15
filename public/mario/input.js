// input.js - Add global input access
let input = {
  down: {},
  pressed: {},
  init() {
    // Initialize empty input object if it doesn't exist
    if (!window.input) {
      window.input = { down: {} };
    }
    
    // event listener set
    window.addEventListener("keydown", (e) => {
      this.down[e.code] = true;
      // Also set on window.input for global access
      if (window.input) {
        window.input.down[e.code] = true;
      }
    });
    window.addEventListener("keyup", (e) => {
      delete this.down[e.code];
      delete this.pressed[e.code];
      // Also remove from window.input
      if (window.input) {
        delete window.input.down[e.code];
      }
    });
  },
  update(gameObj) {
    let mario = gameObj.entities.mario;
    if (gameObj.userControl == true) {
      // Get current speed from game settings
      const speed = gameObj.settings ? gameObj.settings.speed : 2.0;

      // Check both local input and global window.input
      const isLeft = this.isDown("ArrowLeft") || this.isMobileLeft() || 
                    (window.input && window.input.down && window.input.down["ArrowLeft"]);
      const isRight = this.isDown("ArrowRight") || this.isMobileRight() || 
                     (window.input && window.input.down && window.input.down["ArrowRight"]);
      const isJump = this.isPressed("Space") || this.isMobileJump() || 
                    (window.input && window.input.down && window.input.down["Space"]);

      //left
      if (isLeft) {
        // go left
        mario.posX -= speed;
        mario.currentDirection = "left";
        mario.currentState = mario.states.walkingAnim;
      }
      // right
      if (isRight) {
        // go right
        mario.posX += speed;
        mario.currentDirection = "right";
        mario.currentState = mario.states.walkingAnim;
      }
      // space
      if (isJump) {
        if (mario.velY == 1.1) {
          mario.velY -= 14;
          mario.currentState = mario.states.jumpingAnim;

          if (window.gameInstance) {
            window.gameInstance.addScore(50);
          }
        }
      }
    }
  },
  isDown(key) {
    return this.down[key];
  },
  isPressed(key) {
    if (this.pressed[key]) {
      return false;
    } else if (this.down[key]) {
      return true;
    }
  },

  // Mobile input methods
  isMobileLeft() {
    return (
      window.gameInstance &&
      window.gameInstance.mobileInput &&
      window.gameInstance.mobileInput.left
    );
  },
  isMobileRight() {
    return (
      window.gameInstance &&
      window.gameInstance.mobileInput &&
      window.gameInstance.mobileInput.right
    );
  },
  isMobileJump() {
    return (
      window.gameInstance &&
      window.gameInstance.mobileInput &&
      window.gameInstance.mobileInput.jump
    );
  },
};