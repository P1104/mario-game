// physics.js - FIXED: Correct castle position detection
let physics = {
  update(gameObj) {
    this.gravity(gameObj.entities.mario);
    gameObj.entities.goombas.forEach((goomba) => {
      this.gravity(goomba);
    });
    gameObj.entities.koopas.forEach((koopa) => {
      this.gravity(koopa);
    });
    gameObj.entities.particles.forEach((particle) => {
      this.gravity(particle);
    });
    gameObj.entities.mushrooms.forEach((mushroom) => {
      this.gravity(mushroom);
    });
    this.staticEntityCol(gameObj);
    this.entityMarioCol(gameObj);
    this.bgEntityCollision(gameObj);
    this.marioFallingCheck(gameObj);
    this.checkCastleReached(gameObj);
  },
  gravity(entity) {
    entity.velY += 1.1;
    entity.posY += entity.velY;
  },
  staticEntityCol(gameObj) {
    let { mushrooms, blocks, bricks } = gameObj.entities;
    mushrooms.forEach((mushroom) => {
      blocks.forEach((block) => {
        if (this.checkRectCollision(block, mushroom)) {
          this.handleDirec(block, mushroom);
        }
      });
    });
    mushrooms.forEach((mushroom) => {
      bricks.forEach((brick) => {
        if (this.checkRectCollision(brick, mushroom)) {
          this.handleDirec(brick, mushroom);
        }
      });
    });
  },
  entityMarioCol(gameObj) {
    let { goombas, mario, koopas, bricks, blocks, mushrooms } =
      gameObj.entities;
    goombas.forEach((goomba) => {
      if (this.checkRectCollision(goomba, mario)) {
        this.handleCollision(mario, goomba, gameObj);
      }
    });
    koopas.forEach((koopa) => {
      if (this.checkRectCollision(koopa, mario)) {
        this.handleCollision(mario, koopa, gameObj);
      }
    });
    bricks.forEach((brick) => {
      if (this.checkRectCollision(brick, mario)) {
        let wantToBreak = this.handleDirec(brick, mario);
        if (wantToBreak) {
          brick.createParticles(gameObj);
          let idx = gameObj.entities.bricks.indexOf(brick);
          gameObj.entities.bricks.splice(idx, 1);
        }
      }
    });
    blocks.forEach((block) => {
      if (this.checkRectCollision(block, mario)) {
        let wantToReveal = this.handleDirec(block, mario);
        if (wantToReveal && block.currentState != block.states.emptyAnim) {
          if (block.content == "coin") {
            block.createCoin(gameObj);
          } else {
            block.createMushroom(gameObj);
          }
          block.currentState = block.states.emptyAnim;
        }
      }
    });
    mushrooms.forEach((mushroom, idx) => {
      if (this.checkRectCollision(mario, mushroom)) {
        console.log("mushroom consumed");
        mushrooms.splice(idx, 1);
        if (window.gameInstance) {
          window.gameInstance.addScore(1000);
        }
      }
    });

    gameObj.entities.coins.forEach((coin, idx) => {
      if (this.checkRectCollision(mario, coin)) {
        console.log("coin collected");
        gameObj.entities.coins.splice(idx, 1);
        if (window.gameInstance) {
          window.gameInstance.addCoin();
        }
      }
    });
  },
  handleCollision(mario, entity, gameObj) {
    if (entity.type == "goomba" || entity.type == "koopa") {
      const onGround = Math.abs(mario.velY - 1.1) < 0.5;

      if (mario.posX > entity.posX && onGround) {
        if (
          entity.currentState != entity.states.squashed &&
          entity.type == "goomba"
        ) {
          this.marioDeath(gameObj, mario);
        } else if (entity.type == "koopa") {
          if (entity.currentState == entity.states.hiding) {
            this.koopaSlide(entity, mario);
          } else {
            this.marioDeath(gameObj, mario);
          }
        }
      }
      if (mario.posX < entity.posX && onGround) {
        if (
          entity.currentState != entity.states.squashed &&
          entity.type == "goomba"
        ) {
          this.marioDeath(gameObj, mario);
        } else if (entity.type == "koopa") {
          if (entity.currentState == entity.states.hiding) {
            this.koopaSlide(entity, mario);
          } else {
            this.marioDeath(gameObj, mario);
          }
        }
      }
      if (
        mario.posY < entity.posY &&
        mario.posX < entity.posX + entity.width &&
        mario.posX + mario.width > entity.posX
      ) {
        if (mario.pointer != "dead" && entity.type == "koopa") {
          if (entity.currentState == entity.states.walkingAnim) {
            this.koopaHide(entity, mario);
          } else if (entity.currentState == entity.states.hiding) {
            this.koopaSlide(entity, mario);
          } else {
            this.enemyDeath(gameObj, entity, mario);
          }
        } else if (
          entity.currentState != entity.states.squashed &&
          mario.pointer != "dead" &&
          entity.type == "goomba"
        ) {
          this.enemyDeath(gameObj, entity, mario);
        }
      }
    }
  },
  enemyDeath(gameObj, entity, mario) {
    if (entity.type == "goomba") {
      entity.pointer = "squashed";
      entity.currentState = entity.states.squashed;

      if (window.gameInstance) {
        window.gameInstance.addScore(100);
      }
    } else if (entity.type == "koopa") {
      entity.velX += 5;
      entity.velY -= 14;

      if (window.gameInstance) {
        window.gameInstance.addScore(100);
      }
    }

    setTimeout(() => {
      if (entity.type == "goomba") {
        let idx = gameObj.entities.goombas.indexOf(entity);
        delete gameObj.entities.goombas[idx];
      } else if (entity.type == "koopa") {
        let idx = gameObj.entities.koopas.indexOf(entity);
        delete gameObj.entities.koopas[idx];
      }
    }, 200);
  },
  koopaHide(entity, mario) {
    entity.currentState = entity.states.hiding;
    entity.posX =
      mario.currentDirection == "left" ? entity.posX - 10 : entity.posX + 10;
  },
  koopaSlide(entity, mario) {
    entity.currentState = entity.states.sliding;
    entity.currentDirection = mario.currentDirection;
    entity.posX =
      mario.currentDirection == "left" ? entity.posX - 10 : entity.posX + 10;
  },

  marioDeath(gameObj, mario) {
    if (mario.pointer === "dead") {
      return;
    }

    console.log("💀 Mario died - triggering game over");
    
    mario.velX = 0;
    mario.currentState = mario.states.dead;
    mario.velY = -14;
    mario.pointer = "dead";
    gameObj.userControl = false;

    if (window.gameInstance && window.gameInstance._raf) {
      cancelAnimationFrame(window.gameInstance._raf);
      window.gameInstance._raf = null;
    }

    const finalScore = gameObj.score || 0;
    const finalCoins = gameObj.coins || 0;
    
    console.log("🎮 Dispatching gameOver event:", { score: finalScore, coins: finalCoins });
    
    window.dispatchEvent(
      new CustomEvent("gameOver", {
        detail: {
          score: finalScore,
          coins: finalCoins,
        },
      })
    );
  },
  
  bgEntityCollision(gameObj) {
    let mario = gameObj.entities.mario;
    let goombas = gameObj.entities.goombas;
    let koopas = gameObj.entities.koopas;
    let mushrooms = gameObj.entities.mushrooms;
    this.bgCollision(mario, gameObj);
    goombas.forEach((goomba) => {
      this.bgCollision(goomba, gameObj);
    });
    koopas.forEach((koopa) => {
      this.bgCollision(koopa, gameObj);
    });
    mushrooms.forEach((mushroom) => {
      this.bgCollision(mushroom, gameObj);
    });
  },
  bgCollision(entity, gameObj) {
    let scenery = gameObj.entities.scenery;
    scenery.forEach((scene) => {
      if (this.checkRectCollision(scene, entity)) {
        if (scene.type == "pipe" || scene.type == "stair") {
          this.handleDirec(scene, entity);
        } else if (scene.type == "ground") {
          if (
            entity.posY < scene.posY &&
            entity.posX + entity.width > scene.posX &&
            scene.posX + scene.width > entity.posX &&
            entity.velY >= 0
          ) {
            if (entity.type == "mario") {
              entity.currentState = entity.states.standingAnim;
            }
            if (entity.pointer != "dead") {
              entity.posY = scene.posY - entity.height - 1;
              entity.velY = 1.1;
            }
          }
        }
      }
    });
  },
  checkRectCollision(entity1, entity2) {
    let l1 = entity1.posX;
    let l2 = entity2.posX;
    let r1 = entity1.posX + entity1.width;
    let r2 = entity2.posX + entity2.width;
    let t1 = entity1.posY + entity1.height;
    let t2 = entity2.posY + entity2.height;
    let b1 = entity1.posY;
    let b2 = entity2.posY;

    if (r2 > l1 && l2 < r1 && t2 > b1 && t1 > b2) {
      return true;
    }
  },
  handleDirec(scene, entity) {
    if (
      entity.posY > scene.posY &&
      entity.posX + entity.width > scene.posX &&
      scene.posX + scene.width > entity.posX &&
      entity.velY < 0
    ) {
      if (scene.type == "brick" || scene.type == "block") {
        entity.posY = scene.posY + scene.height;
        entity.velY = 1.1;
        return true;
      }
    }

    if (entity.posX < scene.posX && entity.posY >= scene.posY) {
      entity.posX = scene.posX - entity.width;
      if (
        entity.type == "goomba" ||
        entity.type == "koopa" ||
        entity.type == "mushroom"
      ) {
        entity.currentDirection =
          entity.currentDirection == "left" ? "right" : "left";
      }
    }

    if (entity.posX > scene.posX && entity.posY >= scene.posY) {
      entity.posX = scene.posX + scene.width;
      if (
        entity.type == "goomba" ||
        entity.type == "koopa" ||
        entity.type == "mushroom"
      ) {
        entity.currentDirection =
          entity.currentDirection == "left" ? "right" : "left";
      }
    }

    if (
      entity.posY < scene.posY &&
      entity.posX + entity.width > scene.posX &&
      scene.posX + scene.width > entity.posX &&
      entity.velY >= 0
    ) {
      if (entity.type == "mario") {
        entity.currentState = entity.states.standingAnim;
      }
      entity.posY = scene.posY - entity.height - 1;
      entity.velY = 1.1;
    }
  },

  marioFallingCheck(gameObj) {
    if (gameObj.entities.mario.posY >= 500) {
      console.log("💀 Mario fell off the map!");
      
      if (gameObj.entities.mario.pointer !== "dead") {
        this.marioDeath(gameObj, gameObj.entities.mario);
      }
    }
  },

  // FIXED: Correct castle position from levelOne.js
  checkCastleReached(gameObj) {
    const mario = gameObj.entities.mario;
    
    if (mario.pointer === "dead" || gameObj.levelComplete) {
      return;
    }

    // Castle position from levelOne.js: [3263, 112, 80, 80]
    // X position: 3263, Y position: 112, Width: 80, Height: 80
    const castleX = 3263;
    const castleWidth = 80;
    const castleTriggerX = castleX - 20; // Trigger slightly before castle
    
    // Check if Mario has reached the castle area
    if (mario.posX >= castleTriggerX) {
      console.log("🏆 Mario reached the castle!");
      
      gameObj.levelComplete = true;
      gameObj.userControl = false;

      if (window.gameInstance && window.gameInstance._raf) {
        cancelAnimationFrame(window.gameInstance._raf);
        window.gameInstance._raf = null;
      }

      const finalScore = gameObj.score || 0;
      const finalCoins = gameObj.coins || 0;
      
      // Add level completion bonus
      const bonusScore = 5000;
      const totalScore = finalScore + bonusScore;
      
      console.log("🎮 Dispatching levelComplete event:", { score: totalScore, coins: finalCoins });
      
      window.dispatchEvent(
        new CustomEvent("levelComplete", {
          detail: {
            score: totalScore,
            coins: finalCoins,
          },
        })
      );
    }
  },
};