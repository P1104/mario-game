export default function SuccessModal({ finalScore, finalCoins, onRestart, isMobile }) {
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
          background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
          padding: '3px',
          borderRadius: '24px',
          boxShadow: '0 25px 80px rgba(16, 185, 129, 0.6)',
          animation: 'modalSlideIn 0.5s ease-out'
        }}
      >
        <div style={{
          background: 'linear-gradient(180deg, #1a1f3a 0%, #0f1628 100%)',
          borderRadius: '22px',
          padding: '40px 35px',
          textAlign: 'center'
        }}>
          {/* <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🏆</div> */}
          
          <div style={{
            background: 'linear-gradient(90deg, #10b981, #34d399, #6ee7b7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: isMobile ? '2.5rem' : '3.5rem',
            fontWeight: '900',
            marginBottom: '24px',
            letterSpacing: '2px'
          }}>
            LEVEL COMPLETE!
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(52, 211, 153, 0.15) 100%)',
            borderRadius: '20px',
            padding: '24px',
            marginBottom: '32px',
            border: '2px solid rgba(16, 185, 129, 0.3)'
          }}>
            <p style={{
              color: '#6ee7b7',
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

          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '32px',
            border: '2px solid rgba(16, 185, 129, 0.3)'
          }}>
            <p style={{
              color: '#d1fae5',
              fontSize: isMobile ? '0.9rem' : '1rem',
              lineHeight: '1.6',
              fontWeight: '600'
            }}>
              🎉 Congratulations! You've successfully reached the castle and completed the level!
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
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #a855f7 100%)',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 10px 40px rgba(59, 130, 246, 0.5)',
                transition: 'all 0.3s ease'
              }}
            >
              🔄 PLAY AGAIN
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
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 8px 30px rgba(16, 185, 129, 0.4)',
                textDecoration: 'none',
                display: 'block',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              🌐 Visit Equilibrate.AI
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
