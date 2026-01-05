import React from 'react';
import './Navbar.css';

function Navbar({ onStartOver, fontFamily, fontSize = 16, lineHeight = 1.5, textColor = '#000000', bgColor = '#ffffff' }) {
  // Helper function to adjust brightness
  const adjustBrightness = (hex, percent) => {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255))
      .toString(16).slice(1);
  };
  
  // Get navbar background (slightly different from page background)
  const getNavBackground = (bg) => {
    const hex = bg.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    if (brightness > 128) {
      return adjustBrightness(bg, -3);
    } else {
      return adjustBrightness(bg, 8);
    }
  };
  
  return (
    <nav 
      className="navbar" 
      style={{ 
        fontFamily: fontFamily || 'system-ui',
        fontSize: `${fontSize}px`,
        lineHeight: lineHeight,
        backgroundColor: getNavBackground(bgColor),
        color: textColor,
        borderBottom: `1px solid ${textColor}33`,
        boxShadow: `0 2px 4px ${textColor}1A`
      }}
    >
      {/* Left side */}
      <button 
        onClick={onStartOver} 
        className="nav-button"
        style={{
          backgroundColor: textColor,
          color: bgColor,
          border: 'none'
        }}
      >
        Start Over
      </button>
      
      {/* Right side */}
      <div className="nav-right">
        <button 
          className="nav-link"
          style={{ 
            color: textColor,
            background: 'none',
            border: 'none'
          }}
        >
          About
        </button>
        <button 
          className="nav-link"
          style={{ 
            color: textColor,
            background: 'none',
            border: 'none'
          }}
        >
          Concepts
        </button>
      </div>
    </nav>
  );
}

export default Navbar;