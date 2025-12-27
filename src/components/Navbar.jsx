import React from 'react';
import './Navbar.css';

function Navbar({ onStartOver, fontFamily }) {
  return (
    <nav className="navbar" style={{ fontFamily: fontFamily || 'system-ui' }}>
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