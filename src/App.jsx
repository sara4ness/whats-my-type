import React, { useState, useEffect } from 'react';
import './App.css';

// Simple reusable card component
function OptionCard({ letter, title, description, onClick, fontFamily }) {
  return (
    <div 
      onClick={onClick}
      className="optionBox"
    >
      <div 
        className="fontFamily"
        style={{ fontFamily }}
      >
        {letter}
      </div>
      <h2 className="titleh2">
        {title}
      </h2>
      <p className="description">
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
      <div className="choiceFontFamily">
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
      <div className="buttonBox">
        <button 
          onClick={() => setStep(0)}
          className="button"
        >
          ← Back
        </button>
        
        <div className="choiceFont">
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
        className="buttonBox"
        style={{ fontFamily: getFontFamily() }}
      >
        <button 
          onClick={() => setStep(1)}
          className="button"
        >
          ← Back
        </button>
        
        <div className="summaryPage">
          <h1 className="titleh1">
            Your Custom Style
          </h1>
          
          <div className="customChoicesSummary">
            <h3 className="yourChoices">Your Choices:</h3>
            <p className="spesification">Font Category: <strong>{choices.fontCategory}</strong></p>
            <p className="spesification">Specific Font: <strong>{choices.specificFont}</strong></p>
          </div>
          
          <div className="sampleText">
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
            className="saveData"
          >
            Download My Choices
          </button>
        </div>
      </div>
    );
  }
}

export default App;