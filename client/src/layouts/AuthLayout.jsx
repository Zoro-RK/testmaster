import React from 'react';
import Logo from '../components/common/Logo';

export default function AuthLayout({ children }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      backgroundColor: 'var(--color-paper-50)'
    }}>
      {/* Left Panel: Deep Ink Branded Hero (Hidden on small mobile) */}
      <div className="auth-brand-panel" style={{
        flex: '1.1',
        backgroundColor: 'var(--color-ink-900)',
        color: 'var(--color-paper-50)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Abstract Geometric Portion Path Background Curves */}
        <svg 
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0.07,
            pointerEvents: 'none'
          }} 
          viewBox="0 0 600 800" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M-50,200 C150,150 250,450 450,400 C650,350 550,700 700,750" stroke="#FFFFFF" strokeWidth="4" strokeDasharray="8 8" />
          <circle cx="150" cy="150" r="12" fill="#E7A33E" />
          <circle cx="250" cy="450" r="16" fill="#176B67" />
          <circle cx="450" cy="400" r="20" fill="#287A58" />
          <path d="M0,600 C200,550 350,650 600,600" stroke="#FFFFFF" strokeWidth="2" />
        </svg>

        {/* Top: Logo */}
        <div style={{ zIndex: 1 }}>
          <Logo variant="horizontal" size={38} />
        </div>

        {/* Center: Mission Statement */}
        <div style={{ zIndex: 1, maxWidth: '440px' }}>
          <div style={{
            display: 'inline-block',
            padding: '6px 14px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'rgba(231, 163, 62, 0.15)',
            color: 'var(--color-saffron-500)',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginBottom: '18px'
          }}>
            Collaborative Learning Space
          </div>
          <h1 style={{
            fontSize: '34px',
            fontWeight: 800,
            color: 'var(--color-paper-50)',
            lineHeight: 1.25,
            letterSpacing: '-0.02em',
            marginBottom: '16px'
          }}>
            Study together. Track every portion. Learn at your own pace.
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#B0C0CC',
            lineHeight: 1.6
          }}>
            A private TNPSC study circle for your group. Know what your friends have covered, share test papers, and prepare systematically without competitive pressure.
          </p>

          <div style={{
            marginTop: '36px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            paddingTop: '24px'
          }}>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-saffron-500)' }}>Group IV</div>
              <div style={{ fontSize: '12px', color: '#8EA1B0' }}>Official Syllabus</div>
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-teal-100)' }}>100%</div>
              <div style={{ fontSize: '12px', color: '#8EA1B0' }}>Private Scores</div>
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#68D391' }}>No Rank</div>
              <div style={{ fontSize: '12px', color: '#8EA1B0' }}>Pure Learning</div>
            </div>
          </div>
        </div>

        {/* Bottom footer text */}
        <div style={{ zIndex: 1, fontSize: '12px', color: '#71808A' }}>
          TNPSC Combined Civil Services Examination — IV Preparation Space
        </div>
      </div>

      {/* Right Panel: Form Card Container */}
      <div style={{
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
        backgroundColor: 'var(--color-paper-50)'
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          {children}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .auth-brand-panel {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

