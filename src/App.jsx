import React from 'react'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      
      {/* 
        ONE BOX
        This is our serif choice box 
      */}
      <div className="bg-white p-12 rounded-lg shadow-lg max-w-md">
        
        {/* Big letter preview */}
        <div 
          className="text-7xl font-bold text-gray-800 mb-6"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Aa
        </div>
        
        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Serif
        </h2>
        
        {/* Description */}
        <p className="text-gray-600 text-lg">
          Traditional typefaces with small decorative strokes at the ends of letters.
        </p>
        
      </div>
      
    </div>
  );
}

export default App
