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
      
      if (brightness > 128) {
        return adjustBrightness(bg, -3);
      } else {
        return adjustBrightness(bg, 8);
      }
  };

  const cardBg = getContrastColor(bgColor);
  const cardBorder = `${textColor}22`;
  
  const cardHeight = `${Math.max(320, fontSize * 20)}px`;
  const minCardWidth = Math.max(600, 600 + (fontSize - 16) * 15);

  const principles = [
    // --- UX DESIGN ---
    {
      id: 1,
      tab: 'ux',
      category: "Heuristics",
      title: "Visibility of System Status",
      summary: "Keep users informed about what is going on.",
      details: "Nielsen's 1st Heuristic: The design should always keep users informed about what is going on, through appropriate feedback within a reasonable amount of time. Examples include loading spinners, progress bars, and success notifications.",
      action: "Ensure every user action has a clear reaction."
    },
    {
      id: 2,
      tab: 'ux',
      category: "Cognitive Psychology",
      title: "Cognitive Load",
      summary: "Don't make the user think too hard.",
      details: "Cognitive load refers to the amount of working memory resources used. 'Extraneous' load comes from bad design (distractions, clutter). 'Germane' load is the effort needed to learn. Good UX minimizes extraneous load so users can focus on their actual task.",
      action: "Simplify interfaces and remove non-essential elements."
    },
    {
      id: 3,
      tab: 'ux',
      category: "Heuristics",
      title: "Error Prevention",
      summary: "Better a good design than a good error message.",
      details: "Nielsen's 5th Heuristic: Good design prevents problems from occurring in the first place. Eliminate error-prone conditions or check for them and present users with a confirmation option before they commit to the action.",
      action: "Use constraints (like date pickers) instead of free text."
    },
    {
      id: 4,
      tab: 'ux',
      category: "Gestalt Principles",
      title: "Law of Proximity",
      summary: "Things close together appear grouped.",
      details: "Objects that are near, or proximate to each other, tend to be grouped together. This is a fundamental way we organize information. We perceive elements that are closer together as related, while those further apart are unrelated.",
      action: "Use whitespace to group related controls."
    },
    {
      id: 5,
      tab: 'ux',
      category: "Typography",
      title: "Line Length (Measure)",
      summary: "Avoid lines that are too long to track.",
      details: "For comfortable reading, a line of text should be 50–75 characters long. If lines are too long, the eye has trouble tracking back to the start of the next line. If too short, the rhythm breaks.",
      action: "Limit container width on large screens."
    },
    {
      id: 6,
      tab: 'ux',
      category: "Psychology",
      title: "Fitts's Law",
      summary: "Big and close targets are easier to hit.",
      details: "The time to acquire a target is a function of the distance to and size of the target. Make touch targets (buttons, links) large enough (at least 44x44px) and place commonly used actions in easy-to-reach zones.",
      action: "Increase padding on clickable elements."
    },

    // --- ACCESSIBILITY: PERCEIVABLE ---
    {
      id: 100,
      tab: 'accessibility',
      category: "Perceivable",
      title: "What is Perceivable?",
      summary: "Can everyone sense your content?",
      details: "Content must be presented in ways that all users can perceive through at least one of their senses. If someone can't see, hear, or otherwise detect your content, it doesn't exist to them. This principle ensures information isn't invisible to any user.",
      action: "Provide multiple sensory channels for all critical information."
    },
    {
      id: 101,
      tab: 'accessibility',
      category: "Perceivable",
      title: "Text Alternatives",
      summary: "Describe the visual world in words.",
      details: "Every non-text element needs a text equivalent. Images require alt text, videos need captions and transcripts, and icons need accessible names. Screen readers can't interpret pixels—they need words. Decorative images get empty alt attributes; informative content needs full descriptions.",
      action: "Add meaningful alt text to every functional image."
    },
    {
      id: 102,
      tab: 'accessibility',
      category: "Perceivable",
      title: "Time-Based Media",
      summary: "Captions, transcripts, and audio descriptions.",
      details: "Videos need synchronized captions for deaf users and audio descriptions for blind users. Pre-recorded audio needs transcripts. Live content requires real-time captions. Don't let multimedia become a barrier—provide multiple ways to access the same information.",
      action: "Add captions to all video content as a baseline."
    },
    {
      id: 103,
      tab: 'accessibility',
      category: "Perceivable",
      title: "Adaptable Content",
      summary: "Structure that transforms gracefully.",
      details: "Content should be presentable in different ways without losing meaning. Use semantic HTML so assistive technologies understand your structure. Headings, lists, tables, and landmarks must be properly coded—not just visually styled. When CSS is disabled, your content should still make sense.",
      action: "Use semantic HTML elements instead of styled divs."
    },
    {
      id: 104,
      tab: 'accessibility',
      category: "Perceivable",
      title: "Distinguishable Content",
      summary: "Foreground must stand out from background.",
      details: "Users must be able to separate foreground from background. This means sufficient color contrast (4.5:1 for normal text, 3:1 for large text), text that can be resized up to 200%, and audio that can be controlled independently. Never use color alone to convey information.",
      action: "Test all text with a contrast checker tool."
    },

    // --- ACCESSIBILITY: OPERABLE ---
    {
      id: 200,
      tab: 'accessibility',
      category: "Operable",
      title: "What is Operable?",
      summary: "Can everyone use your interface?",
      details: "Every interactive element must be usable by everyone, regardless of how they interact with technology. Some users navigate with keyboards, voice commands, eye trackers, or switches. If your interface only works with a mouse, you've excluded millions of people.",
      action: "Test your entire interface using only a keyboard."
    },
    {
      id: 201,
      tab: 'accessibility',
      category: "Operable",
      title: "Keyboard Accessibility",
      summary: "The keyboard is the universal input.",
      details: "All functionality must be available via keyboard. Users should navigate with Tab, activate with Enter/Space, and never get trapped in a component. Visible focus indicators show where you are. If you can't reach it or activate it with a keyboard, it's not accessible.",
      action: "Never remove focus outlines without adding a custom style."
    },
    {
      id: 202,
      tab: 'accessibility',
      category: "Operable",
      title: "Enough Time",
      summary: "Give users control over time limits.",
      details: "Not everyone reads, types, or processes information at the same speed. Allow users to turn off, adjust, or extend time limits. Auto-updating content should be pausable. Session timeouts should warn users and offer extensions. Rushing creates barriers.",
      action: "Add pause, stop, and extend controls to timed content."
    },
    {
      id: 203,
      tab: 'accessibility',
      category: "Operable",
      title: "Seizures & Physical Reactions",
      summary: "Protect users from harmful motion.",
      details: "Flashing content can trigger seizures—nothing should flash more than 3 times per second. Animations can cause vestibular disorders and nausea. Provide controls to pause, stop, or hide motion. Respect the 'prefers-reduced-motion' setting in user's operating systems.",
      action: "Implement prefers-reduced-motion media queries."
    },
    {
      id: 204,
      tab: 'accessibility',
      category: "Operable",
      title: "Navigable",
      summary: "Help users find their way around.",
      details: "Users need to know where they are and how to get where they're going. Provide skip links, descriptive page titles, logical focus order, and multiple ways to find pages. Link text should describe the destination—'click here' tells users nothing.",
      action: "Add a 'skip to main content' link at the top of pages."
    },
    {
      id: 205,
      tab: 'accessibility',
      category: "Operable",
      title: "Input Modalities",
      summary: "Support diverse input methods.",
      details: "Support all input methods: touch, mouse, keyboard, voice, and pointers. Complex gestures should have single-pointer alternatives. Ensure adequate target sizes (44×44 pixels minimum recommended). Don't require specific motions that some users physically cannot perform.",
      action: "Ensure all touch targets are at least 44×44 pixels."
    },

    // --- ACCESSIBILITY: UNDERSTANDABLE ---
    {
      id: 300,
      tab: 'accessibility',
      category: "Understandable",
      title: "What is Understandable?",
      summary: "Does your content make sense to everyone?",
      details: "Users must be able to comprehend both your content and how your interface works. Confusing language, unpredictable behavior, or unclear error messages create barriers just as real as missing alt text. Clarity is accessibility.",
      action: "Write content at the simplest level the subject allows."
    },
    {
      id: 301,
      tab: 'accessibility',
      category: "Understandable",
      title: "Readable Content",
      summary: "Use clear language everyone can follow.",
      details: "Identify the language of the page and any language changes within content. Write clearly and define unusual terms, abbreviations, and jargon. Consider reading level—readable content benefits everyone, not just those with cognitive disabilities.",
      action: "Set the lang attribute on your HTML element."
    },
    {
      id: 302,
      tab: 'accessibility',
      category: "Understandable",
      title: "Predictable Behavior",
      summary: "No surprises—consistency builds confidence.",
      details: "Interfaces should behave consistently. Components that look the same should work the same. Focus shouldn't trigger unexpected changes. Forms shouldn't submit automatically. Navigation should remain consistent across pages. When users understand the pattern, they can use your site confidently.",
      action: "Keep navigation and component behavior consistent site-wide."
    },
    {
      id: 303,
      tab: 'accessibility',
      category: "Understandable",
      title: "Input Assistance",
      summary: "Help users avoid and correct mistakes.",
      details: "Clearly identify and describe errors in text—not just color. Provide labels and instructions before users need them. Offer suggestions for fixing errors. For important submissions, allow review, confirmation, or reversal. Everyone makes mistakes; good design helps recover from them.",
      action: "Show specific, helpful error messages next to form fields."
    },

    // --- ACCESSIBILITY: ROBUST ---
    {
      id: 400,
      tab: 'accessibility',
      category: "Robust",
      title: "What is Robust?",
      summary: "Built to last and work everywhere.",
      details: "Content must work reliably across different browsers, devices, and assistive technologies—now and in the future. Robust code follows standards, ensuring your accessibility efforts actually reach the users who need them.",
      action: "Validate your HTML and fix parsing errors."
    },
    {
      id: 401,
      tab: 'accessibility',
      category: "Robust",
      title: "Compatible Code",
      summary: "Valid, semantic, and standards-compliant.",
      details: "Use valid HTML with proper opening/closing tags and unique IDs. Avoid deprecated elements. Provide name, role, and value for all UI components—especially custom widgets. ARIA attributes must be used correctly: wrong ARIA is worse than no ARIA.",
      action: "Test custom components with real screen readers."
    },
    {
      id: 402,
      tab: 'accessibility',
      category: "Robust",
      title: "Status Messages",
      summary: "Keep everyone informed of changes.",
      details: "When content updates dynamically, all users need to know. Use ARIA live regions to announce status messages, errors, and progress updates to screen reader users. A visual notification means nothing if assistive technology users aren't informed.",
      action: "Use aria-live regions for dynamic content updates."
    },

    // --- ACCESSIBILITY: PUTTING IT TOGETHER ---
    {
      id: 500,
      tab: 'accessibility',
      category: "POUR Summary",
      title: "The Four Pillars Together",
      summary: "POUR principles reinforce each other.",
      details: "POUR principles overlap and reinforce each other. A video needs to be Perceivable (captions), Operable (keyboard controls), Understandable (clear language), and Robust (works across players). True accessibility means addressing all four pillars for every piece of content.",
      action: "Audit content against all four POUR categories."
    },
    {
      id: 501,
      tab: 'accessibility',
      category: "POUR Summary",
      title: "Testing Beyond Automation",
      summary: "Real users reveal real barriers.",
      details: "Automated tools catch about 30% of issues. To truly test POUR: navigate your entire site by keyboard, use a screen reader, disable CSS, zoom to 200%, check contrast ratios, test on mobile, and most importantly—involve people with disabilities in your testing.",
      action: "Include manual testing and real user feedback in QA."
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
            UX & Design Learning Resources
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
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardClick(card.id);
                }
              }}
              tabIndex={0}
              role="button"
              aria-pressed={flippedCardId === card.id}
              aria-label={`${card.title}. ${card.summary}. Click to ${flippedCardId === card.id ? 'hide' : 'show'} details.`}
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