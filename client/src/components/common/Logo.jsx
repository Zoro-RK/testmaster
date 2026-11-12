import React from 'react';

export default function Logo({ variant = 'horizontal', size = 32, className = '' }) {
  // Original SVG Mark: "The Learning Path"
  // An open book geometry with an ascending route through the inner negative space ending in a checkmark
  const symbolSvg = (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 36 36" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', flexShrink: 0 }}
      aria-label="TNPSC Study Circle Logo Mark"
    >
      {/* Left Page (Calm Peacock Teal) */}
      <path 
        d="M 6 8 C 11 6 15 7.5 17 9.5 V 28 C 15 26 11 25 6 26.5 Z" 
        fill="#176B67" 
      />
      {/* Right Page (Deep Ink Accent) */}
      <path 
        d="M 30 8 C 25 6 21 7.5 19 9.5 V 28 C 21 26 25 25 30 26.5 Z" 
        fill="#1E4750" 
      />
      {/* Center Upward Learning Route (Subtle Paper Line) */}
      <path 
        d="M 18 27 V 13" 
        stroke="#FAF8F2" 
        strokeWidth="1.8" 
        strokeLinecap="round" 
        strokeDasharray="2 2"
      />
      {/* Completed Learning Checkmark (Saffron Accent) */}
      <path 
        d="M 14.5 16.5 L 17.5 19.5 L 23 13" 
        stroke="#E7A33E" 
        strokeWidth="2.4" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      {/* Horizon guide point */}
      <circle cx="18" cy="8" r="1.5" fill="#E7A33E" />
    </svg>
  );

  if (variant === 'symbol') {
    return <div className={`logo-symbol ${className}`}>{symbolSvg}</div>;
  }

  if (variant === 'stacked') {
    return (
      <div className={`logo-stacked ${className}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        {symbolSvg}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '18px', color: 'var(--color-ink-900)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            TNPSC <span style={{ color: 'var(--color-teal-700)' }}>Study Circle</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-muted)', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: '2px' }}>
            Group IV Collaborative Space
          </div>
        </div>
      </div>
    );
  }

  // Default: Primary horizontal variant
  return (
    <div className={`logo-horizontal ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
      {symbolSvg}
      <div>
        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '17px', color: 'var(--color-ink-900)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          TNPSC <span style={{ color: 'var(--color-teal-700)' }}>Study Circle</span>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--color-muted)', fontWeight: 600, letterSpacing: '0.02em' }}>
          Private Study Space
        </div>
      </div>
    </div>
  );
}

