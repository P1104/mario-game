export default function GameOverModal({ finalScore, finalCoins, onRestart, isMobile }) {
  return (
    <div 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(2, 6, 23, 0.85)',
        backdropFilter: 'blur(12px)',
        padding: '16px'
      }}
    >
      <div 
        style={{
          width: 'min(700px, 95vw)',
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)',
          padding: '3px',
          borderRadius: '24px',
          boxShadow: '0 25px 80px rgba(239, 68, 68, 0.6)',
          animation: 'modalSlideIn 0.5s ease-out'
        }}
      >
        <div style={{
          background: 'linear-gradient(180deg, #1a1f3a 0%, #0f1628 100%)',
          borderRadius: '22px',
          padding: '40px 35px',
          textAlign: 'center'
        }}>
          {/* <div style={{ fontSize: '4rem', marginBottom: '16px' }}>💀</div> */}
          
          <div style={{
            background: 'linear-gradient(90deg, #ef4444, #f87171, #fca5a5)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: isMobile ? '2.5rem' : '3.5rem',
            fontWeight: '900',
            marginBottom: '24px',
            letterSpacing: '2px'
          }}>
            GAME OVER
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.15) 100%)',
            borderRadius: '20px',
            padding: '24px',
            marginBottom: '32px',
            border: '2px solid rgba(239, 68, 68, 0.3)'
          }}>
            <p style={{
              color: '#fca5a5',
              fontSize: '0.95rem',
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '3px',
              fontWeight: '800'
            }}>
              Final Score
            </p>
            <p style={{
              color: '#ffffff',
              fontSize: isMobile ? '2.5rem' : '3.5rem',
              fontWeight: '900',
              marginBottom: '8px'
            }}>
              {finalScore}
            </p>
            <p style={{
              color: '#fbbf24',
              fontSize: '1rem',
              fontWeight: '700'
            }}>
              🪙 Coins: {finalCoins}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button
              onClick={onRestart}
              style={{
                width: '100%',
                padding: '20px',
                borderRadius: '16px',
                fontWeight: '900',
                fontSize: isMobile ? '1.1rem' : '1.3rem',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 10px 40px rgba(16, 185, 129, 0.5)',
                transition: 'all 0.3s ease'
              }}
            >
              🔄 TRY AGAIN
            </button>

            <a
              href="https://equilibrateai.com/"
              rel="noopener noreferrer"
              style={{
                width: '100%',
                padding: '20px',
                borderRadius: '16px',
                fontWeight: '900',
                fontSize: isMobile ? '1rem' : '1.2rem',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #a855f7 100%)',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 8px 30px rgba(59, 130, 246, 0.4)',
                textDecoration: 'none',
                display: 'block',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              🌐 Visit EquilibrateAI
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}