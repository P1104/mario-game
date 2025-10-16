// game.js - COMPLETE: Proper restart handling
const render = {
    init(gameObj) {
        gameObj.tool.fillStyle = "#3498db";
        gameObj.tool.fillRect(0, 0, gameObj.canvas.width, gameObj.canvas.height);
        let mario = gameObj.entities.mario;
        gameObj.levelBuilder.stock(gameObj);
        gameObj.tool.drawImage(
            mario.sprite.img,
            mario.sprite.srcX,
            mario.sprite.srcY,
            mario.sprite.srcW,
            mario.sprite.srcH,
            mario.posX,
            mario.posY,
            mario.width,
            mario.height
        )
    },
    update(gameObj) {
        this.updateFrame(gameObj);
        gameObj.tool.clearRect(0, 0, gameObj.canvas.width, gameObj.canvas.height);
        gameObj.tool.fillStyle = "#63adff";
        gameObj.tool.fillRect(0, 0, gameObj.canvas.width, gameObj.canvas.height);
        gameObj.levelBuilder.render(gameObj);
        let mario = gameObj.entities.mario;
        let camera = gameObj.camera
        this.drawEntity(camera, mario, gameObj);
        gameObj.entities.goombas.forEach((goomba) => {
            this.drawEntity(camera, goomba, gameObj);
        })
        gameObj.entities.koopas.forEach((koopa) => {
            this.drawEntity(camera, koopa, gameObj);
        })
        gameObj.entities.particles.forEach((particle) => {
            this.drawEntity(camera, particle, gameObj);
        })
        gameObj.entities.coins.forEach((coin) => {
            this.drawEntity(camera, coin, gameObj);
        })
        gameObj.entities.mushrooms.forEach((mushroom) => {
            this.drawEntity(camera, mushroom, gameObj);
        })
    },
    drawEntity(camera, entity, gameObj) {
        let entityEnd = entity.posX + entity.width;
        let frameWidth = camera.start + camera.width;
        if (entity.posX >= camera.start && entityEnd <= frameWidth) {
            gameObj.tool.drawImage(
                entity.sprite.img,
                entity.sprite.srcX,
                entity.sprite.srcY,
                entity.sprite.srcW,
                entity.sprite.srcH,
                entity.posX - camera.start,
                entity.posY,
                entity.width,
                entity.height
            )
        }
    },
    updateFrame(gameObj) {
        let mario = gameObj.entities.mario;
        let centerX = mario.posX + mario.width / 2;
        
        let dist = gameObj.camera.width / 4;

        if (centerX > gameObj.camera.start + dist) {
            gameObj.camera.start = centerX - dist;
        }
        
        gameObj.camera.start = Math.max(0, gameObj.camera.start);
    }
}

class Game {
    init() {
        preload()
            .then(() => {
                const canvas = document.querySelector(".board");
                
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                
                const tool = canvas.getContext("2d");
                
                const isMobile = window.innerWidth <= 768;
                const scale = isMobile ? 1.8 : 3.1;
                tool.scale(scale, scale);
                
                let entities = {}
                
                let camera = {
                    start: 0,
                    width: window.innerWidth / scale
                }
                
                let gameObj = {
                    tool, canvas,
                    entities,
                    animFrame: 0,
                    levelBuilder: new LevelBuilder(levelOne),
                    camera,
                    reset: this.reset,
                    userControl: false
                }

                let mario = new Mario(spriteSheetImage, 50, 174, 18, 18);
                gameObj.entities.mario = mario;
                gameObj.entities.goombas = [];
                gameObj.entities.koopas = [];
                gameObj.entities.bricks = [];
                gameObj.entities.particles = [];
                gameObj.entities.blocks = [];
                gameObj.entities.coins = [];
                gameObj.entities.mushrooms = [];
                
                levelOne.goombas.forEach((gCord) => {
                    gameObj.entities.goombas.push(new Goomba(spriteSheetImage, gCord[0], gCord[1], gCord[2], gCord[3]));
                })
                levelOne.koopas.forEach((kCord) => {
                    gameObj.entities.koopas.push(new Koopa(spriteSheetImage, kCord[0], kCord[1], kCord[2], kCord[3]));
                })
                gameObj.entities.scenery = [];
                
                gameObj.settings = {
                    character: 'mario',
                    difficulty: 'normal',
                    speed: 2.0
                };
                
                gameObj.score = 0;
                gameObj.coins = 0;
                
                render.init(gameObj);
                input.init();
                this.initMobileControls();
                
                const handleResize = () => {
                    const newIsMobile = window.innerWidth <= 768;
                    const newScale = newIsMobile ? 1.8 : 3.1;
                    
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                    tool.setTransform(1, 0, 0, 1, 0, 0);
                    tool.scale(newScale, newScale);
                    camera.width = window.innerWidth / newScale;
                };
                
                window.addEventListener('resize', handleResize);
                window.addEventListener('orientationchange', () => {
                    setTimeout(handleResize, 100);
                });
                
                window.gameInstance = this;
                window.gameObj = gameObj;
                
                console.log("✅ Game initialized, dispatching gameLoaded event");
                window.dispatchEvent(new Event('gameLoaded'));
            })
    }

