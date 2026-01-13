import React, { useState } from 'react';
import './LearningResources.css';

function LearningResources({ fontFamily, fontSize, lineHeight, textColor, bgColor, onClose, onViewSummary }) {
  const [activeSection, setActiveSection] = useState('typography');

  const getBoxBackground = (bg) => {
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

  const boxBg = getBoxBackground(bgColor);

  const sections = {
    typography: {
      title: 'Typography Fundamentals',
      content: [
        {
          heading: 'Font Pairing',
          text: 'When combining fonts, use contrasting styles (serif + sans-serif) or stick to one font family with different weights. Limit yourself to 2-3 typefaces maximum to maintain visual harmony.',
          example: 'Headings in bold sans-serif with body text in a readable serif creates clear hierarchy.'
        },
        {
          heading: 'Hierarchy and Scale',
          text: 'Establish a clear typographic scale with distinct sizes for headings (H1-H6) and body text. Use a ratio like 1.25 (Major Third) or 1.5 (Perfect Fifth) to create harmonious size relationships.',
          example: 'H1: 32px, H2: 24px, H3: 20px, Body: 16px creates a clear visual hierarchy.'
        },
        {
          heading: 'Line Length (Measure)',
          text: 'Optimal line length is 50-75 characters per line (including spaces). Lines that are too long tire the eyes, while too-short lines disrupt reading rhythm.',
          example: 'For 16px text, this translates to roughly 600-900px width for comfortable reading.'
        },
        {
          heading: 'White Space',
          text: 'Generous white space around text improves readability and creates visual breathing room. Use margins, padding, and line height to prevent cramped layouts.',
          example: 'Add 1.5-2em margins between paragraphs and ensure comfortable padding around text blocks.'
        }
      ]
    },
    accessibility: {
      title: 'Accessibility Best Practices',
      content: [
        {
          heading: 'Color Contrast (WCAG)',
          text: 'Text must have sufficient contrast with backgrounds. WCAG AA requires 4.5:1 for normal text, 3:1 for large text (18pt+). AAA standard requires 7:1 for normal text.',
          example: 'Black text on white has 21:1 contrast ratio - excellent. Gray on white is 4.47:1 - just passes AA.'
        },
        {
          heading: 'Font Size Minimums',
          text: 'Body text should be at least 16px for comfortable reading. Mobile text should never go below 16px to prevent browser zoom. Larger text (18-20px) improves accessibility for users with vision impairments.',
          example: 'Use 16-18px for body text, 14px minimum for secondary text like captions.'
        },
        {
          heading: 'Text Alternatives',
          text: 'Never rely on color alone to convey information. Use icons, labels, or patterns in addition to color. This helps colorblind users and improves overall usability.',
          example: 'For errors, use a red color plus warning icon plus Error label to convey meaning.'
        },
        {
          heading: 'Focus Indicators',
          text: 'Ensure keyboard navigation has visible focus states. Users who navigate with keyboards need clear indicators of where they are on the page.',
          example: 'Add a 2-3px outline or color change when elements receive focus via keyboard.'
        },
        {
          heading: 'Responsive Text',
          text: 'Text should scale appropriately on different screen sizes. Use relative units (rem, em) instead of fixed pixels, and test on mobile devices.',
          example: 'Set base font size in rem (1rem = 16px) so text scales with user preferences.'
        }
      ]
    },
    ux: {
      title: 'UX Design Principles',
      content: [
        {
          heading: 'Consistency',
          text: 'Maintain consistent typography throughout your interface. Same font sizes, colors, and spacing for similar elements creates predictability and reduces cognitive load.',
          example: 'All buttons use the same font size, all headings follow the same scale, all body text uses identical styling.'
        },
        {
          heading: 'Visual Hierarchy',
          text: 'Guide users through content with clear visual priority. Use size, weight, color, and spacing to show what is most important.',
          example: 'Page title is largest, then Section headings are medium, then Body text is base size, then Captions are smallest.'
        },
        {
          heading: 'Readability vs Legibility',
          text: 'Legibility is how easily individual characters are distinguished. Readability is how easy it is to read text blocks. Both matter, but prioritize readability for body text.',
          example: 'A decorative font may be legible but poor for long reading. Choose appropriate fonts for their context.'
        },
        {
          heading: 'Responsive Design',
          text: 'Design for mobile-first, then scale up. Text should be readable without zooming on any device. Consider how line length changes on different screen widths.',
          example: 'Use fluid typography with clamp() or media queries to adjust sizes smoothly across devices.'
        },
        {
          heading: 'Performance',
          text: 'Font loading affects page performance. Use system fonts when possible, or limit custom fonts to 2-3 weights. Consider using font-display: swap for better perceived performance.',
          example: 'Loading 10 font weights can add 1-2 seconds to page load. Stick to regular and bold for most interfaces.'
        }
      ]
    },
    tools: {
      title: 'Helpful Tools & Resources',
      content: [
        {
          heading: 'Contrast Checkers',
          text: 'Tools to verify your color combinations meet accessibility standards.',
          example: 'WebAIM Contrast Checker, Contrast Ratio by Lea Verou, Colorable'
        },
        {
          heading: 'Typography Tools',
          text: 'Resources for finding fonts, testing combinations, and generating type scales.',
          example: 'Type Scale, Google Fonts, Fontsquirrel, Typewolf'
        },
        {
          heading: 'Testing Tools',
          text: 'Simulate different vision conditions and test accessibility.',
          example: 'Chrome DevTools with Lighthouse, WAVE, axe DevTools, Color Oracle for colorblindness simulation'
        },
        {
          heading: 'Learning Resources',
          text: 'Books and websites to deepen your understanding.',
          example: 'The Elements of Typographic Style by Robert Bringhurst, Practical Typography by Matthew Butterick, Laws of UX website'
        },
        {
          heading: 'Guidelines & Standards',
          text: 'Official accessibility and design standards.',
          example: 'WCAG 2.1 Guidelines, Material Design Typography, Apple Human Interface Guidelines'
        }
      ]
    }
  };

  return (
    <div className="learningContainer" style={{ 
      fontFamily,
      fontSize: `${fontSize}px`,
      lineHeight,
      color: textColor,
      backgroundColor: bgColor
    }}>
      <div className="learningHeader" style={{
        borderBottom: `2px solid ${textColor}33`,
        backgroundColor: boxBg
      }}>
        <h1 style={{ fontSize: `${fontSize * 2}px`, color: textColor }}>
          Learning Resources
        </h1>
        <p style={{ fontSize: `${fontSize * 1.1}px`, color: textColor + 'CC' }}>
          Explore typography, accessibility, and UX design principles
        </p>
      </div>

      <div className="learningContent">
        <nav className="learningNav" style={{
          backgroundColor: boxBg,
          borderRight: `2px solid ${textColor}33`
        }}>
          {Object.entries(sections).map(([key, section]) => (
            <button
              key={key}
              className={`navItem ${activeSection === key ? 'active' : ''}`}
              onClick={() => setActiveSection(key)}
              style={{
                color: activeSection === key ? bgColor : textColor,
                backgroundColor: activeSection === key ? textColor : 'transparent',
                borderBottom: `1px solid ${textColor}22`,
                fontSize: `${fontSize}px`,
                lineHeight
              }}
            >
              {section.title}
            </button>
          ))}
        </nav>

        <div className="learningMain" style={{ fontSize: `${fontSize}px` }}>
          <h2 style={{ 
            fontSize: `${fontSize * 1.8}px`, 
            color: textColor,
            marginBottom: '2rem'
          }}>
            {sections[activeSection].title}
          </h2>

          {sections[activeSection].content.map((item, index) => (
            <div 
              key={index} 
              className="contentCard"
              style={{
                backgroundColor: boxBg,
                borderLeft: `4px solid ${textColor}`,
                marginBottom: '2rem',
                padding: '1.5rem',
                borderRadius: '4px'
              }}
            >
              <h3 style={{ 
                fontSize: `${fontSize * 1.3}px`,
                color: textColor,
                marginBottom: '0.75rem'
              }}>
                {item.heading}
              </h3>
              <p style={{ 
                fontSize: `${fontSize}px`,
                color: textColor + 'DD',
                marginBottom: '1rem',
                lineHeight
              }}>
                {item.text}
              </p>
              <div 
                className="exampleBox"
                style={{
                  backgroundColor: adjustBrightness(boxBg, bgColor === '#ffffff' ? -5 : 10),
                  padding: '1rem',
                  borderRadius: '4px',
                  borderLeft: `3px solid ${textColor}55`
                }}
              >
                <strong style={{ color: textColor + 'AA', fontSize: `${fontSize * 0.9}px` }}>
                  Example:
                </strong>
                <p style={{ 
                  fontSize: `${fontSize * 0.95}px`,
                  color: textColor + 'CC',
                  marginTop: '0.5rem',
                  fontStyle: 'italic'
                }}>
                  {item.example}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="learningFooter" style={{
        backgroundColor: boxBg,
        borderTop: `2px solid ${textColor}33`,
        padding: '1.5rem',
        textAlign: 'center',
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center'
      }}>
        {onViewSummary && (
          <button
            onClick={onViewSummary}
            className="closeButton"
            style={{
              backgroundColor: 'transparent',
              color: textColor,
              border: `2px solid ${textColor}`,
              padding: '1rem 2rem',
              borderRadius: '5px',
              fontSize: `${fontSize * 1.1}px`,
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            View My Summary
          </button>
        )}
        <button
          onClick={onClose}
          className="closeButton"
          style={{
            backgroundColor: textColor,
            color: bgColor,
            padding: '1rem 2rem',
            border: 'none',
            borderRadius: '5px',
            fontSize: `${fontSize * 1.1}px`,
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Start Over
        </button>
      </div>
    </div>
  );
}

export default LearningResources;