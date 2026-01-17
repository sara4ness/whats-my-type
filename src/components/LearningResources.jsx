import React, { useState } from 'react';
import './LearningResources.css';
import Navbar from './Navbar'; 

function LearningResources({ fontFamily, fontSize, lineHeight, textColor, bgColor, onClose, onViewSummary }) {
  const [flippedCardId, setFlippedCardId] = useState(null);
  const [activeTab, setActiveTab] = useState('ux');

  const adjustBrightness = (hex, percent) => {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255))
      .toString(16).slice(1);
  };

  const getContrastColor = (bg) => {
    const hex = bg.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? adjustBrightness(bg, -10) : adjustBrightness(bg, 15);
  };

  const cardBg = getContrastColor(bgColor);
  const cardBorder = `${textColor}22`;
  
  // Dynamic Sizing Logic
  const cardHeight = `${Math.max(320, fontSize * 20)}px`;
  const minCardWidth = Math.max(600, 600 + (fontSize - 16) * 15);

  const principles = [
    // --- UX DESIGN ---
    {
      id: 2,
      tab: 'ux',
      category: "Heuristics",
      title: "Visibility of System Status",
      summary: "Keep users informed about what is going on.",
      details: "Nielsen's 1st Heuristic: The design should always keep users informed about what is going on, through appropriate feedback within a reasonable amount of time. Examples include loading spinners, progress bars, and success notifications.",
      action: "Ensure every user action has a clear reaction."
    },
    {
      id: 3,
      tab: 'ux',
      category: "Cognitive Psychology",
      title: "Cognitive Load",
      summary: "Don't make the user think too hard.",
      details: "Cognitive load refers to the amount of working memory resources used. 'Extraneous' load comes from bad design (distractions, clutter). 'Germane' load is the effort needed to learn. Good UX minimizes extraneous load so users can focus on their actual task.",
      action: "Simplify interfaces and remove non-essential elements."
    },
    {
      id: 4,
      tab: 'ux',
      category: "Heuristics",
      title: "Error Prevention",
      summary: "Better a good design than a good error message.",
      details: "Nielsen's 5th Heuristic: Good design prevents problems from occurring in the first place. Eliminate error-prone conditions or check for them and present users with a confirmation option before they commit to the action.",
      action: "Use constraints (like date pickers) instead of free text."
    },
    {
      id: 5,
      tab: 'ux',
      category: "Gestalt Principles",
      title: "Law of Proximity",
      summary: "Things close together appear grouped.",
      details: "Objects that are near, or proximate to each other, tend to be grouped together. This is a fundamental way we organize information. We perceive elements that are closer together as related, while those further apart are unrelated.",
      action: "Use whitespace to group related controls."
    },
    {
      id: 7,
      tab: 'ux',
      category: "Typography",
      title: "Line Length (Measure)",
      summary: "Avoid lines that are too long to track.",
      details: "For comfortable reading, a line of text should be 50–75 characters long. If lines are too long, the eye has trouble tracking back to the start of the next line. If too short, the rhythm breaks.",
      action: "Limit container width on large screens."
    },
    {
      id: 8,
      tab: 'ux',
      category: "Psychology",
      title: "Fitts's Law",
      summary: "Big and close targets are easier to hit.",
      details: "The time to acquire a target is a function of the distance to and size of the target. Make touch targets (buttons, links) large enough (at least 44x44px) and place commonly used actions in easy-to-reach zones.",
      action: "Increase padding on clickable elements."
    },

    {
      id: 1,
      tab: 'accessibility',
      category: "Visual",
      title: "WCAG 2.1 Contrast",
      summary: "Text must distinguish clearly from its background.",
      details: "The Web Content Accessibility Guidelines (WCAG) require a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text (18pt+). This ensures content is readable by people with moderately low vision.",
      action: "Check your contrast ratios using tools like WebAIM."
    },
    {
      id: 6,
      tab: 'accessibility',
      category: "Navigation",
      title: "Focus Indicators",
      summary: "Show where the keyboard is.",
      details: "Sighted keyboard users need a visible indicator (usually a ring or outline) to know which element currently has focus. Removing outline:none without a replacement breaks accessibility for power users and those with motor disabilities.",
      action: "Never remove CSS outlines without adding a custom style."
    },
    {
      id: 9,
      tab: 'accessibility',
      category: "Structure",
      title: "Semantic HTML",
      summary: "Use the right tag for the job.",
      details: "Screen readers rely on proper HTML tags (button, nav, main, h1) to understand the structure of a page. Using <div>s for everything hides meaning and functionality from assistive technologies.",
      action: "Use <button> for actions, not <div onClick>."
    },
    {
      id: 10,
      tab: 'accessibility',
      category: "Content",
      title: "Alt Text",
      summary: "Describe images for those who can't see them.",
      details: "Alternative text provides a textual alternative to non-text content in web pages. It is read by screen readers in place of images allowing the content and function of the image to be understood by those with visual or cognitive disabilities.",
      action: "Describe the function or content, not just 'image'."
    }
  ];

  const handleCardClick = (id) => {
    setFlippedCardId(flippedCardId === id ? null : id);
  };

  const filteredPrinciples = principles.filter(p => p.tab === activeTab);

  return (
    <>
      <Navbar 
        onStartOver={onClose} 
        onSkipToLearning={() => {}} 
        showLearningButton={false} 
        onViewSummary={onViewSummary}
        fontFamily={fontFamily}
        fontSize={fontSize}
        lineHeight={lineHeight}
        textColor={textColor}
        bgColor={bgColor}
      />
      <div className="learningContainer" style={{ 
        fontFamily,
        fontSize: `${fontSize}px`,
        lineHeight,
        color: textColor,
        backgroundColor: bgColor,
        paddingTop: '100px'
      }}>
        
        <div className="learningHeader">
          <h1 style={{ fontSize: `${fontSize * 2}px`, marginBottom: '1rem' }}>
            UX & Design Principles
          </h1>
          
          <div className="tabsContainer">
            <button 
              className={`tabButton ${activeTab === 'ux' ? 'active' : ''}`}
              onClick={() => setActiveTab('ux')}
              style={{
                fontSize: `${fontSize * 1.1}px`,
                color: activeTab === 'ux' ? bgColor : textColor,
                backgroundColor: activeTab === 'ux' ? textColor : 'transparent',
                borderColor: textColor
              }}
            >
              UX Design
            </button>
            <button 
              className={`tabButton ${activeTab === 'accessibility' ? 'active' : ''}`}
              onClick={() => setActiveTab('accessibility')}
              style={{
                fontSize: `${fontSize * 1.1}px`,
                color: activeTab === 'accessibility' ? bgColor : textColor,
                backgroundColor: activeTab === 'accessibility' ? textColor : 'transparent',
                borderColor: textColor
              }}
            >
              Accessibility
            </button>
          </div>

          <p style={{ opacity: 0.8, marginTop: '1rem' }}>
            Click a card to reveal the principle behind it.
          </p>
        </div>

        <div className="cardsGrid" style={{
          gridTemplateColumns: `repeat(auto-fill, minmax(${minCardWidth}px, 1fr))`
        }}>
          {filteredPrinciples.map((card) => (
            <div 
              key={card.id} 
              className={`flip-card ${flippedCardId === card.id ? 'flipped' : ''}`}
              onClick={() => handleCardClick(card.id)}
              onKeyDown={(e) => {
                // Handle keyboard activation (Enter or Space)
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault(); // Prevent page scroll on Space
                  handleCardClick(card.id);
                }
              }}
              tabIndex={0}  // Make element focusable
              role="button" // Semantic role for screen readers
              style={{ height: cardHeight, cursor: 'pointer' }}
            >
              <div className="flip-card-inner">
                {/* Front of Card */}
                <div className="flip-card-front" style={{ 
                  backgroundColor: cardBg,
                  borderColor: cardBorder,
                  color: textColor
                }}>
                  <span className="card-category" style={{ fontSize: `${fontSize * 0.8}px` }}>
                    {card.category}
                  </span>
                  
                  <h3 style={{ fontSize: `${fontSize * 1.4}px`, margin: '0 0 1rem 0' }}>
                    {card.title}
                  </h3>
                  <p style={{ fontSize: `${fontSize}px`, opacity: 0.9 }}>
                    {card.summary}
                  </p>
                  <span className="tap-hint" style={{ 
                    fontSize: `${fontSize * 0.8}px`, 
                    borderBottom: `1px solid ${textColor}66`
                  }}>
                    Click to learn more
                  </span>
                </div>

                {/* Back of Card */}
                <div className="flip-card-back" style={{ 
                  backgroundColor: textColor,
                  color: bgColor,
                  borderColor: cardBorder
                }}>
                  <h3 style={{ 
                    fontSize: `${fontSize * 1.2}px`, 
                    borderBottom: `1px solid ${bgColor}44`,
                    paddingBottom: '0.5rem',
                    marginBottom: '1rem',
                    width: '100%'
                  }}>
                    {card.title}
                  </h3>
                  <p style={{ fontSize: `${fontSize}px`, marginBottom: '1.5rem', lineHeight: lineHeight * 1.1 }}>
                    {card.details}
                  </p>
                  
                  <div className="action-box" style={{ 
                    backgroundColor: `${bgColor}22`
                  }}>
                    <strong style={{ display: 'block', fontSize: `${fontSize * 0.9}px`, marginBottom: '0.25rem' }}>
                      Takeaway:
                    </strong>
                    <span style={{ fontSize: `${fontSize * 0.95}px`, fontStyle: 'italic' }}>
                      {card.action}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default LearningResources;