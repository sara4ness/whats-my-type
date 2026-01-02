import React from 'react';
import './Navbar.css';

function Navbar({ onStartOver, fontFamily, fontSize = 16, lineHeight = 1.5 }) {
  return (
    <nav 
      className="navbar" 
      style={{ 
        fontFamily: fontFamily || 'system-ui',
        fontSize: `${fontSize}px`,
        lineHeight: lineHeight
      }}
    >
      {/* Left side */}
      <button onClick={onStartOver} className="nav-button">
        Start Over
      </button>
      
      {/* Right side */}
      <div className="nav-right">
        <button className="nav-link">About</button>
        <button className="nav-link">Concepts</button>
      </div>
    </nav>
  );
}

export default Navbar;