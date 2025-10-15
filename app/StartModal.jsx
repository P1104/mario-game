import { useEffect, useRef, useState } from "react";

// StartModal Component
export default function StartModal({ onStart, gameLoaded, isMobile }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(2, 6, 23, 0.6)",
        backdropFilter: "blur(8px)",
        padding: "14px",
      }}
    >
      <div
        style={{
          width: "min(800px, 95vw)",
          background:
            "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
          padding: "3px",
          borderRadius: "24px",
          boxShadow: "0 25px 80px rgba(102, 126, 234, 0.6)",
          animation: "modalSlideIn 0.5s ease-out",
        }}
      >
        <div
          style={{
            background: "linear-gradient(180deg, #1a1f3a 0%, #0f1628 100%)",
            borderRadius: "22px",
            padding: "40px 35px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              background: "linear-gradient(90deg, #ffd700, #ffed4e, #ffd700)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: "1.4rem",
              fontWeight: "900",
              marginBottom: "18px",
              letterSpacing: "2px",
              lineHeight: 1.1, 
              wordBreak: "break-word",
              animation: "titlePulse 2s ease-in-out infinite",
            }}
          >
            WELCOME TO EQUILIBRATE.AI
          </div>

          <p
            style={{
              color: "#a78bfa",
              fontSize: "0.95rem",
              marginBottom: "40px",
              letterSpacing: "4px",
              textTransform: "uppercase",
              fontWeight: "700",
            }}
          >
            Ready To Play
          </p>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <button
              onClick={onStart}
              disabled={!gameLoaded}
              style={{
                width: "100%",
                padding: "20px",
                borderRadius: "16px",
                fontWeight: "900",
                fontSize: isMobile ? "1.1rem" : "1.3rem",
                letterSpacing: "3px",
                textTransform: "uppercase",
                background: gameLoaded
                  ? "linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)"
                  : "linear-gradient(135deg, #4b5563 0%, #374151 100%)",
                color: gameLoaded ? "#ffffff" : "#9ca3af",
                border: "none",
                cursor: gameLoaded ? "pointer" : "not-allowed",
                boxShadow: gameLoaded
                  ? "0 10px 40px rgba(16, 185, 129, 0.5)"
                  : "none",
                opacity: gameLoaded ? 1 : 0.6,
                transition: "all 0.3s ease",
              }}
            >
              {gameLoaded ? "🚀 PLAY GAME" : "⏳ Loading Game..."}
            </button>
            {/* 
            <div
              style={{
                color: "#9ca3af",
                fontSize: "0.9rem",
                fontWeight: "600",
                letterSpacing: "2px",
                padding: "8px 0",
              }}
            >
              OR
            </div> */}

            <a
              href="https://equilibrateai.com/"
              rel="noopener noreferrer"
              style={{
                color: "#60a5fa",
                fontSize: isMobile ? "1rem" : "1.1rem",
                fontWeight: "700",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                textDecoration: "underline",
                textAlign: "center",
                display: "block",
                transition: "color 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.color = "#93c5fd")}
              onMouseOut={(e) => (e.target.style.color = "#60a5fa")}
            >
              🌐 Visit Equilibrate.AI
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
