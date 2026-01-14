import React, { useState, useEffect } from 'react';
import './App.css';
import LearningResources from './components/LearningResources';
import Navbar from './components/Navbar'; 

// --- Helper Functions for Rating System ---
function getLuminance(hex) {
  const rgb = parseInt(hex.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >>  8) & 0xff;
  const b = (rgb >>  0) & 0xff;

  const [lr, lg, lb] = [r, g, b].map(c => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

function getContrastRatio(hex1, hex2) {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

// Simple reusable card component
function OptionCard({ letter, title, description, onClick, fontFamily, fontSize, lineHeight, textColor, bgColor }) {
  const boxBg = getBoxBackground(bgColor);
  
  return (
    <div 
      onClick={onClick}
      className="optionBox"
      style={{ 
        fontFamily,
        fontSize: `${fontSize}px`,
        lineHeight: lineHeight,
        color: textColor,
        backgroundColor: boxBg,
        borderColor: textColor + '33',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = `0 10px 20px -5px ${textColor}33`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {letter && (
        <div className="fontFamily" style={{ fontSize: `${fontSize * 2.5}px`, lineHeight: lineHeight, marginBottom: '0.5rem' }}>
          {letter}
        </div>
      )}
      <h2 className="titleh2" style={{ fontSize: `${fontSize * 1.3}px`, lineHeight: lineHeight, marginTop: 0 }}>
        {title}
      </h2>
      <p className="description" style={{ color: textColor + 'CC', fontSize: `${fontSize}px`, lineHeight: lineHeight }}>
        {description}
      </p>
    </div>
  );
}

// Slider component for size and leading
function SliderOption({ title, description, value, onChange, min, max, step, unit, previewText, fontFamily, fontSize, lineHeight, textColor, bgColor }) {
  const boxBg = getBoxBackground(bgColor);
  
  return (
    <div className="sliderOption" style={{ 
      backgroundColor: boxBg, 
      borderColor: textColor + '33', 
      color: textColor,
      fontSize: `${fontSize}px`,
      lineHeight: lineHeight
    }}>
      <div className="sliderHeader">
        <h2 className="titleh2" style={{ color: textColor, fontSize: `${fontSize * 1.3}px`, lineHeight: lineHeight }}>{title}</h2>
        <span className="sliderValue" style={{ color: textColor, fontSize: `${fontSize * 1.2}px`, lineHeight: lineHeight }}>{value.toFixed(step < 1 ? 1 : 0)}{unit}</span>
      </div>
      <p className="description" style={{ color: textColor + 'CC', fontSize: `${fontSize}px`, lineHeight: lineHeight }}>{description}</p>
      
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
        <p style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight }}>{previewText}</p>
      </div>
    </div>
  );
}

// Helper function to get contrasting box background
function getBoxBackground(bgColor) {
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  if (brightness > 128) {
    return adjustBrightness(bgColor, -3);
  } else {
    return adjustBrightness(bgColor, 8);
  }
}

// Color picker component
function ColorOption({ title, description, currentTextColor, currentBgColor, onTextChange, onBgChange, onPresetChange, fontSize, lineHeight }) {
  const boxBg = getBoxBackground(currentBgColor);
  
  const presets = [
    { name: 'Classic', text: '#000000', bg: '#ffffff' },
    { name: 'Dark Mode', text: '#ffffff', bg: '#1a1a1a' },
    { name: 'Sepia', text: '#5c4a3a', bg: '#f4ecd8' },
    { name: 'Night Blue', text: '#e0e6ed', bg: '#1b2838' },
    { name: 'Forest', text: '#e8f5e9', bg: '#254127' },
    { name: 'Purple', text: '#f3e5f5', bg: '#4a148c' },
  ];

  return (
    <div className="colorOption" style={{ 
      backgroundColor: boxBg,
      borderColor: currentTextColor + '33',
      color: currentTextColor,
      fontSize: `${fontSize}px`,
      lineHeight: lineHeight
    }}>
      <h2 className="titleh2" style={{ color: currentTextColor, fontSize: `${fontSize * 1.3}px`, lineHeight: lineHeight }}>{title}</h2>
      <p className="description" style={{ color: currentTextColor + 'CC', fontSize: `${fontSize}px`, lineHeight: lineHeight }}>{description}</p>
      
      <div className="colorPickers">
        <div className="colorPickerGroup">
          <label style={{ color: currentTextColor, fontSize: `${fontSize * 1.1}px`, lineHeight: lineHeight }}>Text Color</label>
          <input 
            type="color"
            value={currentTextColor}
            onChange={(e) => onTextChange(e.target.value)}
            className="colorInput"
          />
          <span className="colorValue" style={{ color: currentTextColor, fontSize: `${fontSize * 0.9}px` }}>{currentTextColor}</span>
        </div>
        
        <div className="colorPickerGroup">
          <label style={{ color: currentTextColor, fontSize: `${fontSize * 1.1}px`, lineHeight: lineHeight }}>Background Color</label>
          <input 
            type="color"
            value={currentBgColor}
            onChange={(e) => onBgChange(e.target.value)}
            className="colorInput"
          />
          <span className="colorValue" style={{ color: currentTextColor, fontSize: `${fontSize * 0.9}px` }}>{currentBgColor}</span>
        </div>
      </div>

      <div className="presetColors">
        <h3 style={{ color: currentTextColor, fontSize: `${fontSize * 1.2}px`, lineHeight: lineHeight }}>Presets:</h3>
        <div className="presetGrid">
          {presets.map((preset) => (
            <button
              key={preset.name}
              className="presetButton"
              style={{
                backgroundColor: preset.bg,
                color: preset.text,
                border: `2px solid ${preset.text}33`,
                fontSize: `${fontSize}px`,
                lineHeight: lineHeight
              }}
              onClick={() => {
                if (onPresetChange) {
                  onPresetChange(preset.text, preset.bg);
                } else {
                  onTextChange(preset.text);
                  onBgChange(preset.bg);
                }
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
        borderColor: currentTextColor + '33',
        fontSize: `${fontSize}px`,
        lineHeight: lineHeight
      }}>
        <p style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight }}>This is a preview of your color scheme. The quick brown fox jumps over the lazy dog.</p>
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
  
  const [step, setStep] = useState(-1);
  const [showLearning, setShowLearning] = useState(false);
  const [sessionId] = useState(() => {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  });

  const getCurrentFont = () => {
    if (!choices.specificFont) return 'system-ui';
    
    // Serif
    if (choices.specificFont === 'Georgia') return 'Georgia, serif';
    if (choices.specificFont === 'Times New Roman') return '"Times New Roman", serif';
    if (choices.specificFont === 'Garamond') return 'Garamond, serif';
    if (choices.specificFont === 'Merriweather') return 'Merriweather, serif';
    
    // Sans-Serif
    if (choices.specificFont === 'Arial') return 'Arial, sans-serif';
    if (choices.specificFont === 'Helvetica') return 'Helvetica, sans-serif';
    if (choices.specificFont === 'Verdana') return 'Verdana, sans-serif';
    if (choices.specificFont === 'Roboto') return 'Roboto, sans-serif';

    // Casual / Humanist (Dyslexia Friendly proxy)
    if (choices.specificFont === 'Comic Sans MS') return '"Comic Sans MS", "Chalkboard SE", "Comic Neue", sans-serif';
    if (choices.specificFont === 'Trebuchet MS') return '"Trebuchet MS", "Lucida Grande", "Lucida Sans Unicode", sans-serif';
    if (choices.specificFont === 'Century Gothic') return '"Century Gothic", Futura, sans-serif';
    if (choices.specificFont === 'Calibri') return 'Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif';

    // Monospace
    if (choices.specificFont === 'Courier New') return '"Courier New", Courier, monospace';
    if (choices.specificFont === 'Consolas') return 'Consolas, monaco, monospace';
    if (choices.specificFont === 'Lucida Console') return '"Lucida Console", Monaco, monospace';
    if (choices.specificFont === 'Andale Mono') return '"Andale Mono", monospace';

    return 'system-ui';
  };

  useEffect(() => {
    localStorage.setItem('userChoices', JSON.stringify(choices));
    document.body.style.backgroundColor = choices.bgColor;
    document.body.style.color = choices.textColor;
    document.body.style.fontFamily = getCurrentFont();
  }, [choices]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const saveChoicesToBackend = async () => {
    try {
      const response = await fetch(`${API_URL}/api/save-choices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fontCategory: choices.fontCategory,
          specificFont: choices.specificFont,
          fontSize: choices.fontSize,
          leading: choices.leading,
          textColor: choices.textColor,
          bgColor: choices.bgColor,
          sessionId: sessionId
        })
      });

      const data = await response.json();
      
      if (data.success) {
        console.log('Choices saved successfully!');
        return true;
      } else {
        console.error('Failed to save choices:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Error saving choices:', error);
      return false;
    }
  };

  const handleStartOver = () => {
    setChoices({ 
      fontCategory: null, 
      specificFont: null,
      fontSize: 16,
      leading: 1.5,
      textColor: '#000000',
      bgColor: '#ffffff'
    });
    setStep(-1);
    setShowLearning(false);
    localStorage.removeItem('userChoices');
    document.body.style.backgroundColor = '#ffffff';
    document.body.style.color = '#000000';
    document.body.style.fontFamily = 'system-ui';
  };

  const calculateRating = () => {
    const contrast = getContrastRatio(choices.textColor, choices.bgColor);
    const size = choices.fontSize;
    const leading = choices.leading;
    
    let score = 0;
    const report = {
      contrast: { status: '', text: '', score: 0, val: contrast.toFixed(2) },
      size: { status: '', text: '', score: 0, val: size + 'px' },
      leading: { status: '', text: '', score: 0, val: leading }
    };

    if (contrast >= 7) {
      report.contrast = { status: 'Excellent', text: 'Passes WCAG AAA. Perfect for all readers.', score: 50, val: contrast.toFixed(2) };
    } else if (contrast >= 4.5) {
      report.contrast = { status: 'Good', text: 'Passes WCAG AA. Readable for most.', score: 40, val: contrast.toFixed(2) };
    } else if (contrast >= 3) {
      report.contrast = { status: 'Fair', text: 'Okay for large text, but fails for body text.', score: 20, val: contrast.toFixed(2) };
    } else {
      report.contrast = { status: 'Poor', text: 'Fails accessibility standards. Hard to read.', score: 0, val: contrast.toFixed(2) };
    }

    if (size >= 18) {
      report.size = { status: 'Excellent', text: 'Very comfortable reading size.', score: 30, val: size + 'px' };
    } else if (size >= 16) {
      report.size = { status: 'Good', text: 'Standard legible font size.', score: 25, val: size + 'px' };
    } else if (size >= 14) {
      report.size = { status: 'Fair', text: 'A bit small for prolonged reading.', score: 10, val: size + 'px' };
    } else {
      report.size = { status: 'Poor', text: 'Too small for accessible body text.', score: 0, val: size + 'px' };
    }

    if (leading >= 1.4 && leading <= 1.6) {
      report.leading = { status: 'Excellent', text: 'Perfect spacing for readability.', score: 20, val: leading };
    } else if (leading >= 1.2 && leading <= 1.8) {
      report.leading = { status: 'Good', text: 'Acceptable line height.', score: 15, val: leading };
    } else {
      report.leading = { status: 'Fair', text: 'Spacing may be too tight or too loose.', score: 5, val: leading };
    }

    score = report.contrast.score + report.size.score + report.leading.score;
    
    let finalGrade = 'Good';
    if (score >= 90) finalGrade = 'Excellent';
    else if (score >= 70) finalGrade = 'Good';
    else if (score >= 50) finalGrade = 'Fair';
    else finalGrade = 'Needs Work';

    return { score, grade: finalGrade, report };
  };

  if (showLearning) {
    const hasCompletedChoices = choices.specificFont !== null;
    return (
      <LearningResources
        fontFamily={getCurrentFont()}
        fontSize={choices.fontSize}
        lineHeight={choices.leading}
        textColor={choices.textColor}
        bgColor={choices.bgColor}
        onClose={handleStartOver}
        onViewSummary={hasCompletedChoices ? () => {
          setShowLearning(false);
          setStep(5);
        } : null}
      />
    );
  }

  // Welcome page
  if (step === -1) {
    const boxBg = getBoxBackground(choices.bgColor);
    return (
      <>
        <Navbar 
          onStartOver={handleStartOver}
          onSkipToLearning={() => setShowLearning(true)}
          fontFamily={getCurrentFont()}
          fontSize={choices.fontSize}
          lineHeight={choices.leading}
          textColor={choices.textColor}
          bgColor={choices.bgColor}
        />
        <div className="pageContainer" style={{ 
          marginTop: '80px',
          fontSize: `${choices.fontSize}px`,
          lineHeight: choices.leading,
          fontFamily: getCurrentFont(),
          maxWidth: '800px'
        }}>
          <div style={{
            backgroundColor: boxBg,
            borderColor: choices.textColor + '33',
            border: `2px solid ${choices.textColor}33`,
            borderRadius: '5px',
            padding: '3rem',
            textAlign: 'left'
          }}>
            <h1 style={{ 
              fontSize: `${choices.fontSize * 2.5}px`,
              lineHeight: choices.leading,
              color: choices.textColor,
              marginTop: 0,
              marginBottom: '1.5rem'
            }}>
              Welcome to What's My Type?
            </h1>
            <p style={{ 
              fontSize: `${choices.fontSize * 1.1}px`,
              lineHeight: choices.leading,
              color: choices.textColor,
              marginBottom: '1.5rem'
            }}>
              This interactive tool helps you discover your reading preferences by guiding you through key typography decisions.
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '2rem'
            }}>
              <button
                onClick={() => setStep(0)}
                style={{
                  backgroundColor: choices.textColor,
                  color: choices.bgColor,
                  border: 'none',
                  padding: '1rem 3rem',
                  borderRadius: '5px',
                  fontSize: `${choices.fontSize * 1.2}px`,
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Step 0: Choose Category
  if (step === 0) {
    return (
      <>
        <Navbar 
          onStartOver={handleStartOver}
          onSkipToLearning={() => setShowLearning(true)}
          fontFamily={getCurrentFont()}
          fontSize={choices.fontSize}
          lineHeight={choices.leading}
          textColor={choices.textColor}
          bgColor={choices.bgColor}
        />
        <div className="pageContainer" style={{ 
          marginTop: '80px',
          fontSize: `${choices.fontSize}px`,
          lineHeight: choices.leading,
          fontFamily: getCurrentFont()
        }}>
          <h2 style={{color: choices.textColor, marginBottom: '2rem'}}>Choose a Font Category</h2>
          <div className="choiceFontFamily" style={{ 
             display: 'grid', 
             gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
             gap: '2rem',
             width: '100%'
          }}>
            <OptionCard
              title="Serif"
              letter="Ag"
              description="Traditional, formal, and elegant. Small decorative strokes guide the eye along lines of text. Best for long-form reading."
              fontFamily="Georgia, serif"
              fontSize={choices.fontSize}
              lineHeight={choices.leading}
              textColor={choices.textColor}
              bgColor={choices.bgColor}
              onClick={() => {
                setChoices({ ...choices, fontCategory: 'serif' });
                setStep(1);
              }}
            />
            
            <OptionCard
              title="Sans-Serif"
              letter="Ag"
              description="Clean, modern, and simple. No decorative strokes. Excellent for digital interfaces and clarity."
              fontFamily="Arial, sans-serif"
              fontSize={choices.fontSize}
              lineHeight={choices.leading}
              textColor={choices.textColor}
              bgColor={choices.bgColor}
              onClick={() => {
                setChoices({ ...choices, fontCategory: 'sans-serif' });
                setStep(1);
              }}
            />

            <OptionCard
              title="Casual"
              letter="Ag"
              description="Friendly, open, and informal. Irregular shapes and humanist styles can often improve readability for some readers (dyslexia-friendly)."
              fontFamily='"Comic Sans MS", "Chalkboard SE", sans-serif'
              fontSize={choices.fontSize}
              lineHeight={choices.leading}
              textColor={choices.textColor}
              bgColor={choices.bgColor}
              onClick={() => {
                setChoices({ ...choices, fontCategory: 'casual' });
                setStep(1);
              }}
            />

            <OptionCard
              title="Monospace"
              letter="Ag"
              description="Distinct and technical. Every character has the same width. Great for distinguishing similar characters and coding."
              fontFamily='"Courier New", monospace'
              fontSize={choices.fontSize}
              lineHeight={choices.leading}
              textColor={choices.textColor}
              bgColor={choices.bgColor}
              onClick={() => {
                setChoices({ ...choices, fontCategory: 'monospace' });
                setStep(1);
              }}
            />
          </div>
        </div>
      </>
    );
  }

  // Step 1: Choose Specific Font
  if (step === 1) {
    const serifFonts = [
      { name: 'Georgia', family: 'Georgia, serif', description: "Designed for screens with large letterforms and sturdy serifs. Classic yet friendly." },
      { name: 'Times New Roman', family: '"Times New Roman", serif', description: "The standard for academic and formal documents. Highly familiar and traditional." },
      { name: 'Garamond', family: 'Garamond, serif', description: "Elegant and literary with refined strokes. A favorite for books." },
      { name: 'Merriweather', family: 'Merriweather, serif', description: "A modern serif designed specifically for easy reading on digital screens." }
    ];
    
    const sansSerifFonts = [
      { name: 'Arial', family: 'Arial, sans-serif', description: "Neutral and widely used. Simple shapes make it very legible." },
      { name: 'Helvetica', family: 'Helvetica, sans-serif', description: "The gold standard of modern, neutral design. Professional and clean." },
      { name: 'Verdana', family: 'Verdana, sans-serif', description: "Wide spacing and open letters make this excellent for small text on screens." },
      { name: 'Roboto', family: 'Roboto, sans-serif', description: "Friendly and open curves. A modern standard for mobile and web." }
    ];

    const casualFonts = [
      { name: 'Comic Sans MS', family: '"Comic Sans MS", "Chalkboard SE", sans-serif', description: "Often cited as dyslexia-friendly due to its unique, irregular character shapes that are hard to confuse." },
      { name: 'Trebuchet MS', family: '"Trebuchet MS", sans-serif', description: "A humanist sans-serif with open shapes and distinctive characters, offering great clarity." },
      { name: 'Century Gothic', family: '"Century Gothic", sans-serif', description: "Geometric and round. Its simple circles and straight lines provide a very clean look." },
      { name: 'Calibri', family: 'Calibri, sans-serif', description: "Soft, rounded corners and a modern feel. Warm and very comfortable to read." }
    ];

    const monospaceFonts = [
      { name: 'Courier New', family: '"Courier New", monospace', description: "The classic typewriter look. Slab serifs on a fixed-width grid." },
      { name: 'Consolas', family: 'Consolas, monospace', description: "Designed for modern programming environments. Clear and easy on the eyes." },
      { name: 'Lucida Console', family: '"Lucida Console", monospace', description: "A legible sans-serif monospace font with a high x-height." },
      { name: 'Andale Mono', family: '"Andale Mono", monospace', description: "A highly distinct monospace font originally designed for software command lines." }
    ];
    
    let fonts = [];
    if (choices.fontCategory === 'serif') fonts = serifFonts;
    else if (choices.fontCategory === 'sans-serif') fonts = sansSerifFonts;
    else if (choices.fontCategory === 'casual') fonts = casualFonts;
    else if (choices.fontCategory === 'monospace') fonts = monospaceFonts;
    
    return (
      <>
        <Navbar 
          onStartOver={handleStartOver}
          onSkipToLearning={() => setShowLearning(true)}
          fontFamily={getCurrentFont()}
          fontSize={choices.fontSize}
          lineHeight={choices.leading}
          textColor={choices.textColor}
          bgColor={choices.bgColor}
        />
        <div className="pageContainer" style={{ 
          marginTop: '80px',
          fontSize: `${choices.fontSize}px`,
          lineHeight: choices.leading,
          fontFamily: getCurrentFont()
        }}>
          <h2 style={{color: choices.textColor, marginBottom: '2rem'}}>Choose a Specific Font</h2>
          <div className="choiceFont">
            {fonts.map((font) => (
              <OptionCard
                key={font.name}
                title={font.name}
                letter="Ag"
                description={font.description}
                fontFamily={font.family}
                fontSize={choices.fontSize}
                lineHeight={choices.leading}
                textColor={choices.textColor}
                bgColor={choices.bgColor}
                onClick={() => {
                  setChoices({ ...choices, specificFont: font.name });
                  setStep(2);
                }}
              />
            ))}
          </div>
          
          <div className="navigationButtons">
            <button 
              onClick={() => setStep(0)} 
              className="navButton"
              style={{ 
                color: choices.bgColor, 
                backgroundColor: choices.textColor,
                fontSize: `${choices.fontSize * 1.1}px`,
                lineHeight: choices.leading
              }}
            >
              ← Back
            </button>
          </div>
        </div>
      </>
    );
  }

  // Steps 2, 3, 4 remain largely the same, just rendering the current component
  if (step === 2) {
    return (
      <>
        <Navbar 
          onStartOver={handleStartOver}
          onSkipToLearning={() => setShowLearning(true)}
          fontFamily={getCurrentFont()}
          fontSize={choices.fontSize}
          lineHeight={choices.leading}
          textColor={choices.textColor}
          bgColor={choices.bgColor}
        />
        <div className="pageContainer" style={{ 
          marginTop: '80px',
          fontSize: `${choices.fontSize}px`,
          lineHeight: choices.leading,
          fontFamily: getCurrentFont()
        }}>
          <div className="sliderContainer">
            <SliderOption
              title="Font Size"
              description="Adjust the size for comfortable reading. Larger text reduces eye strain."
              value={choices.fontSize}
              onChange={(value) => setChoices({ ...choices, fontSize: value })}
              min={12}
              max={32}
              step={1}
              unit="px"
              previewText="The quick brown fox jumps over the lazy dog. Adjusting font size helps people with low vision or reading difficulties."
              fontFamily={getCurrentFont()}
              fontSize={choices.fontSize}
              lineHeight={choices.leading}
              textColor={choices.textColor}
              bgColor={choices.bgColor}
            />
          </div>
          <div className="navigationButtons">
            <button 
              onClick={() => setStep(1)} 
              className="navButton"
              style={{ 
                color: choices.bgColor, 
                backgroundColor: choices.textColor,
                fontSize: `${choices.fontSize * 1.1}px`,
                lineHeight: choices.leading
              }}
            >
              ← Back
            </button>
            <button 
              onClick={() => setStep(3)} 
              className="navButton"
              style={{ 
                color: choices.bgColor, 
                backgroundColor: choices.textColor,
                fontSize: `${choices.fontSize * 1.1}px`,
                lineHeight: choices.leading
              }}
            >
              Continue →
            </button>
          </div>
        </div>
      </>
    );
  }

  if (step === 3) {
    return (
      <>
        <Navbar 
          onStartOver={handleStartOver}
          onSkipToLearning={() => setShowLearning(true)}
          fontFamily={getCurrentFont()}
          fontSize={choices.fontSize}
          lineHeight={choices.leading}
          textColor={choices.textColor}
          bgColor={choices.bgColor}
        />
        <div className="pageContainer" style={{ 
          marginTop: '80px',
          fontSize: `${choices.fontSize}px`,
          lineHeight: choices.leading,
          fontFamily: getCurrentFont()
        }}>
          <div className="sliderContainer">
            <SliderOption
              title="Leading (Line Height)"
              description="Adjust the vertical space between lines. More space often improves tracking for dyslexic readers."
              value={choices.leading}
              onChange={(value) => setChoices({ ...choices, leading: value })}
              min={1}
              max={2.5}
              step={0.1}
              unit=""
              previewText="The quick brown fox jumps over the lazy dog. Generous line spacing prevents the text from looking cluttered and makes it easier to keep your place while reading."
              fontFamily={getCurrentFont()}
              fontSize={choices.fontSize}
              lineHeight={choices.leading}
              textColor={choices.textColor}
              bgColor={choices.bgColor}
            />
          </div>
          <div className="navigationButtons">
            <button 
              onClick={() => setStep(2)} 
              className="navButton"
              style={{ 
                color: choices.bgColor, 
                backgroundColor: choices.textColor,
                fontSize: `${choices.fontSize * 1.1}px`,
                lineHeight: choices.leading
              }}
            >
              ← Back
            </button>
            <button 
              onClick={() => setStep(4)} 
              className="navButton"
              style={{ 
                color: choices.bgColor, 
                backgroundColor: choices.textColor,
                fontSize: `${choices.fontSize * 1.1}px`,
                lineHeight: choices.leading
              }}
            >
              Continue →
            </button>
          </div>
        </div>
      </>
    );
  }

  if (step === 4) {
    return (
      <>
        <Navbar 
          onStartOver={handleStartOver}
          onSkipToLearning={() => setShowLearning(true)}
          fontFamily={getCurrentFont()}
          fontSize={choices.fontSize}
          lineHeight={choices.leading}
          textColor={choices.textColor}
          bgColor={choices.bgColor}
        />
        <div className="pageContainer" style={{ 
          marginTop: '80px',
          fontSize: `${choices.fontSize}px`,
          lineHeight: choices.leading,
          fontFamily: getCurrentFont()
        }}>
          <div className="sliderContainer">
            <ColorOption
              title="Color Scheme"
              description="High contrast helps legibility, but some users prefer softer off-white backgrounds to reduce glare."
              currentTextColor={choices.textColor}
              currentBgColor={choices.bgColor}
              onTextChange={(color) => setChoices(prev => ({ ...prev, textColor: color }))}
              onBgChange={(color) => setChoices(prev => ({ ...prev, bgColor: color }))}
              onPresetChange={(textColor, bgColor) => setChoices(prev => ({ ...prev, textColor, bgColor }))}
              fontSize={choices.fontSize}
              lineHeight={choices.leading}
            />
          </div>
          <div className="navigationButtons">
            <button 
              onClick={() => setStep(3)} 
              className="navButton"
              style={{ 
                color: choices.bgColor, 
                backgroundColor: choices.textColor,
                fontSize: `${choices.fontSize * 1.1}px`,
                lineHeight: choices.leading
              }}
            >
              ← Back
            </button>
            <button 
              onClick={() => {
                saveChoicesToBackend();
                setShowLearning(true);
              }} 
              className="navButton"
              style={{ 
                color: choices.bgColor, 
                backgroundColor: choices.textColor,
                fontSize: `${choices.fontSize * 1.1}px`,
                lineHeight: choices.leading
              }}
            >
              Continue →
            </button>
          </div>
        </div>
      </>
    );
  }

  if (step === 5) {
    const rating = calculateRating();
    const boxBg = getBoxBackground(choices.bgColor);

    return (
      <>
        <Navbar 
          onStartOver={handleStartOver}
          onSkipToLearning={() => setShowLearning(true)}
          fontFamily={getCurrentFont()}
          fontSize={choices.fontSize}
          lineHeight={choices.leading}
          textColor={choices.textColor}
          bgColor={choices.bgColor}
        />
        <div className="pageContainer" style={{ 
            marginTop: '80px',
            fontSize: `${choices.fontSize}px`,
            lineHeight: choices.leading,
            fontFamily: getCurrentFont()
          }}>
          <div className="summaryPage">
            <h1 className="titleh1" style={{ 
              fontFamily: getCurrentFont(),
              fontSize: `${choices.fontSize * 1.8}px`,
              lineHeight: choices.leading,
              color: choices.textColor
            }}>
              Your Custom Style
            </h1>

            <div style={{
              backgroundColor: boxBg,
              border: `2px solid ${choices.textColor}33`,
              borderRadius: '5px',
              padding: '2rem',
              marginBottom: '2rem',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 style={{ margin: 0, fontSize: `${choices.fontSize * 1.5}px`, color: choices.textColor }}>
                  Best Practice Rating
                </h2>
                <div style={{ 
                  backgroundColor: choices.textColor, 
                  color: choices.bgColor, 
                  padding: '0.5rem 1rem', 
                  borderRadius: '5px', 
                  fontWeight: 'bold',
                  fontSize: `${choices.fontSize * 1.2}px`
                }}>
                  {rating.grade} ({rating.score}/100)
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <div style={{ padding: '1rem', border: `1px solid ${choices.textColor}22`, borderRadius: '4px' }}>
                  <strong style={{ display: 'block', color: choices.textColor, opacity: 0.7, marginBottom: '0.5rem' }}>
                    Contrast ({rating.report.contrast.val}:1)
                  </strong>
                  <div style={{ fontSize: `${choices.fontSize * 1.1}px`, fontWeight: '600', color: choices.textColor, marginBottom: '0.5rem' }}>
                    {rating.report.contrast.status}
                  </div>
                  <p style={{ margin: 0, fontSize: `${choices.fontSize * 0.9}px`, color: choices.textColor, opacity: 0.9 }}>
                    {rating.report.contrast.text}
                  </p>
                </div>

                <div style={{ padding: '1rem', border: `1px solid ${choices.textColor}22`, borderRadius: '4px' }}>
                  <strong style={{ display: 'block', color: choices.textColor, opacity: 0.7, marginBottom: '0.5rem' }}>
                    Font Size ({rating.report.size.val})
                  </strong>
                  <div style={{ fontSize: `${choices.fontSize * 1.1}px`, fontWeight: '600', color: choices.textColor, marginBottom: '0.5rem' }}>
                    {rating.report.size.status}
                  </div>
                  <p style={{ margin: 0, fontSize: `${choices.fontSize * 0.9}px`, color: choices.textColor, opacity: 0.9 }}>
                    {rating.report.size.text}
                  </p>
                </div>

                <div style={{ padding: '1rem', border: `1px solid ${choices.textColor}22`, borderRadius: '4px' }}>
                  <strong style={{ display: 'block', color: choices.textColor, opacity: 0.7, marginBottom: '0.5rem' }}>
                    Leading ({rating.report.leading.val})
                  </strong>
                  <div style={{ fontSize: `${choices.fontSize * 1.1}px`, fontWeight: '600', color: choices.textColor, marginBottom: '0.5rem' }}>
                    {rating.report.leading.status}
                  </div>
                  <p style={{ margin: 0, fontSize: `${choices.fontSize * 0.9}px`, color: choices.textColor, opacity: 0.9 }}>
                    {rating.report.leading.text}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="customChoicesSummary" style={{ 
              backgroundColor: getBoxBackground(choices.bgColor),
              borderColor: choices.textColor + '33',
              color: choices.textColor,
              fontSize: `${choices.fontSize}px`,
              lineHeight: choices.leading
            }}>
              <h3 className="yourChoices" style={{ 
                fontSize: `${choices.fontSize * 1.3}px`, 
                color: choices.textColor,
                lineHeight: choices.leading 
              }}>Your Choices:</h3>
              <p className="spesification">Font Category: <strong>{choices.fontCategory}</strong></p>
              <p className="spesification">Specific Font: <strong>{choices.specificFont}</strong></p>
              <p className="spesification">Font Size: <strong>{choices.fontSize}px</strong></p>
              <p className="spesification">Leading: <strong>{choices.leading}</strong></p>
              <p className="spesification">Text Color: <strong>{choices.textColor}</strong></p>
              <p className="spesification">Background Color: <strong>{choices.bgColor}</strong></p>
            </div>
            
            <div 
              className="sampleText"
              style={{
                fontFamily: getCurrentFont(),
                color: choices.textColor,
                backgroundColor: getBoxBackground(choices.bgColor),
                borderColor: choices.textColor + '33',
                fontSize: `${choices.fontSize}px`,
                lineHeight: choices.leading
              }}
            >
              <h2 style={{ fontSize: `${choices.fontSize * 1.5}px`, lineHeight: choices.leading, color: choices.textColor }}>Sample Text</h2>
              <p>
                This is how your text will look with the selected font, size, leading, and colors. 
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
                tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <p>
                The quick brown fox jumps over the lazy dog. 
                ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 1234567890
              </p>
            </div>

            <div className="navigationButtons" style={{ gap: '1.5rem', marginTop: '2rem' }}>
              <button 
                onClick={() => setShowLearning(true)}
                className="navButton"
                style={{ 
                  color: choices.bgColor, 
                  backgroundColor: choices.textColor,
                  fontSize: `${choices.fontSize * 1.1}px`,
                  lineHeight: choices.leading
                }}
              >
                Learn About Typography & Accessibility
              </button>
            </div>
          </div>
          
          <div className="navigationButtons">
            <button 
              onClick={() => setStep(4)} 
              className="navButton"
              style={{ 
                color: choices.bgColor, 
                backgroundColor: choices.textColor,
                fontSize: `${choices.fontSize * 1.1}px`,
                lineHeight: choices.leading
              }}
            >
              ← Back
            </button>
          </div>
        </div>
      </>
    );
  }
}

export default App;