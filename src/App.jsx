import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';

// Simple reusable card component
function OptionCard({ letter, title, description, onClick, fontFamily, textColor, bgColor }) {
  const boxBg = getBoxBackground(bgColor);
  
  return (
    <div 
      onClick={onClick}
      className="optionBox"
      style={{ 
        fontFamily,
        color: textColor,
        backgroundColor: boxBg,
        borderColor: textColor + '33' // 20% opacity for border
      }}
    >
      <div className="fontFamily">
        {letter}
      </div>
      <h2 className="titleh2">
        {title}
      </h2>
      <p className="description" style={{ color: textColor + 'CC' }}>
        {description}
      </p>
    </div>
  );
}

// Slider component for size and leading
function SliderOption({ title, description, value, onChange, min, max, step, unit, previewText, fontFamily, fontSize, lineHeight, textColor, bgColor }) {
  const boxBg = getBoxBackground(bgColor);
  
  return (
    <div className="sliderOption" style={{ backgroundColor: boxBg, borderColor: textColor + '33', color: textColor }}>
      <div className="sliderHeader">
        <h2 className="titleh2" style={{ color: textColor }}>{title}</h2>
        <span className="sliderValue" style={{ color: textColor }}>{value.toFixed(step < 1 ? 1 : 0)}{unit}</span>
      </div>
      <p className="description" style={{ color: textColor + 'CC' }}>{description}</p>
      
      <input 
        type="range"
        min={min}
        max={max}
        step={step || 1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider"
      />
      
      <div className="previewBox" style={{ 
        fontFamily, 
        fontSize: fontSize ? `${fontSize}px` : undefined,
        lineHeight: lineHeight ? lineHeight : undefined,
        color: textColor,
        backgroundColor: adjustBrightness(boxBg, bgColor === '#ffffff' ? -2 : 5),
        borderColor: textColor + '33'
      }}>
        <p>{previewText}</p>
      </div>
    </div>
  );
}

// Helper function to get contrasting box background
function getBoxBackground(bgColor) {
  // Parse hex color
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate perceived brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // If bright background, make boxes slightly darker; if dark, make them lighter
  if (brightness > 128) {
    return adjustBrightness(bgColor, -3); // Slightly darker
  } else {
    return adjustBrightness(bgColor, 8); // Slightly lighter
  }
}

// Color picker component
function ColorOption({ title, description, currentTextColor, currentBgColor, onTextChange, onBgChange }) {
  const boxBg = getBoxBackground(currentBgColor);
  
  // Preset color combinations with accessible text colors
  const presets = [
    { name: 'Classic', text: '#000000', bg: '#ffffff' },
    { name: 'Dark Mode', text: '#ffffff', bg: '#1a1a1a' },
    { name: 'Sepia', text: '#5c4a3a', bg: '#f4ecd8' },
    { name: 'Night Blue', text: '#e0e6ed', bg: '#1b2838' },
    { name: 'Forest', text: '#e8f5e9', bg: '#1b5e20' },
    { name: 'Purple', text: '#f3e5f5', bg: '#4a148c' },
  ];

  return (
    <div className="colorOption" style={{ 
      backgroundColor: boxBg,
      borderColor: currentTextColor + '33',
      color: currentTextColor 
    }}>
      <h2 className="titleh2" style={{ color: currentTextColor }}>{title}</h2>
      <p className="description" style={{ color: currentTextColor + 'CC' }}>{description}</p>
      
      <div className="colorPickers">
        <div className="colorPickerGroup">
          <label style={{ color: currentTextColor }}>Text Color</label>
          <input 
            type="color"
            value={currentTextColor}
            onChange={(e) => onTextChange(e.target.value)}
            className="colorInput"
          />
          <span className="colorValue" style={{ color: currentTextColor }}>{currentTextColor}</span>
        </div>
        
        <div className="colorPickerGroup">
          <label style={{ color: currentTextColor }}>Background Color</label>
          <input 
            type="color"
            value={currentBgColor}
            onChange={(e) => onBgChange(e.target.value)}
            className="colorInput"
          />
          <span className="colorValue" style={{ color: currentTextColor }}>{currentBgColor}</span>
        </div>
      </div>

      <div className="presetColors">
        <h3 style={{ color: currentTextColor }}>Presets:</h3>
        <div className="presetGrid">
          {presets.map((preset) => (
            <button
              key={preset.name}
              className="presetButton"
              style={{
                backgroundColor: preset.bg,
                color: preset.text,
                border: `2px solid ${preset.text}33`
              }}
              onClick={() => {
                onTextChange(preset.text);
                onBgChange(preset.bg);
              }}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="previewBox" style={{ 
        color: currentTextColor,
        backgroundColor: adjustBrightness(boxBg, currentBgColor === '#ffffff' ? -2 : 5),
        borderColor: currentTextColor + '33'
      }}>
        <p>This is a preview of your color scheme. The quick brown fox jumps over the lazy dog.</p>
      </div>
    </div>
  );
}

// Helper function to adjust brightness
function adjustBrightness(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255))
    .toString(16).slice(1);
}

function App() {
  const [choices, setChoices] = useState({
    fontCategory: null,
    specificFont: null,
    fontSize: 16,
    leading: 1.5,
    textColor: '#000000',
    bgColor: '#ffffff'
  });
  
  const [step, setStep] = useState(0);

  useEffect(() => {
    localStorage.setItem('userChoices', JSON.stringify(choices));
    // Update body background and text color
    document.body.style.backgroundColor = choices.bgColor;
    document.body.style.color = choices.textColor;
  }, [choices]);

  // Function to reset everything
  const handleStartOver = () => {
    setChoices({ 
      fontCategory: null, 
      specificFont: null,
      fontSize: 16,
      leading: 1.5,
      textColor: '#000000',
      bgColor: '#ffffff'
    });
    setStep(0);
    localStorage.removeItem('userChoices');
    document.body.style.backgroundColor = '#ffffff';
    document.body.style.color = '#000000';
  };

  // Get current font
  const getCurrentFont = () => {
    if (!choices.specificFont) return 'system-ui';
    
    if (choices.specificFont === 'Georgia') return 'Georgia, serif';
    if (choices.specificFont === 'Times New Roman') return '"Times New Roman", serif';
    if (choices.specificFont === 'Garamond') return 'Garamond, serif';
    if (choices.specificFont === 'Merriweather') return 'Merriweather, serif';
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
        <Navbar 
          onStartOver={handleStartOver} 
          fontFamily={getCurrentFont()}
          fontSize={choices.fontSize}
          lineHeight={choices.leading}
          textColor={choices.textColor}
          bgColor={choices.bgColor}
        />
        <div className="choiceFontFamily" style={{ 
          marginTop: '80px',
          fontSize: `${choices.fontSize}px`,
          lineHeight: choices.leading
        }}>
          <OptionCard
            title="Serif"
            description="Serif fonts are typefaces with small decorative strokes (serifs) at the ends of letters. They have a traditional, formal, and elegant appearance, which helps guide the reader's eye along lines of text. Serif fonts are often used in books, newspapers, academic writing, and classic branding."
            fontFamily="Georgia, serif"
            textColor={choices.textColor}
            bgColor={choices.bgColor}
            onClick={() => {
              setChoices({ ...choices, fontCategory: 'serif' });
              setStep(1);
            }}
          />
          
          <OptionCard
            title="Sans-Serif"
            description="Sans serif fonts are typefaces without the small decorative strokes (serifs) at the ends of letters. They have a clean, simple, and modern look, which makes them easy to read—especially on screens. Sans serif fonts are commonly used in web design, user interfaces, signage, and contemporary branding."
            fontFamily="Arial, sans-serif"
            textColor={choices.textColor}
            bgColor={choices.bgColor}
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
        <Navbar 
          onStartOver={handleStartOver} 
          fontFamily={getCurrentFont()}
          fontSize={choices.fontSize}
          lineHeight={choices.leading}
          textColor={choices.textColor}
          bgColor={choices.bgColor}
        />
        <div className="buttonBox" style={{ 
          marginTop: '80px',
          fontSize: `${choices.fontSize}px`,
          lineHeight: choices.leading
        }}>
          <button onClick={() => setStep(0)} className="button" style={{ color: choices.bgColor, backgroundColor: choices.textColor }}>
            ← Back
          </button>
          
          <div className="choiceFont">
            {fonts.map((font) => (
              <OptionCard
                key={font.name}
                title={font.name}
                description={font.description}
                fontFamily={font.family}
                textColor={choices.textColor}
                bgColor={choices.bgColor}
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

  // Step 2: Choose font size
  if (step === 2) {
    return (
      <>
        <Navbar 
          onStartOver={handleStartOver} 
          fontFamily={getCurrentFont()}
          fontSize={choices.fontSize}
          lineHeight={choices.leading}
          textColor={choices.textColor}
          bgColor={choices.bgColor}
        />
        <div className="buttonBox" style={{ 
          marginTop: '80px',
          fontSize: `${choices.fontSize}px`,
          lineHeight: choices.leading
        }}>
          <button onClick={() => setStep(1)} className="button" style={{ color: choices.bgColor, backgroundColor: choices.textColor }}>
            ← Back
          </button>
          
          <div className="sliderContainer">
            <SliderOption
              title="Font Size"
              description="Font size determines how large the text appears. Larger sizes are easier to read but take up more space, while smaller sizes fit more content but may strain the eyes. Standard body text is typically 14-18px."
              value={choices.fontSize}
              onChange={(value) => setChoices({ ...choices, fontSize: value })}
              min={12}
              max={32}
              step={1}
              unit="px"
              previewText="The quick brown fox jumps over the lazy dog. This is a sample of how your text will look at this font size. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              fontFamily={getCurrentFont()}
              fontSize={choices.fontSize}
              textColor={choices.textColor}
              bgColor={choices.bgColor}
            />
            
            <button 
              onClick={() => setStep(3)} 
              className="continueButton"
              style={{ color: choices.bgColor, backgroundColor: choices.textColor }}
            >
              Continue →
            </button>
          </div>
        </div>
      </>
    );
  }

  // Step 3: Choose leading (line height)
  if (step === 3) {
    return (
      <>
        <Navbar 
          onStartOver={handleStartOver} 
          fontFamily={getCurrentFont()}
          fontSize={choices.fontSize}
          lineHeight={choices.leading}
          textColor={choices.textColor}
          bgColor={choices.bgColor}
        />
        <div className="buttonBox" style={{ 
          marginTop: '80px',
          fontSize: `${choices.fontSize}px`,
          lineHeight: choices.leading
        }}>
          <button onClick={() => setStep(2)} className="button" style={{ color: choices.bgColor, backgroundColor: choices.textColor }}>
            ← Back
          </button>
          
          <div className="sliderContainer">
            <SliderOption
              title="Leading (Line Height)"
              description="Leading controls the vertical space between lines of text. More spacing improves readability and creates a lighter feel, while tighter spacing saves space but can make text harder to read. Standard leading is 1.4-1.6."
              value={choices.leading}
              onChange={(value) => setChoices({ ...choices, leading: value })}
              min={1}
              max={2.5}
              step={0.1}
              unit=""
              previewText="The quick brown fox jumps over the lazy dog. This is a sample paragraph to demonstrate line height. Leading affects how easy it is to track from one line to the next. Proper spacing prevents lines from feeling cramped or too loose. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
              fontFamily={getCurrentFont()}
              fontSize={choices.fontSize}
              lineHeight={choices.leading}
              textColor={choices.textColor}
              bgColor={choices.bgColor}
            />
            
            <button 
              onClick={() => setStep(4)} 
              className="continueButton"
              style={{ color: choices.bgColor, backgroundColor: choices.textColor }}
            >
              Continue →
            </button>
          </div>
        </div>
      </>
    );
  }

  // Step 4: Choose colors
  if (step === 4) {
    return (
      <>
        <Navbar 
          onStartOver={handleStartOver} 
          fontFamily={getCurrentFont()}
          fontSize={choices.fontSize}
          lineHeight={choices.leading}
          textColor={choices.textColor}
          bgColor={choices.bgColor}
        />
        <div className="buttonBox" style={{ 
          marginTop: '80px',
          fontSize: `${choices.fontSize}px`,
          lineHeight: choices.leading
        }}>
          <button onClick={() => setStep(3)} className="button" style={{ color: choices.bgColor, backgroundColor: choices.textColor }}>
            ← Back
          </button>
          
          <div className="sliderContainer">
            <ColorOption
              title="Color Scheme"
              description="Choose colors that work well together and ensure good readability. High contrast between text and background improves legibility."
              currentTextColor={choices.textColor}
              currentBgColor={choices.bgColor}
              onTextChange={(color) => setChoices({ ...choices, textColor: color })}
              onBgChange={(color) => setChoices({ ...choices, bgColor: color })}
            />
            
            <button 
              onClick={() => setStep(5)} 
              className="continueButton"
              style={{ color: choices.bgColor, backgroundColor: choices.textColor }}
            >
              Continue →
            </button>
          </div>
        </div>
      </>
    );
  }

  // Step 5: Final preview
  if (step === 5) {
    return (
      <>
        <Navbar 
          onStartOver={handleStartOver} 
          fontFamily={getCurrentFont()}
          fontSize={choices.fontSize}
          lineHeight={choices.leading}
          textColor={choices.textColor}
          bgColor={choices.bgColor}
        />
        <div 
          className="buttonBox"
          style={{ 
            marginTop: '80px',
            fontSize: `${choices.fontSize}px`,
            lineHeight: choices.leading
          }}
        >
          <button onClick={() => setStep(4)} className="button" style={{ color: choices.bgColor, backgroundColor: choices.textColor }}>
            ← Back
          </button>
          
          <div className="summaryPage">
            <h1 className="titleh1" style={{ 
              fontFamily: getCurrentFont(),
              fontSize: `${choices.fontSize * 1.8}px`,
              lineHeight: choices.leading,
              color: choices.textColor
            }}>
              Your Custom Style
            </h1>
            
            <div className="customChoicesSummary" style={{ 
              backgroundColor: getBoxBackground(choices.bgColor),
              borderColor: choices.textColor + '33',
              color: choices.textColor 
            }}>
              <h3 className="yourChoices" style={{ fontSize: `${choices.fontSize * 1.3}px`, color: choices.textColor }}>Your Choices:</h3>
              <p className="spesification" style={{ color: choices.textColor }}>Font Category: <strong>{choices.fontCategory}</strong></p>
              <p className="spesification" style={{ color: choices.textColor }}>Specific Font: <strong>{choices.specificFont}</strong></p>
              <p className="spesification" style={{ color: choices.textColor }}>Font Size: <strong>{choices.fontSize}px</strong></p>
              <p className="spesification" style={{ color: choices.textColor }}>Leading: <strong>{choices.leading}</strong></p>
              <p className="spesification" style={{ color: choices.textColor }}>Text Color: <strong>{choices.textColor}</strong></p>
              <p className="spesification" style={{ color: choices.textColor }}>Background Color: <strong>{choices.bgColor}</strong></p>
            </div>
            
            <div 
              className="sampleText"
              style={{
                fontFamily: getCurrentFont(),
                color: choices.textColor,
                backgroundColor: getBoxBackground(choices.bgColor),
                borderColor: choices.textColor + '33'
              }}
            >
              <h2 style={{ fontSize: `${choices.fontSize * 1.5}px`, lineHeight: choices.leading, color: choices.textColor }}>Sample Text</h2>
              <p>
                This is how your text will look with the selected font, size, leading, and colors. 
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p>
                The quick brown fox jumps over the lazy dog. 
                ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 1234567890
              </p>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
                eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
                sunt in culpa qui officia deserunt mollit anim id est laborum.
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
              style={{ color: choices.bgColor, backgroundColor: choices.textColor }}
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