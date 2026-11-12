import React from 'react';
import Logo from './Logo';

export default function LoadingScreen({ message = 'Preparing your study space…' }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'var(--color-paper-50)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '24px'
    }}>
      <div style={{ marginBottom: '24px', animation: 'floatSlow 2s ease-in-out infinite alternate' }}>
        <Logo variant="stacked" size={64} />
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: 'var(--color-ink-700)',
        fontSize: '14px',
        fontWeight: 500
      }}>
        <span>{message}</span>
        <div style={{ display: 'inline-flex', gap: '4px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-teal-700)', animation: 'pulseDot 1.4s infinite ease-in-out both' }}></span>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-saffron-500)', animation: 'pulseDot 1.4s infinite ease-in-out both 0.2s' }}></span>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-teal-700)', animation: 'pulseDot 1.4s infinite ease-in-out both 0.4s' }}></span>
        </div>
      </div>

      <style>{`
        @keyframes floatSlow {
          0% { transform: translateY(0); }
          100% { transform: translateY(-4px); }
        }
        @keyframes pulseDot {
          0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

