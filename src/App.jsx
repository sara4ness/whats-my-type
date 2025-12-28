import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';

// Simple reusable card component
function OptionCard({ letter, title, description, onClick, fontFamily }) {
  return (
    <div 
      onClick={onClick}
      className="optionBox"
      style={{ fontFamily }}
    >
      <div 
        className="fontFamily"
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
  const [choices, setChoices] = useState({
    fontCategory: null,
    specificFont: null
  });
  
  const [step, setStep] = useState(0);

  useEffect(() => {
    localStorage.setItem('userChoices', JSON.stringify(choices));
  }, [choices]);

  // Function to reset everything
  const handleStartOver = () => {
    setChoices({ fontCategory: null, specificFont: null });
    setStep(0);
    localStorage.removeItem('userChoices');
  };

  // Get current font
  const getCurrentFont = () => {
    if (!choices.specificFont) return 'system-ui';
    
    if (choices.specificFont === 'Georgia') return 'Georgia, serif';
    if (choices.specificFont === 'Times New Roman') return '"Times New Roman", serif';
    if (choices.specificFont === 'Garamond') return 'Garamond, serif';
    if (choices.specificFont === 'Merriweather') return 'MMerriweather, serif';
    if (choices.specificFont === 'Arial') return 'Arial, sans-serif';
    if (choices.specificFont === 'Helvetica') return 'Helvetica, sans-serif';
    if (choices.specificFont === 'Verdana') return 'Verdana, sans-serif';
    if (choices.specificFont === 'Roboto') return 'Roboto, sans-serif';
    return 'system-ui';
  };

  // Step 0: Choose Serif or Sans-Serif
  if (step === 0) {
    return (
      <>
        <Navbar onStartOver={handleStartOver} fontFamily={getCurrentFont()} />
        <div className="choiceFontFamily" style={{ marginTop: '80px' }}>
          <OptionCard
            title="Serif"
            description="Serif fonts are typefaces with small decorative strokes (serifs) at the ends of letters. They have a traditional, formal, and elegant appearance, which helps guide the reader’s eye along lines of text. Serif fonts are often used in books, newspapers, academic writing, and classic branding."
            fontFamily="Georgia, serif"
            onClick={() => {
              setChoices({ ...choices, fontCategory: 'serif' });
              setStep(1);
            }}
          />
          
          <OptionCard
            title="Sans-Serif"
            description="Sans serif fonts are typefaces without the small decorative strokes (serifs) at the ends of letters. They have a clean, simple, and modern look, which makes them easy to read—especially on screens. Sans serif fonts are commonly used in web design, user interfaces, signage, and contemporary branding."
            fontFamily="Arial, sans-serif"
            onClick={() => {
              setChoices({ ...choices, fontCategory: 'sans-serif' });
              setStep(1);
            }}
          />
        </div>
      </>
    );
  }

  // Step 1: Choose specific font
  if (step === 1) {
    const serifFonts = [
      { name: 'Georgia', family: 'Georgia, serif', description: "Georgia is a serif typeface designed for clear readability on screens, featuring large letterforms, generous spacing, and sturdy serifs. It has a classic yet friendly appearance, making it well suited for web content, long-form reading, and accessible digital typography." },
      { name: 'Times New Roman', family: '"Times New Roman", serif', description: "Times New Roman is a classic serif typeface known for its formal, traditional appearance and high readability. Originally designed for print, it is widely used in academic, professional, and editorial content, and its familiar letterforms make it comfortable for extended reading both in print and on screens." },
      { name: 'Garamond', family: 'Garamond, serif', description: "Garamond is an elegant serif typeface with refined, flowing letterforms and a timeless, literary feel. Known for its excellent readability in long texts, it is commonly used in books, academic works, and classic print design, offering a warm and sophisticated tone."},
      { name: 'Merriweather', family: 'Merriweather, serif', description: "Merriweather is a serif typeface designed for comfortable on-screen reading, with sturdy letterforms, generous spacing, and a slightly modern feel. It works especially well for long-form digital content, combining traditional serif structure with enhanced readability on screens." }
    ];
    
    const sansSerifFonts = [
      { name: 'Arial', family: 'Arial, sans-serif', description: "Arial is a widely used sans serif typeface with a clean, simple design and high legibility. Its familiar shapes and balanced spacing make it suitable for digital interfaces, documents, and everyday online reading."},
      { name: 'Helvetica', family: 'Helvetica, sans-serif', description: "Helvetica is a modern sans serif typeface known for its neutral, streamlined appearance. It is commonly used in branding, signage, and user interfaces, offering clarity and a professional tone."},
      { name: 'Verdana', family: 'Verdana, sans-serif', description: "Verdana is a sans serif typeface designed specifically for screen readability, featuring large letterforms and wide spacing. It is especially effective for small text sizes and accessible web content."},
      { name: 'Roboto', family: 'Roboto, sans-serif', description: "Roboto is a contemporary sans serif typeface with open shapes and smooth curves, created for digital environments. It is widely used in web and app design, balancing a modern aesthetic with excellent readability."}
    ];
    
    const fonts = choices.fontCategory === 'serif' ? serifFonts : sansSerifFonts;
    
    return (
      <>
        <Navbar onStartOver={handleStartOver} fontFamily={getCurrentFont()} />
        <div className="buttonBox" style={{ marginTop: '80px' }}>
          <button onClick={() => setStep(0)} className="button">
            ← Back
          </button>
          
          <div className="choiceFont">
            {fonts.map((font) => (
              <OptionCard
                key={font.name}
                title={font.name}
                description={font.description}
                fontFamily={font.family}
                onClick={() => {
                  setChoices({ ...choices, specificFont: font.name });
                  setStep(2);
                }}
              />
            ))}
          </div>
        </div>
      </>
    );
  }

  // Step 2: Final preview
  if (step === 2) {
    return (
      <>
        <Navbar onStartOver={handleStartOver} fontFamily={getCurrentFont()} />
        <div 
          className="buttonBox"
          style={{ fontFamily: getCurrentFont(), marginTop: '80px' }}
        >
          <button onClick={() => setStep(1)} className="button">
            ← Back
          </button>
          
          <div className="summaryPage">
            <h1 className="titleh1">Your Custom Style</h1>
            
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
              </p>
              <p>
                The quick brown fox jumps over the lazy dog. 
                ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 1234567890
              </p>
            </div>

            <button 
              onClick={() => {
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
      </>
    );
  }
}

export default App;