    startMainLoop() {
        if (!window.gameObj) return;
        const gameObj = window.gameObj;
        gameObj.userControl = true;

        console.log("🎮 Starting main game loop");

        const gameloop = () => {
            // CRITICAL: Check if game is still running
            if (!gameObj.userControl && gameObj.entities.mario.pointer === "dead") {
                console.log("⏸️ Game loop stopped - Mario is dead");
                return;
            }

            input.update(gameObj);
            animation.update(gameObj);
            movement.update(gameObj);
            physics.update(gameObj);
            render.update(gameObj);
            gameObj.animFrame++;
            this._raf = requestAnimationFrame(gameloop);
        };
        gameloop();
    }

    update(gameObj) {
        // kept for compatibility
    }
    
    reset() {
        console.log("🔄 Resetting game - doing full reload");
        location.reload();
    }
    
    startWithSettings(character, difficulty) {
        if (!window.gameObj) {
            console.error("gameObj not found!");
            return;
        }

        const gameObj = window.gameObj;
        
        // FIXED: Reset game state properly before starting
        console.log("🔧 Resetting game state for new game");
        
        // Reset mario position and state
        gameObj.entities.mario.posX = 50;
        gameObj.entities.mario.posY = 174;
        gameObj.entities.mario.velX = 0;
        gameObj.entities.mario.velY = 0;
        gameObj.entities.mario.pointer = "idle";
        gameObj.entities.mario.direction = 1;
        gameObj.camera.start = 0;
        
        // Clear all entities except mario
        gameObj.entities.goombas = [];
        gameObj.entities.koopas = [];
        gameObj.entities.particles = [];
        gameObj.entities.coins = [];
        gameObj.entities.mushrooms = [];
        gameObj.entities.bricks = [];
        gameObj.entities.blocks = [];
        
        // Rebuild level
        gameObj.levelBuilder = new LevelBuilder(levelOne);
        
        // Recreate enemies
        levelOne.goombas.forEach((gCord) => {
            gameObj.entities.goombas.push(new Goomba(spriteSheetImage, gCord[0], gCord[1], gCord[2], gCord[3]));
        });
        levelOne.koopas.forEach((kCord) => {
            gameObj.entities.koopas.push(new Koopa(spriteSheetImage, kCord[0], kCord[1], kCord[2], kCord[3]));
        });
        
        // Reset score/coins if needed
        gameObj.score = 0;
        gameObj.coins = 0;
        
        const difficulties = {
            'easy': { speed: 1.5 },
            'normal': { speed: 2.0 },
            'hard': { speed: 2.5 }
        };
        
        gameObj.settings.character = character;
        gameObj.settings.difficulty = difficulty;
        gameObj.settings.speed = difficulties[difficulty].speed;
        gameObj.entities.mario.velX = gameObj.settings.speed;
        
        console.log(`✅ Game state reset with ${character} on ${difficulty} difficulty`);
        
        // Reset userControl flag
        gameObj.userControl = false;
        
        // If game loop already running, cancel it first
        if (this._raf) {
            cancelAnimationFrame(this._raf);
            this._raf = null;
        }

        // Start fresh game loop
        this.startMainLoop();
    }
    
    initMobileControls() {
        this.mobileInput = { left: false, right: false, jump: false };
        window.mobileInput = this.mobileInput;
    }
    
    updateScoreDisplay() {
        if (window.gameObj) {
            window.dispatchEvent(new CustomEvent('gameScoreUpdated', { 
                detail: { 
                    score: window.gameObj.score, 
                    coins: window.gameObj.coins 
                } 
            }));
        }
    }
    
    addScore(points) {
        if (window.gameObj) {
            window.gameObj.score += points;
            this.updateScoreDisplay();
        }
    }
    
    addCoin() {
        if (window.gameObj) {
            window.gameObj.coins += 1;
            window.gameObj.score += 100;
            this.updateScoreDisplay();
        }
    }

    endGame(finalScore) {
        console.log('🎮 Game Over called with score:', finalScore);
        
        if (this._raf) {
            cancelAnimationFrame(this._raf);
            this._raf = null;
        }
        
        if (typeof finalScore !== 'undefined' && window.gameObj) {
            window.gameObj.score = finalScore;
        }
        
        const score = (window.gameObj && window.gameObj.score) || finalScore || 0;
        const coins = (window.gameObj && window.gameObj.coins) || 0;
        
        console.log('📤 Dispatching gameOver event with:', { score, coins });
        
        window.dispatchEvent(new CustomEvent('gameOver', { 
            detail: { score, coins } 
        }));
    }
}

const game = new Game();
game.init();