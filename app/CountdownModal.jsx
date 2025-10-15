// CountdownModal Component
import React,{useState,useEffect} from "react";
export default function CountdownModal({ onCountdownComplete, isMobile }) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      onCountdownComplete();
    }
  }, [countdown, onCountdownComplete]);

  return (
    <div 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10001,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(2, 6, 23, 0.9)',
        backdropFilter: 'blur(12px)',
        padding: '16px'
      }}
    >
      <div 
        style={{
          width: 'min(700px, 95vw)',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          padding: '3px',
          borderRadius: '24px',
          boxShadow: '0 25px 80px rgba(102, 126, 234, 0.6)',
          animation: 'modalSlideIn 0.5s ease-out'
        }}
      >
        <div style={{
          background: 'linear-gradient(180deg, #1a1f3a 0%, #0f1628 100%)',
          borderRadius: '22px',
          padding: '40px 35px',
          textAlign: 'center'
        }}>
          <div style={{
            background: 'linear-gradient(90deg, #ffd700, #ffed4e, #ffd700)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: isMobile ? '2rem' : '2.5rem',
            fontWeight: '900',
            marginBottom: '24px',
            letterSpacing: '2px'
          }}>
            GAME STARTING IN
          </div>
          
          <div style={{
            fontSize: isMobile ? '6rem' : '8rem',
            fontWeight: '900',
            color: '#ffffff',
            marginBottom: '32px',
            textShadow: '0 0 40px rgba(102, 126, 234, 0.8)',
            animation: 'titlePulse 1s ease-in-out infinite'
          }}>
            {countdown}
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
            borderRadius: '20px',
            padding: '24px',
            border: '2px solid rgba(139, 92, 246, 0.3)'
          }}>
            <p style={{
              color: '#c4b5fd',
              fontSize: '0.85rem',
              fontWeight: '800',
              marginBottom: '20px',
              textTransform: 'uppercase',
              letterSpacing: '3px'
            }}>
              🎯 CONTROLS
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: '20px',
              fontSize: '0.9rem',
              color: '#e9d5ff'
            }}>
              {!isMobile && (
                <div style={{
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.3) 0%, rgba(99, 102, 241, 0.2) 100%)',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '2px solid rgba(99, 102, 241, 0.4)'
                }}>
                  <div style={{
                    fontWeight: '800',
                    color: '#ffffff',
                    marginBottom: '12px',
                    fontSize: '1.05rem'
                  }}>
                    💻 Desktop
                  </div>
                  <div style={{ lineHeight: '1.8' }}>
                    <div>← → Arrow Keys</div>
                    <div>Space to Jump</div>
                  </div>
                </div>
              )}
              <div style={{
                textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(168, 85, 247, 0.2) 100%)',
                borderRadius: '16px',
                padding: '20px',
                border: '2px solid rgba(168, 85, 247, 0.4)'
              }}>
                <div style={{
                  fontWeight: '800',
                  color: '#ffffff',
                  marginBottom: '12px',
                  fontSize: '1.05rem'
                }}>
                  {isMobile ? '📱 Mobile Controls' : '📱 Mobile'}
                </div>
                <div style={{ lineHeight: '1.8' }}>
                  <div>Tap buttons</div>
                  <div>at bottom</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}