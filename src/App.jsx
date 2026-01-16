import React, { useState, useEffect } from 'react';
import './App.css';
import LearningResources from './components/LearningResources';
import Navbar from './components/Navbar'; // Import the extracted component

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
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div 
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      className="optionBox"
      style={{ 
        fontFamily,
        fontSize: `${fontSize}px`,
        lineHeight: lineHeight,
        color: textColor,
        backgroundColor: boxBg,
        borderColor: textColor + '33',
        cursor: 'pointer'
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
        aria-label={title}
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
            aria-label="Text Color"
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
            aria-label="Background Color"
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
    // Generate a unique session ID for this user
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  });

  const getCurrentFont = () => {
    if (!choices.specificFont) return 'system-ui';
    
    // Serif fonts
    if (choices.specificFont === 'Georgia') return 'Georgia, serif';
    if (choices.specificFont === 'Times New Roman') return '"Times New Roman", serif';
    if (choices.specificFont === 'Garamond') return 'Garamond, serif';
    if (choices.specificFont === 'Merriweather') return 'Merriweather, serif';
    
    // Sans-serif fonts
    if (choices.specificFont === 'Arial') return 'Arial, sans-serif';
    if (choices.specificFont === 'Helvetica') return 'Helvetica, sans-serif';
    if (choices.specificFont === 'Verdana') return 'Verdana, sans-serif';
    if (choices.specificFont === 'Roboto') return 'Roboto, sans-serif';
    
    // Rounded fonts
    if (choices.specificFont === 'Comic Sans MS') return '"Comic Sans MS", "Trebuchet MS", cursive';
    if (choices.specificFont === 'Trebuchet MS') return '"Trebuchet MS", sans-serif';
    if (choices.specificFont === 'Tahoma') return 'Tahoma, sans-serif';
    if (choices.specificFont === 'Century Gothic') return '"Century Gothic", sans-serif';
    
    // Monospace fonts
    if (choices.specificFont === 'Courier New') return '"Courier New", monospace';
    if (choices.specificFont === 'Consolas') return 'Consolas, monospace';
    if (choices.specificFont === 'Monaco') return 'Monaco, monospace';
    if (choices.specificFont === 'Source Code Pro') return '"Source Code Pro", monospace';
    
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
      // Don't block the user if backend is down
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

  // --- Rating Calculation Logic (Added) ---
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

    // 1. Contrast (50 points max)
    if (contrast >= 7) {
      report.contrast = { status: 'Excellent', text: 'Passes WCAG AAA. Perfect for all readers.', score: 50, val: contrast.toFixed(2) };
    } else if (contrast >= 4.5) {
      report.contrast = { status: 'Good', text: 'Passes WCAG AA. Readable for most.', score: 40, val: contrast.toFixed(2) };
    } else if (contrast >= 3) {
      report.contrast = { status: 'Fair', text: 'Okay for large text, but fails for body text.', score: 20, val: contrast.toFixed(2) };
    } else {
      report.contrast = { status: 'Poor', text: 'Fails accessibility standards. Hard to read.', score: 0, val: contrast.toFixed(2) };
    }

    // 2. Font Size (30 points max)
    if (size >= 18) {
      report.size = { status: 'Excellent', text: 'Very comfortable reading size.', score: 30, val: size + 'px' };
    } else if (size >= 16) {
      report.size = { status: 'Good', text: 'Standard legible font size.', score: 25, val: size + 'px' };
    } else if (size >= 14) {
      report.size = { status: 'Fair', text: 'A bit small for prolonged reading.', score: 10, val: size + 'px' };
    } else {
      report.size = { status: 'Poor', text: 'Too small for accessible body text.', score: 0, val: size + 'px' };
    }

    // 3. Leading (20 points max)
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

  // Show learning resources
  if (showLearning) {
    // Only show summary option if user has completed choices (has a specific font selected)
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

  // Welcome page (step -1)
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
              This interactive tool helps you discover your reading preferences by guiding you through key typography decisions. You will make choices about font style, size, spacing, and colors to create a personalized reading experience.
            </p>

            <h2 style={{ 
              fontSize: `${choices.fontSize * 1.5}px`,
              lineHeight: choices.leading,
              color: choices.textColor,
              marginTop: '2rem',
              marginBottom: '1rem'
            }}>
              What You'll Do
            </h2>
            
            <ul style={{ 
              fontSize: `${choices.fontSize}px`,
              lineHeight: choices.leading,
              color: choices.textColor,
              marginBottom: '1.5rem',
              paddingLeft: '1.5rem'
            }}>
              <li style={{ marginBottom: '0.75rem' }}>
                Choose between serif, sans-serif, rounded, and monospace font categories
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                Select a specific typeface that appeals to you
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                Adjust font size and line spacing for comfortable reading
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                Pick text and background colors that work well together
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                Learn about typography fundamentals, accessibility, and UX design
              </li>
            </ul>

            <h2 style={{ 
              fontSize: `${choices.fontSize * 1.5}px`,
              lineHeight: choices.leading,
              color: choices.textColor,
              marginTop: '2rem',
              marginBottom: '1rem'
            }}>
              Why This Matters
            </h2>
            
            <p style={{ 
              fontSize: `${choices.fontSize}px`,
              lineHeight: choices.leading,
              color: choices.textColor,
              marginBottom: '2rem'
            }}>
              Typography significantly impacts readability, comprehension, and user experience. Understanding your preferences helps you make informed design decisions and appreciate the thought that goes into creating accessible, well-designed interfaces. Your choices will be saved anonymously to help us understand common reading preferences.
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
                  cursor: 'pointer',
                  transition: 'opacity 0.2s, transform 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.opacity = '0.9';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.opacity = '1';
                  e.target.style.transform = 'translateY(0)';
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
          <div className="choiceFontFamily">
            <OptionCard
              title="Serif"
              description="Serif fonts are typefaces with small decorative strokes (serifs) at the ends of letters. They have a traditional, formal, and elegant appearance, which helps guide the reader's eye along lines of text. Serif fonts are often used in books, newspapers, academic writing, and classic branding."
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
              description="Sans serif fonts are typefaces without the small decorative strokes (serifs) at the ends of letters. They have a clean, simple, and modern look, which makes them easy to read—especially on screens. Sans serif fonts are commonly used in web design, user interfaces, signage, and contemporary branding."
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
              title="Rounded"
              description="Rounded fonts feature soft, curved letterforms with gentle edges that create a friendly and approachable feel. These fonts often have open, spacious characters that are easy to distinguish from one another, making them accessible and comfortable for extended reading. They work well for casual content and warm, welcoming interfaces."
              fontFamily="'Comic Sans MS', 'Trebuchet MS', cursive"
              fontSize={choices.fontSize}
              lineHeight={choices.leading}
              textColor={choices.textColor}
              bgColor={choices.bgColor}
              onClick={() => {
                setChoices({ ...choices, fontCategory: 'rounded' });
                setStep(1);
              }}
            />
            
            <OptionCard
              title="Monospace"
              description="Monospace fonts have fixed-width characters where each letter occupies the same horizontal space. Originally designed for typewriters and coding, these fonts create a distinctive, technical aesthetic with precise alignment. They offer excellent readability for structured content and provide a unique reading rhythm that some find particularly comfortable."
              fontFamily="'Courier New', Consolas, monospace"
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
    
    const roundedFonts = [
      { name: 'Comic Sans MS', family: '"Comic Sans MS", "Trebuchet MS", cursive', description: "Comic Sans MS is a casual, rounded typeface with friendly, approachable letterforms. Its distinctive, irregular character shapes and generous spacing make it particularly accessible for readers who benefit from less uniform letterforms, including those with dyslexia. While often used informally, its readability characteristics make it valuable for accessible design." },
      { name: 'Trebuchet MS', family: '"Trebuchet MS", sans-serif', description: "Trebuchet MS is a humanist sans serif with slightly rounded edges and open, spacious letterforms. Its clean design with subtle warmth makes it versatile for both body text and headings, offering good readability while maintaining a friendly, modern appearance."},
      { name: 'Tahoma', family: 'Tahoma, sans-serif', description: "Tahoma is a compact, rounded sans serif typeface with narrow letterforms and tight spacing. Designed for screen readability, it maintains clarity even at small sizes and offers a neat, professional appearance with a slightly softer edge than traditional sans serifs."},
      { name: 'Century Gothic', family: '"Century Gothic", sans-serif', description: "Century Gothic is a geometric sans serif with rounded, circular letterforms based on early 20th-century design principles. Its uniform, open characters create a clean, modern look that's particularly effective for headlines and short text passages, though its geometric precision works well for longer reading too."}
    ];
    
    const monospaceFonts = [
      { name: 'Courier New', family: '"Courier New", monospace', description: "Courier New is a classic monospaced typeface modeled after typewriter fonts, where each character occupies exactly the same width. Its clear, mechanical appearance and consistent spacing make it ideal for code, tabular data, and any content requiring precise alignment. The uniform width creates a distinctive reading rhythm."},
      { name: 'Consolas', family: 'Consolas, monospace', description: "Consolas is a modern monospaced typeface designed specifically for programming environments, featuring enhanced clarity and subtle humanist touches. Its carefully balanced proportions and improved letterform distinction (especially between similar characters like 0/O and 1/l/I) make it excellent for code and technical documentation."},
      { name: 'Monaco', family: 'Monaco, monospace', description: "Monaco is a clean, highly legible monospaced typeface originally designed for the classic Mac OS. Its generous spacing, clear distinction between similar characters, and slightly rounded forms make it comfortable for extended reading of code or technical content, with a balanced blend of functionality and visual appeal."},
      { name: 'Source Code Pro', family: '"Source Code Pro", monospace', description: "Source Code Pro is a contemporary monospaced typeface created specifically for coding environments. It features excellent character distinction, optimized spacing, and multiple weights, making it versatile for both editors and documentation. Its modern design balances technical precision with comfortable readability for long coding sessions."}
    ];
    
    let fonts;
    if (choices.fontCategory === 'serif') {
      fonts = serifFonts;
    } else if (choices.fontCategory === 'sans-serif') {
      fonts = sansSerifFonts;
    } else if (choices.fontCategory === 'rounded') {
      fonts = roundedFonts;
    } else if (choices.fontCategory === 'monospace') {
      fonts = monospaceFonts;
    }
    
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
          <div className="choiceFont">
            {fonts.map((font) => (
              <OptionCard
                key={font.name}
                title={font.name}
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
              description="Choose colors that work well together and ensure good readability. High contrast between text and background improves legibility."
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
                // Save data to backend before showing learning resources
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
    // --- Calculate Rating for Summary View ---
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
        <div 
          className="pageContainer"
          style={{ 
            marginTop: '80px',
            fontSize: `${choices.fontSize}px`,
            lineHeight: choices.leading,
            fontFamily: getCurrentFont()
          }}
        >
          <div className="summaryPage">
            <h1 className="titleh1" style={{ 
              fontFamily: getCurrentFont(),
              fontSize: `${choices.fontSize * 1.8}px`,
              lineHeight: choices.leading,
              color: choices.textColor
            }}>
              Your Custom Style
            </h1>

            {/* --- NEW RATING CARD --- */}
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
                {/* Contrast Metric */}
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

                {/* Size Metric */}
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

                {/* Leading Metric */}
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
              <p className="spesification" style={{ 
                color: choices.textColor,
                fontSize: `${choices.fontSize}px`,
                lineHeight: choices.leading 
              }}>Font Category: <strong>{choices.fontCategory}</strong></p>
              <p className="spesification" style={{ 
                color: choices.textColor,
                fontSize: `${choices.fontSize}px`,
                lineHeight: choices.leading 
              }}>Specific Font: <strong>{choices.specificFont}</strong></p>
              <p className="spesification" style={{ 
                color: choices.textColor,
                fontSize: `${choices.fontSize}px`,
                lineHeight: choices.leading 
              }}>Font Size: <strong>{choices.fontSize}px</strong></p>
              <p className="spesification" style={{ 
                color: choices.textColor,
                fontSize: `${choices.fontSize}px`,
                lineHeight: choices.leading 
              }}>Leading: <strong>{choices.leading}</strong></p>
              <p className="spesification" style={{ 
                color: choices.textColor,
                fontSize: `${choices.fontSize}px`,
                lineHeight: choices.leading 
              }}>Text Color: <strong>{choices.textColor}</strong></p>
              <p className="spesification" style={{ 
                color: choices.textColor,
                fontSize: `${choices.fontSize}px`,
                lineHeight: choices.leading 
              }}>Background Color: <strong>{choices.bgColor}</strong></p>
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
              <h2 style={{ 
                fontSize: `${choices.fontSize * 1.5}px`, 
                lineHeight: choices.leading, 
                color: choices.textColor 
              }}>Sample Text</h2>
              <p style={{ 
                fontSize: `${choices.fontSize}px`, 
                lineHeight: choices.leading 
              }}>
                This is how your text will look with the selected font, size, leading, and colors. 
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p style={{ 
                fontSize: `${choices.fontSize}px`, 
                lineHeight: choices.leading 
              }}>
                The quick brown fox jumps over the lazy dog. 
                ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 1234567890
              </p>
              <p style={{ 
                fontSize: `${choices.fontSize}px`, 
                lineHeight: choices.leading 
              }}>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
                eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
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