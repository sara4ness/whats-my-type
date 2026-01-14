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
        borderColor: textColor + '33'
      }}
    >
      <div className="fontFamily" style={{ fontSize: `${fontSize * 2.5}px`, lineHeight: lineHeight }}>
        {letter}
      </div>
      <h2 className="titleh2" style={{ fontSize: `${fontSize * 1.3}px`, lineHeight: lineHeight }}>
        {title}
      </h2>
      <p className="description" style={{ color: textColor + 'CC', fontSize: `${fontSize}px`, lineHeight: lineHeight }}>
        {description}
      </p>
    </div>
  );
}

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

function getBoxBackground(bgColor) {
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? adjustBrightness(bgColor, -3) : adjustBrightness(bgColor, 8);
}

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
          <input type="color" value={currentTextColor} onChange={(e) => onTextChange(e.target.value)} className="colorInput" />
          <span className="colorValue" style={{ color: currentTextColor, fontSize: `${fontSize * 0.9}px` }}>{currentTextColor}</span>
        </div>
        <div className="colorPickerGroup">
          <label style={{ color: currentTextColor, fontSize: `${fontSize * 1.1}px`, lineHeight: lineHeight }}>Background Color</label>
          <input type="color" value={currentBgColor} onChange={(e) => onBgChange(e.target.value)} className="colorInput" />
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
              style={{ backgroundColor: preset.bg, color: preset.text, border: `2px solid ${preset.text}33`, fontSize: `${fontSize}px`, lineHeight: lineHeight }}
              onClick={() => onPresetChange ? onPresetChange(preset.text, preset.bg) : (onTextChange(preset.text), onBgChange(preset.bg))}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

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
  const [sessionId] = useState(() => 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9));

  const getCurrentFont = () => {
    if (!choices.specificFont) return 'system-ui';
    const fonts = {
      'Georgia': 'Georgia, serif',
      'Times New Roman': '"Times New Roman", serif',
      'Garamond': 'Garamond, serif',
      'Merriweather': 'Merriweather, serif',
      'Arial': 'Arial, sans-serif',
      'Helvetica': 'Helvetica, sans-serif',
      'Verdana': 'Verdana, sans-serif',
      'Roboto': 'Roboto, sans-serif'
    };
    return fonts[choices.specificFont] || 'system-ui';
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
      await fetch(`${API_URL}/api/save-choices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...choices, sessionId })
      });
    } catch (error) {
      console.error('Error saving choices:', error);
    }
  };

  const handleStartOver = () => {
    setChoices({ fontCategory: null, specificFont: null, fontSize: 16, leading: 1.5, textColor: '#000000', bgColor: '#ffffff' });
    setStep(-1);
    setShowLearning(false);
    localStorage.removeItem('userChoices');
    document.body.style.backgroundColor = '#ffffff';
    document.body.style.color = '#000000';
    document.body.style.fontFamily = 'system-ui';
  };

  const calculateRating = () => {
    const contrast = getContrastRatio(choices.textColor, choices.bgColor);
    const { fontSize: size, leading } = choices;
    const report = {
      contrast: contrast >= 7 ? { status: 'Excellent', text: 'Passes WCAG AAA.', score: 50, val: contrast.toFixed(2) } :
                contrast >= 4.5 ? { status: 'Good', text: 'Passes WCAG AA.', score: 40, val: contrast.toFixed(2) } :
                contrast >= 3 ? { status: 'Fair', text: 'Okay for large text.', score: 20, val: contrast.toFixed(2) } :
                { status: 'Poor', text: 'Fails standards.', score: 0, val: contrast.toFixed(2) },
      size: size >= 18 ? { status: 'Excellent', text: 'Very comfortable size.', score: 30, val: size + 'px' } :
            size >= 16 ? { status: 'Good', text: 'Standard legible size.', score: 25, val: size + 'px' } :
            size >= 14 ? { status: 'Fair', text: 'A bit small.', score: 10, val: size + 'px' } :
            { status: 'Poor', text: 'Too small.', score: 0, val: size + 'px' },
      leading: (leading >= 1.4 && leading <= 1.6) ? { status: 'Excellent', text: 'Perfect spacing.', score: 20, val: leading } :
               (leading >= 1.2 && leading <= 1.8) ? { status: 'Good', text: 'Acceptable spacing.', score: 15, val: leading } :
               { status: 'Fair', text: 'Spacing may be off.', score: 5, val: leading }
    };
    const score = report.contrast.score + report.size.score + report.leading.score;
    const grade = score >= 90 ? 'Excellent' : score >= 70 ? 'Good' : score >= 50 ? 'Fair' : 'Needs Work';
    return { score, grade, report };
  };

  // --- NAVIGATION LOGIC ---
  const hasCompletedChoices = choices.specificFont !== null;
  const handleViewSummary = hasCompletedChoices ? () => {
    setShowLearning(false);
    setStep(5);
  } : null;

  if (showLearning) {
    return (
      <LearningResources
        fontFamily={getCurrentFont()}
        fontSize={choices.fontSize}
        lineHeight={choices.leading}
        textColor={choices.textColor}
        bgColor={choices.bgColor}
        onClose={handleStartOver}
        onViewSummary={handleViewSummary}
      />
    );
  }

  // Common props for Navbar in all steps
  const navProps = {
    onStartOver: handleStartOver,
    onSkipToLearning: () => setShowLearning(true),
    onViewSummary: handleViewSummary,
    fontFamily: getCurrentFont(),
    fontSize: choices.fontSize,
    lineHeight: choices.leading,
    textColor: choices.textColor,
    bgColor: choices.bgColor
  };

  if (step === -1) {
    return (
      <>
        <Navbar {...navProps} />
        <div className="pageContainer" style={{ marginTop: '80px', fontSize: `${choices.fontSize}px`, lineHeight: choices.leading, fontFamily: getCurrentFont(), maxWidth: '800px' }}>
          <div style={{ backgroundColor: getBoxBackground(choices.bgColor), border: `2px solid ${choices.textColor}33`, borderRadius: '5px', padding: '3rem' }}>
            <h1 style={{ fontSize: `${choices.fontSize * 2.5}px`, marginBottom: '1.5rem' }}>Welcome to What's My Type?</h1>
            <p>Discover your reading preferences through guided typography choices. Your settings will be used to create a personalized reading experience.</p>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
              <button onClick={() => setStep(0)} className="navButton" style={{ padding: '1rem 3rem', backgroundColor: choices.textColor, color: choices.bgColor }}>Get Started</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (step === 0) {
    return (
      <>
        <Navbar {...navProps} />
        <div className="pageContainer" style={{ marginTop: '80px' }}>
          <div className="choiceFontFamily">
            <OptionCard title="Serif" description="Traditional and elegant with small strokes at the ends of letters." fontFamily="Georgia, serif" fontSize={choices.fontSize} lineHeight={choices.leading} textColor={choices.textColor} bgColor={choices.bgColor} onClick={() => { setChoices({ ...choices, fontCategory: 'serif' }); setStep(1); }} />
            <OptionCard title="Sans-Serif" description="Clean and modern without decorative strokes." fontFamily="Arial, sans-serif" fontSize={choices.fontSize} lineHeight={choices.leading} textColor={choices.textColor} bgColor={choices.bgColor} onClick={() => { setChoices({ ...choices, fontCategory: 'sans-serif' }); setStep(1); }} />
          </div>
        </div>
      </>
    );
  }

  if (step === 1) {
    const fonts = choices.fontCategory === 'serif' ? 
      [{ name: 'Georgia' }, { name: 'Times New Roman' }, { name: 'Garamond' }, { name: 'Merriweather' }] : 
      [{ name: 'Arial' }, { name: 'Helvetica' }, { name: 'Verdana' }, { name: 'Roboto' }];
    
    return (
      <>
        <Navbar {...navProps} />
        <div className="pageContainer" style={{ marginTop: '80px' }}>
          <div className="choiceFont">
            {fonts.map((f) => (
              <OptionCard key={f.name} title={f.name} description={`A popular ${choices.fontCategory} font.`} fontFamily={f.name} fontSize={choices.fontSize} lineHeight={choices.leading} textColor={choices.textColor} bgColor={choices.bgColor} onClick={() => { setChoices({ ...choices, specificFont: f.name }); setStep(2); }} />
            ))}
          </div>
          <div className="navigationButtons"><button onClick={() => setStep(0)} className="navButton" style={{ backgroundColor: choices.textColor, color: choices.bgColor }}>← Back</button></div>
        </div>
      </>
    );
  }

  if (step === 2) {
    return (
      <>
        <Navbar {...navProps} />
        <div className="pageContainer" style={{ marginTop: '80px' }}>
          <SliderOption title="Font Size" value={choices.fontSize} onChange={(v) => setChoices({ ...choices, fontSize: v })} min={12} max={32} unit="px" previewText="The quick brown fox jumps over the lazy dog." {...choices} fontFamily={getCurrentFont()} />
          <div className="navigationButtons">
            <button onClick={() => setStep(1)} className="navButton" style={{ backgroundColor: choices.textColor, color: choices.bgColor }}>← Back</button>
            <button onClick={() => setStep(3)} className="navButton" style={{ backgroundColor: choices.textColor, color: choices.bgColor }}>Continue →</button>
          </div>
        </div>
      </>
    );
  }

  if (step === 3) {
    return (
      <>
        <Navbar {...navProps} />
        <div className="pageContainer" style={{ marginTop: '80px' }}>
          <SliderOption title="Leading" value={choices.leading} onChange={(v) => setChoices({ ...choices, leading: v })} min={1} max={2.5} step={0.1} previewText="Line spacing affects readability." {...choices} fontFamily={getCurrentFont()} />
          <div className="navigationButtons">
            <button onClick={() => setStep(2)} className="navButton" style={{ backgroundColor: choices.textColor, color: choices.bgColor }}>← Back</button>
            <button onClick={() => setStep(4)} className="navButton" style={{ backgroundColor: choices.textColor, color: choices.bgColor }}>Continue →</button>
          </div>
        </div>
      </>
    );
  }

  if (step === 4) {
    return (
      <>
        <Navbar {...navProps} />
        <div className="pageContainer" style={{ marginTop: '80px' }}>
          <ColorOption title="Colors" currentTextColor={choices.textColor} currentBgColor={choices.bgColor} onTextChange={(c) => setChoices(p => ({...p, textColor: c}))} onBgChange={(c) => setChoices(p => ({...p, bgColor: c}))} onPresetChange={(t, b) => setChoices(p => ({...p, textColor: t, bgColor: b}))} fontSize={choices.fontSize} lineHeight={choices.leading} />
          <div className="navigationButtons">
            <button onClick={() => setStep(3)} className="navButton" style={{ backgroundColor: choices.textColor, color: choices.bgColor }}>← Back</button>
            <button onClick={() => { saveChoicesToBackend(); setShowLearning(true); }} className="navButton" style={{ backgroundColor: choices.textColor, color: choices.bgColor }}>Continue →</button>
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
        <Navbar {...navProps} />
        <div className="pageContainer" style={{ marginTop: '80px', fontFamily: getCurrentFont() }}>
          <div className="summaryPage">
            <div style={{ backgroundColor: boxBg, border: `2px solid ${choices.textColor}33`, padding: '2rem', marginBottom: '2rem' }}>
              <h2>Best Practice Rating: {rating.grade} ({rating.score}/100)</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div><strong>Contrast:</strong> {rating.report.contrast.status}</div>
                <div><strong>Size:</strong> {rating.report.size.status}</div>
                <div><strong>Leading:</strong> {rating.report.leading.status}</div>
              </div>
            </div>
            <button onClick={() => setShowLearning(true)} className="navButton" style={{ backgroundColor: choices.textColor, color: choices.bgColor }}>Back to Resources</button>
          </div>
        </div>
      </>
    );
  }
}

export default App;