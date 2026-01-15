import React from 'react';

function Navbar({ 
  onStartOver, 
  onSkipToLearning,
  onViewSummary,
  fontFamily, 
  fontSize, 
  lineHeight, 
  textColor, 
  bgColor,
  showLearningButton = true // Default to showing the button
}) {
  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: bgColor,
      borderBottom: `2px solid ${textColor}33`,
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 1000,
      fontFamily,
      fontSize: `${fontSize}px`,
      lineHeight
    }}>
      <h1 style={{ 
        margin: 0, 
        color: textColor,
        fontSize: `${fontSize * 1.5}px`
      }}>
        &#123;What's My Type?&#125;
      </h1>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {showLearningButton && (
          <button
            onClick={onSkipToLearning}
            style={{
              backgroundColor: 'transparent',
              color: textColor,
              border: `2px solid ${textColor}`,
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: `${fontSize}px`,
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = textColor;
              e.target.style.color = bgColor;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = textColor;
            }}
          >
            Learning Resources
          </button>
        )}

        {onViewSummary && (
          <button
            onClick={onViewSummary}
            style={{
              backgroundColor: 'transparent',
              color: textColor,
              border: `2px solid ${textColor}`,
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: `${fontSize}px`,
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = textColor;
              e.target.style.color = bgColor;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = textColor;
            }}
          >
            View My Summary
          </button>
        )}

        <button
          onClick={onStartOver}
          style={{
            backgroundColor: textColor,
            color: bgColor,
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: `${fontSize}px`,
            fontWeight: '600'
          }}
        >
          Start Over
        </button>
      </div>
    </nav>
  );
}

export default Navbar;