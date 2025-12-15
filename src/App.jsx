import React, { useState, useEffect } from 'react';
import './App.css';

// Simple reusable card component
function OptionCard({ letter, title, description, onClick, fontFamily }) {
  return (
    <div 
      onClick={onClick}
      className="bg-white p-12 rounded-lg shadow-lg max-w-md cursor-pointer hover:shadow-xl transition-shadow"
    >
      <div 
        className="text-7xl font-bold text-gray-800 mb-6"
        style={{ fontFamily }}
      >
        {letter}
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-3">
        {title}
      </h2>
      <p className="text-gray-600 text-lg">
        {description}
      </p>
    </div>
  );
}

function App() {
  // All user choices in one place
  const [choices, setChoices] = useState({
    fontCategory: null,
    specificFont: null
  });
  
  const [step, setStep] = useState(0);

  // Save to localStorage whenever choices change
  useEffect(() => {
    localStorage.setItem('userChoices', JSON.stringify(choices));
  }, [choices]);

  // Step 0: Choose Serif or Sans-Serif
  if (step === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8 gap-8">
        <OptionCard
          letter="Aa"
          title="Serif"
          description="Traditional typefaces with decorative strokes"
          fontFamily="Georgia, serif"
          onClick={() => {
            setChoices({ ...choices, fontCategory: 'serif' });
            setStep(1);
          }}
        />
        
        <OptionCard
          letter="Aa"
          title="Sans-Serif"
          description="Clean, modern typefaces without decorative strokes"
          fontFamily="Arial, sans-serif"
          onClick={() => {
            setChoices({ ...choices, fontCategory: 'sans-serif' });
            setStep(1);
          }}
        />
      </div>
    );
  }

  // Step 1: Choose specific font based on category
  if (step === 1) {
    const serifFonts = [
      { name: 'Georgia', family: 'Georgia, serif' },
      { name: 'Times New Roman', family: '"Times New Roman", serif' },
      { name: 'Garamond', family: 'Garamond, serif' }
    ];
    
    const sansSerifFonts = [
      { name: 'Arial', family: 'Arial, sans-serif' },
      { name: 'Helvetica', family: 'Helvetica, sans-serif' },
      { name: 'Verdana', family: 'Verdana, sans-serif' }
    ];
    
    const fonts = choices.fontCategory === 'serif' ? serifFonts : sansSerifFonts;
    
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <button 
          onClick={() => setStep(0)}
          className="mb-8 px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          ← Back
        </button>
        
        <div className="flex items-center justify-center gap-8 flex-wrap">
          {fonts.map((font) => (
            <OptionCard
              key={font.name}
              letter="Aa"
              title={font.name}
              description={`The ${font.name} typeface`}
              fontFamily={font.family}
              onClick={() => {
                setChoices({ ...choices, specificFont: font.name });
                setStep(2);
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Step 2: Final preview with all choices
  if (step === 2) {
    const getFontFamily = () => {
      if (choices.specificFont === 'Georgia') return 'Georgia, serif';
      if (choices.specificFont === 'Times New Roman') return '"Times New Roman", serif';
      if (choices.specificFont === 'Garamond') return 'Garamond, serif';
      if (choices.specificFont === 'Arial') return 'Arial, sans-serif';
      if (choices.specificFont === 'Helvetica') return 'Helvetica, sans-serif';
      if (choices.specificFont === 'Verdana') return 'Verdana, sans-serif';
      return 'system-ui';
    };

    return (
      <div 
        className="min-h-screen bg-gray-100 p-8"
        style={{ fontFamily: getFontFamily() }}
      >
        <button 
          onClick={() => setStep(1)}
          className="mb-8 px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          ← Back
        </button>
        
        <div className="max-w-4xl mx-auto bg-white p-12 rounded-lg shadow-lg">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Your Custom Style
          </h1>
          
          <div className="mb-8 p-6 bg-gray-50 rounded">
            <h3 className="text-xl font-bold mb-4">Your Choices:</h3>
            <p className="text-lg">Font Category: <strong>{choices.fontCategory}</strong></p>
            <p className="text-lg">Specific Font: <strong>{choices.specificFont}</strong></p>
          </div>
          
          <div className="prose max-w-none">
            <h2>Sample Text</h2>
            <p>
              This is how your text will look with the selected font. 
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <p>
              The quick brown fox jumps over the lazy dog. 
              ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 1234567890
            </p>
          </div>

          <button 
            onClick={() => {
              // Download choices as JSON file
              const dataStr = JSON.stringify(choices, null, 2);
              const dataBlob = new Blob([dataStr], { type: 'application/json' });
              const url = URL.createObjectURL(dataBlob);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'user-choices.json';
              link.click();
            }}
            className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            Download My Choices
          </button>
        </div>
      </div>
    );
  }
}

export default App;