"use client";

import { useEffect, useRef, useState } from "react";
import StartModal from "./StartModal";
import GameOverModal from "./GameOverModal";
import CountdownModal from "./CountdownModal";
import SuccessModal from "./SuccessModal";

let gameInitialized = false;

export default function MarioGamePage() {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [gameState, setGameState] = useState("start");
  const [character, setCharacter] = useState("mario");
  const [difficulty, setDifficulty] = useState("normal");
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [finalCoins, setFinalCoins] = useState(0);
  const [gameLoaded, setGameLoaded] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    window.initMobileResponsiveGame = () => {
      const canvas = document.getElementById("screen");
      if (!canvas) return;

      const isMobileDevice = window.innerWidth <= 768;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const scale = isMobileDevice ? 1.8 : 3.1;
      window.gameScale = scale;
      window.isMobileDevice = isMobileDevice;
      const tool = canvas.getContext("2d");
      tool.setTransform(1, 0, 0, 1, 0, 0);
      tool.scale(scale, scale);
      return { canvas, tool, scale, isMobileDevice };
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const canvas = document.getElementById("screen");
      if (!canvas) return;
      const vw = Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0
      );
      const vh = Math.max(
        document.documentElement.clientHeight || 0,
        window.innerHeight || 0
      );
      const isMobileDevice = vw <= 768;
      const scale = isMobileDevice ? 1.8 : 3.1;
      canvas.width = vw;
      canvas.height = vh;
      window.gameScale = scale;
      window.isMobileDevice = isMobileDevice;
      const tool = canvas.getContext("2d");
      tool.setTransform(1, 0, 0, 1, 0, 0);
      tool.scale(scale, scale);
      if (window.gameObj) {
        window.gameObj.camera.width = vw / scale;
      }
      console.log(
        `📐 Resized: ${vw}x${vh}, scale: ${scale}, mobile: ${isMobileDevice}`
      );
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", () => {
      setTimeout(handleResize, 50);
      setTimeout(handleResize, 200);
      setTimeout(handleResize, 500);
    });

    if (window.screen && window.screen.orientation) {
      window.screen.orientation.addEventListener("change", () => {
        setTimeout(handleResize, 100);
      });
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      if (window.screen && window.screen.orientation) {
        window.screen.orientation.removeEventListener("change", handleResize);
      }
    };
  }, []);

  useEffect(() => {
    const handleScoreUpdate = (e) => {
      const detail = e.detail || {};
      console.log("📊 Score update:", detail);
      setScore(detail.score || 0);
      setCoins(detail.coins || 0);
    };

    const handleGameOver = (e) => {
      const detail = e.detail || {};
      console.log("🎮 Game over event received:", detail);
      setFinalScore(detail.score || 0);
      setFinalCoins(detail.coins || 0);
      setTimeout(() => {
        console.log("Setting gameState to gameOver");
        setGameState("gameOver");
      }, 100);
    };

    const handleLevelComplete = (e) => {
      const detail = e.detail || {};
      console.log("🏆 Level complete event received:", detail);
      setFinalScore(detail.score || 0);
      setFinalCoins(detail.coins || 0);
      setTimeout(() => {
        console.log("Setting gameState to success");
        setGameState("success");
      }, 100);
    };

    const handleGameLoaded = () => {
      console.log("✅ Game loaded");
      setGameLoaded(true);
    };

    window.addEventListener("gameScoreUpdated", handleScoreUpdate);
    window.addEventListener("gameOver", handleGameOver);
    window.addEventListener("levelComplete", handleLevelComplete);
    window.addEventListener("gameLoaded", handleGameLoaded);

    return () => {
      window.removeEventListener("gameScoreUpdated", handleScoreUpdate);
      window.removeEventListener("gameOver", handleGameOver);
      window.removeEventListener("levelComplete", handleLevelComplete);
      window.removeEventListener("gameLoaded", handleGameLoaded);
    };
  }, []);

  useEffect(() => {
    if (gameInitialized) {
      setGameLoaded(true);
      return;
    }

    const scripts = [
      "/mario/entitityParent.js",
      "/mario/bgblueprint.js",
      "/mario/entity/brick.js",
      "/mario/entity/particles.js",
      "/mario/entity/coin.js",
      "/mario/entity/mushroom.js",
      "/mario/entity/mystery.js",
      "/mario/entity/goomba.js",
      "/mario/entity/koopa.js",
      "/mario/entity/mario.js",
      "/mario/animation.js",
      "/mario/input.js",
      "/mario/movement.js",
      "/mario/physics.js",
      "/mario/levelBuilder.js",
      "/mario/levelOne.js",
      "/mario/preload.js",
      "/mario/game.js",
    ];

    let loadedCount = 0;

    const loadNextScript = (index) => {
      if (index >= scripts.length) {
        console.log("✅ All scripts loaded");
        setTimeout(() => {
          if (
            window.Game &&
            window.Game.prototype &&
            window.Game.prototype.init
          ) {
            const originalInit = window.Game.prototype.init;
            window.Game.prototype.init = function () {
              if (window.initMobileResponsiveGame) {
                window.initMobileResponsiveGame();
              }
              originalInit.call(this);
            };
            console.log("✅ Game.init patched for mobile responsiveness");
          }
          gameInitialized = true;
          setGameLoaded(true);
        }, 300);
        return;
      }

      const existingScript = document.querySelector(
        `script[src="${scripts[index]}"]`
      );
      if (existingScript) {
        loadedCount++;
        loadNextScript(index + 1);
        return;
      }

      const script = document.createElement("script");
      script.src = scripts[index];
      script.async = false;

      script.onload = () => {
        loadedCount++;
        console.log(`✓ ${loadedCount}/${scripts.length}: ${scripts[index]}`);
        loadNextScript(index + 1);
      };

      script.onerror = () => {
        console.error(`✗ Failed: ${scripts[index]}`);
        loadNextScript(index + 1);
      };

      document.body.appendChild(script);
    };

    loadNextScript(0);

    return () => {
      if (window.gameInstance?._raf) {
        cancelAnimationFrame(window.gameInstance._raf);
      }
    };
  }, []);

  const handleStart = () => {
    if (!gameLoaded) {
      console.log("Game not loaded yet!");
      return;
    }
    console.log("🎮 Starting countdown");
    setGameState("countdown");
  };

  const handleCountdownComplete = () => {
    console.log("⏱️ Countdown complete, starting game");

    if (window.initMobileResponsiveGame) {
      window.initMobileResponsiveGame();
    }

    if (window.gameInstance?.startWithSettings) {
      window.gameInstance.startWithSettings(character, difficulty);
      setGameState("playing");
      setTimeout(() => {
        const canvas = document.getElementById("screen");
      }, 100);
    }
  };

  const handleRestart = () => {
    console.log("🔄 Restarting game");
    if (window.gameInstance?._raf) {
      cancelAnimationFrame(window.gameInstance._raf);
    }
    // Reset score and coins
    setScore(0);
    setCoins(0);
    setFinalScore(0);
    setFinalCoins(0);
    // Go directly to countdown instead of start modal
    setGameState("countdown");
  };

  const setMobileInput = (key, value) => {
    if (window.gameInstance?.mobileInput) {
      window.gameInstance.mobileInput[key] = value;
    }
    if (window.input) {
      if (value) {
        if (key === "left") window.input.down["ArrowLeft"] = true;
        if (key === "right") window.input.down["ArrowRight"] = true;
        if (key === "jump") window.input.down["Space"] = true;
      } else {
        if (key === "left") delete window.input.down["ArrowLeft"];
        if (key === "right") delete window.input.down["ArrowRight"];
        if (key === "jump") delete window.input.down["Space"];
      }
    }
  };

  console.log("🎨 Rendering with gameState:", gameState);

  const showCanvas = gameState === "playing";
  const showHUD = gameState === "playing";
  const showControls = gameState === "playing" && isMobile;

  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html {
          width: 100vw;
          height: 100vh;
          height: 100dvh;
          overflow: hidden;
          position: fixed;
          overscroll-behavior: none;
          -webkit-overflow-scrolling: touch;
          touch-action: none;
        }

        body {
          width: 100%;
          height: 100%;
          height: 100dvh;
          overflow: hidden;
          position: fixed;
          overscroll-behavior: none;
          -webkit-overflow-scrolling: touch;
          touch-action: none;
        }

        input,
        select,
        textarea,
        button {
          font-size: 16px;
          -webkit-user-select: none;
          user-select: none;
        }

        #__next,
        #__next > div {
          width: 100%;
          height: 100%;
          height: 100dvh;
          overflow: hidden;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes titlePulse {
          0%,
          100% {
            filter: brightness(1) drop-shadow(0 0 20px rgba(255, 215, 0, 0.5));
          }
          50% {
            filter: brightness(1.2) drop-shadow(0 0 30px rgba(255, 215, 0, 0.8));
          }
        }

        .board {
          image-rendering: -moz-crisp-edges;
          image-rendering: -webkit-crisp-edges;
          image-rendering: pixelated;
          image-rendering: crisp-edges;
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          height: 100dvh !important;
        }

        @supports (-webkit-touch-callout: none) {
          html,
          body {
            height: -webkit-fill-available;
          }
          .board {
            height: -webkit-fill-available !important;
          }
        }

        html {
          overscroll-behavior-y: none;
        }

        @media screen and (orientation: portrait) {
          body::before {
            content: "";
            display: none;
          }
        }

        @media screen and (orientation: landscape) {
          body::before {
            content: "";
            display: none;
          }
        }
      `}</style>

      <div
        ref={containerRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          maxWidth: "100vw",
          maxHeight: "100vh",
          overflow: "hidden",
          background: "linear-gradient(180deg, #5c94fc 0%, #7bd1ff 100%)",
          touchAction: "none",
        }}
      >
        <canvas
          id="screen"
          className="board"
          tabIndex={0}
          style={{
            display: "block",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            maxWidth: "100vw",
            maxHeight: "100vh",
            visibility: showCanvas ? "visible" : "hidden",
            touchAction: "none",
          }}
        />

        {showHUD && (
          <div
            style={{
              position: "fixed",
              top: "16px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 50,
              background: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(12px)",
              padding: "12px 24px",
              borderRadius: "16px",
              color: "white",
              fontWeight: "bold",
              display: "flex",
              gap: "32px",
              fontSize: "18px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              border: "2px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#fbbf24" }}>⭐</span>
              <span>
                Score: <span style={{ color: "#fde047" }}>{score}</span>
              </span>
            </div>
          </div>
        )}

        {gameState === "start" && (
          <StartModal
            onStart={handleStart}
            gameLoaded={gameLoaded}
            isMobile={isMobile}
          />
        )}

        {gameState === "countdown" && (
          <CountdownModal
            onCountdownComplete={handleCountdownComplete}
            isMobile={isMobile}
          />
        )}

        {gameState === "gameOver" && (
          <GameOverModal
            finalScore={finalScore}
            finalCoins={finalCoins}
            onRestart={handleRestart}
            isMobile={isMobile}
          />
        )}

        {gameState === "success" && (
          <SuccessModal
            finalScore={finalScore}
            finalCoins={finalCoins}
            onRestart={handleRestart}
            isMobile={isMobile}
          />
        )}

        {showControls && (
          <>
            <div
              style={{
                position: "fixed",
                bottom: "20px",
                left: "20px",
                zIndex: 40,
                display: "flex",
                gap: "16px",
              }}
            >
              <button
                onTouchStart={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setMobileInput("left", true);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setMobileInput("left", false);
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setMobileInput("left", true);
                }}
                onMouseUp={(e) => {
                  e.preventDefault();
                  setMobileInput("left", false);
                }}
                style={{
                  width: "75px",
                  height: "75px",
                  background: "rgba(255, 255, 255, 0.3)",
                  backdropFilter: "blur(12px)",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "2rem",
                  fontWeight: "bold",
                  boxShadow: "0 6px 28px rgba(0, 0, 0, 0.35)",
                  border: "3px solid rgba(255, 255, 255, 0.5)",
                  userSelect: "none",
                  WebkitUserSelect: "none",
                  touchAction: "manipulation",
                }}
              >
                ◀
              </button>

              <button
                onTouchStart={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setMobileInput("right", true);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setMobileInput("right", false);
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setMobileInput("right", true);
                }}
                onMouseUp={(e) => {
                  e.preventDefault();
                  setMobileInput("right", false);
                }}
                style={{
                  width: "75px",
                  height: "75px",
                  background: "rgba(255, 255, 255, 0.3)",
                  backdropFilter: "blur(12px)",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "2rem",
                  fontWeight: "bold",
                  boxShadow: "0 6px 28px rgba(0, 0, 0, 0.35)",
                  border: "3px solid rgba(255, 255, 255, 0.5)",
                  userSelect: "none",
                  WebkitUserSelect: "none",
                  touchAction: "manipulation",
                }}
              >
                ▶
              </button>
            </div>

            <div
              style={{
                position: "fixed",
                bottom: "20px",
                right: "20px",
                zIndex: 40,
              }}
            >
              <button
                onTouchStart={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setMobileInput("jump", true);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setMobileInput("jump", false);
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setMobileInput("jump", true);
                }}
                onMouseUp={(e) => {
                  e.preventDefault();
                  setMobileInput("jump", false);
                }}
                style={{
                  width: "90px",
                  height: "90px",
                  background:
                    "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  boxShadow: "0 8px 35px rgba(239, 68, 68, 0.65)",
                  border: "4px solid rgba(254, 202, 202, 0.7)",
                  userSelect: "none",
                  WebkitUserSelect: "none",
                  touchAction: "manipulation",
                }}
              >
                ▲
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
