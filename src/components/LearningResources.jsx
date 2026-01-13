import { useState } from 'react';

const LearningResource = () => {
  const [activeTab, setActiveTab] = useState('nielsen');
  const [expandedCard, setExpandedCard] = useState(null);

  const tabs = [
    { id: 'nielsen', label: 'Nielsen Heuristics', icon: '✓' },
    { id: 'cognitive', label: 'Cognitive Load', icon: '🧠' },
    { id: 'gestalt', label: 'Gestalt Principles', icon: '👁️' },
    { id: 'typography', label: 'Typography', icon: '📝' },
    { id: 'accessibility', label: 'Accessibility', icon: '♿' }
  ];

  const principles = {
    nielsen: [
      {
        number: 1,
        title: "Visibility of System Status",
        description: "Keep users informed about what's happening through appropriate feedback within reasonable time.",
        example: "Loading indicators, progress bars, and confirmation messages let users know the system is working.",
        typography: "Use clear, readable fonts for status messages. Ensure sufficient contrast for visibility."
      },
      {
        number: 2,
        title: "Match Between System and Real World",
        description: "Use familiar language, concepts, and conventions that users understand from their everyday experience.",
        example: "Shopping cart icons, folder metaphors, and trash bins mirror real-world objects.",
        typography: "Use language that matches your users' vocabulary. Avoid jargon and technical terms."
      },
      {
        number: 3,
        title: "User Control and Freedom",
        description: "Provide clear ways to undo actions and exit unwanted states without lengthy processes.",
        example: "Undo/redo buttons, back buttons, and cancel options give users confidence to explore.",
        typography: "Make exit and undo options clearly visible with appropriate font weight and size."
      },
      {
        number: 4,
        title: "Consistency and Standards",
        description: "Follow platform and industry conventions so users don't have to wonder if different words or actions mean the same thing.",
        example: "Use standard button placements, consistent terminology, and familiar navigation patterns.",
        typography: "Maintain consistent type scale, font choices, and hierarchy throughout your interface."
      },
      {
        number: 5,
        title: "Error Prevention",
        description: "Design to prevent problems from occurring in the first place through careful design and helpful constraints.",
        example: "Disable submit buttons until forms are valid, use confirmation dialogs for destructive actions.",
        typography: "Use color and typography to distinguish between safe and destructive actions clearly."
      },
      {
        number: 6,
        title: "Recognition Rather Than Recall",
        description: "Minimize memory load by making objects, actions, and options visible and easily retrievable.",
        example: "Show recently used items, provide autocomplete suggestions, and use visible menu options.",
        typography: "Use descriptive labels and clear hierarchies. Don't rely on users remembering hidden information."
      },
      {
        number: 7,
        title: "Flexibility and Efficiency of Use",
        description: "Provide shortcuts and customization options for experienced users while keeping the interface accessible to novices.",
        example: "Keyboard shortcuts, customizable dashboards, and quick access menus speed up frequent tasks.",
        typography: "Consider providing adjustable text size options for different user needs."
      },
      {
        number: 8,
        title: "Aesthetic and Minimalist Design",
        description: "Keep interfaces clean and focused. Every extra piece of information competes with relevant information.",
        example: "Remove unnecessary elements, use white space effectively, and prioritize essential content.",
        typography: "Choose legible fonts, appropriate sizes, and sufficient spacing. Less is often more."
      },
      {
        number: 9,
        title: "Help Users Recognize, Diagnose, and Recover from Errors",
        description: "Express error messages in plain language, precisely indicate the problem, and constructively suggest a solution.",
        example: "Instead of 'Error 404', say 'We can't find that page. Try our homepage or search.'",
        typography: "Make error messages clearly visible with appropriate emphasis but not aggressive styling."
      },
      {
        number: 10,
        title: "Help and Documentation",
        description: "Provide easily searchable, focused help documentation when needed, with concrete steps to follow.",
        example: "Contextual help, tooltips, FAQ sections, and searchable documentation.",
        typography: "Organize help text with clear headings, bullet points, and scannable formatting."
      }
    ],
    cognitive: [
      {
        title: "Intrinsic Cognitive Load",
        description: "The inherent difficulty of the content itself. Some concepts are naturally more complex than others.",
        principle: "Break complex information into smaller, manageable chunks. Use progressive disclosure to reveal complexity gradually.",
        typography: "Use clear hierarchies, appropriate font sizes, and sufficient line spacing to make complex content more digestible."
      },
      {
        title: "Extraneous Cognitive Load",
        description: "Unnecessary mental effort caused by poor design, distractions, or unclear presentation.",
        principle: "Eliminate visual clutter, redundant information, and confusing navigation. Focus on essential content.",
        typography: "Avoid decorative fonts for body text, excessive color variations, or tight spacing that makes reading difficult."
      },
      {
        title: "Germane Cognitive Load",
        description: "The mental effort used to process information and build understanding - the 'good' kind of cognitive load.",
        principle: "Design to support learning and comprehension through clear structure, examples, and appropriate scaffolding.",
        typography: "Use typography to guide attention: bold for emphasis, size for hierarchy, and space for grouping."
      },
      {
        title: "Working Memory Limitations",
        description: "Humans can typically hold 4-7 items in working memory at once (Miller's Law).",
        principle: "Chunk related information together. Limit navigation items to 5-9 choices. Use visual grouping.",
        typography: "Group related content visually. Use consistent spacing to show relationships between elements."
      },
      {
        title: "Cognitive Overload",
        description: "When too much information is presented at once, learning and performance decrease dramatically.",
        principle: "Prioritize content ruthlessly. Show only what's needed when it's needed. Use progressive disclosure.",
        typography: "Create breathing room with white space. Don't try to fit too much text in a small area."
      },
      {
        title: "Attention and Focus",
        description: "Humans can only focus on a limited amount of information at any given time.",
        principle: "Design clear focal points. Use visual hierarchy to guide attention to important information first.",
        typography: "Use size, weight, and color to create clear visual hierarchy. Make headings obviously different from body text."
      }
    ],
    gestalt: [
      {
        title: "Law of Proximity",
        description: "Objects that are close together are perceived as related or belonging to the same group.",
        application: "Group related UI elements together. Use spacing to separate different sections.",
        typography: "Reduce spacing between related lines (like a heading and its paragraph). Increase spacing between sections."
      },
      {
        title: "Law of Similarity",
        description: "Similar objects are perceived as belonging to the same group, even if they're not close together.",
        application: "Use consistent styling for similar elements (all buttons look alike, all links look alike).",
        typography: "Use the same font style and size for elements at the same hierarchical level."
      },
      {
        title: "Law of Continuity",
        description: "The eye naturally follows lines, curves, and patterns, perceiving them as continuous.",
        application: "Align elements to create visual flow. Use grids to organize content predictably.",
        typography: "Maintain consistent alignment and baseline grids for a smooth reading experience."
      },
      {
        title: "Law of Closure",
        description: "Minds tend to complete incomplete shapes and patterns automatically.",
        application: "You don't need to enclose every element completely. Subtle borders or spacing can define areas.",
        typography: "Strategic use of rules and spacing can define sections without heavy boxes around everything."
      },
      {
        title: "Figure-Ground",
        description: "We naturally separate objects (figure) from their background (ground).",
        application: "Ensure sufficient contrast between content and background. Use layering effectively.",
        typography: "Maintain high contrast between text and background (minimum 4.5:1 for body text)."
      },
      {
        title: "Law of Common Region",
        description: "Elements within a clearly defined boundary are perceived as a group.",
        application: "Use cards, panels, or subtle backgrounds to group related content.",
        typography: "Container elements help organize complex typography-heavy content into scannable sections."
      }
    ],
    typography: [
      {
        title: "Hierarchy and Scale",
        description: "Establish clear visual relationships between different levels of content through size and weight.",
        guideline: "Use a modular scale (1.2, 1.25, 1.33, 1.5, 1.618). Larger jumps = more contrast = clearer hierarchy.",
        ratio: "Recommended: H1 (3-4x body), H2 (2-3x body), H3 (1.5-2x body), Body (16-18px base)"
      },
      {
        title: "Line Length (Measure)",
        description: "The optimal line length for reading is 45-75 characters per line, with 66 being ideal.",
        guideline: "Too short = excessive eye movement. Too long = difficulty finding next line. Use max-width.",
        implementation: "Set max-width: 65-75ch for text containers (ch = width of '0' character)"
      },
      {
        title: "Line Height (Leading)",
        description: "The vertical space between lines of text affects readability significantly.",
        guideline: "Body text: 1.5-1.8. Headings: 1.2-1.4. Tighter leading for larger text, looser for smaller text.",
        accessibility: "Minimum 1.5 for body text (WCAG requirement)"
      },
      {
        title: "Font Pairing",
        description: "Combining fonts creates visual interest while maintaining readability and cohesion.",
        guideline: "Pair contrasting styles (serif + sans-serif). Ensure they share similar x-heights. Limit to 2-3 fonts max.",
        examples: "Classic: Georgia + Helvetica, Modern: Inter + Playfair Display, Friendly: Open Sans + Merriweather"
      },
      {
        title: "White Space (Negative Space)",
        description: "Empty space is not wasted space - it improves comprehension and reduces cognitive load.",
        guideline: "Generous margins, padding between sections, space around headings. Let content breathe.",
        ratio: "Aim for 1:1.5 ratio of text to white space for optimal readability"
      },
      {
        title: "Contrast and Readability",
        description: "Sufficient contrast between text and background is essential for accessibility and comfort.",
        guideline: "WCAG AA: 4.5:1 for body text, 3:1 for large text (18pt+ or 14pt+ bold). AAA: 7:1 and 4.5:1.",
        testing: "Use tools like WebAIM Contrast Checker to verify ratios"
      },
      {
        title: "Responsive Typography",
        description: "Text should adapt to different screen sizes while maintaining readability and hierarchy.",
        guideline: "Use relative units (rem, em). Scale down font sizes for mobile, but never below 16px for body text.",
        implementation: "Consider fluid typography using clamp() or viewport units"
      }
    ],
    accessibility: [
      {
        title: "Color is Not Enough",
        description: "Never use color alone to convey information - some users can't perceive color differences.",
        implementation: "Combine color with text labels, icons, or patterns. Use high contrast ratios.",
        typography: "Underline links, use bold or size changes to indicate importance, not just color."
      },
      {
        title: "Text Alternatives",
        description: "All non-text content needs text alternatives for screen readers and other assistive technologies.",
        implementation: "Use descriptive alt text for images. Provide transcripts for audio/video.",
        typography: "Ensure all text is actual text (not images of text) that can be read by screen readers."
      },
      {
        title: "Keyboard Navigation",
        description: "All functionality must be accessible via keyboard for users who can't use a mouse.",
        implementation: "Ensure logical tab order. Make focus states clearly visible. Provide skip links.",
        typography: "Focus indicators should be clearly visible (at least 3:1 contrast against background)."
      },
      {
        title: "Sufficient Size and Spacing",
        description: "Interactive elements need sufficient size and space for users with motor impairments.",
        implementation: "Minimum 44x44px touch targets. Adequate spacing between interactive elements.",
        typography: "Ensure clickable text has sufficient padding and doesn't require precise targeting."
      },
      {
        title: "Zoom and Resize",
        description: "Text must remain readable and functional when zoomed up to 200%.",
        implementation: "Use relative units (rem, em). Test at different zoom levels. Avoid fixed-width containers.",
        typography: "Font size should respect user preferences. Don't disable zoom on mobile."
      },
      {
        title: "Clear Language and Structure",
        description: "Content should be clear, concise, and properly structured for all users, including those with cognitive disabilities.",
        implementation: "Use headings properly (h1-h6). Write in plain language. Organize content logically.",
        typography: "Clear hierarchy with properly nested headings makes content navigable by screen readers."
      }
    ]
  };

  const toggleCard = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '60px 20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '50px',
          color: 'white'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '800',
            marginBottom: '15px',
            textShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}>
            UX & Design Principles
          </h1>
          <p style={{
            fontSize: '1.25rem',
            opacity: 0.9,
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            Master the fundamental principles that create exceptional user experiences
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '40px'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setExpandedCard(null);
              }}
              style={{
                padding: '12px 24px',
                fontSize: '1rem',
                fontWeight: '600',
                border: 'none',
                borderRadius: '12px',
                background: activeTab === tab.id ? 'white' : 'rgba(255,255,255,0.2)',
                color: activeTab === tab.id ? '#667eea' : 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                boxShadow: activeTab === tab.id ? '0 4px 15px rgba(0,0,0,0.2)' : 'none',
                transform: activeTab === tab.id ? 'translateY(-2px)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.target.style.background = 'rgba(255,255,255,0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.target.style.background = 'rgba(255,255,255,0.2)';
                }
              }}
            >
              <span style={{ marginRight: '8px' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '25px'
        }}>
          {principles[activeTab].map((item, index) => (
            <div
              key={index}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '30px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: expandedCard === index ? 'scale(1.02)' : 'scale(1)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={() => toggleCard(index)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = expandedCard === index ? 'scale(1.02)' : 'scale(1)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
              }}
            >
              {/* Number badge for Nielsen's heuristics */}
              {item.number && (
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  fontWeight: '700'
                }}>
                  {item.number}
                </div>
              )}

              {/* Title */}
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#1a202c',
                marginBottom: '15px',
                paddingRight: item.number ? '50px' : '0'
              }}>
                {item.title}
              </h3>

              {/* Description */}
              <p style={{
                fontSize: '1rem',
                color: '#4a5568',
                lineHeight: '1.6',
                marginBottom: expandedCard === index ? '20px' : '0'
              }}>
                {item.description || item.principle}
              </p>

              {/* Expanded content */}
              {expandedCard === index && (
                <div style={{
                  marginTop: '20px',
                  paddingTop: '20px',
                  borderTop: '2px solid #e2e8f0'
                }}>
                  {item.example && (
                    <div style={{ marginBottom: '15px' }}>
                      <strong style={{ color: '#667eea', display: 'block', marginBottom: '8px' }}>
                        💡 Example:
                      </strong>
                      <p style={{ fontSize: '0.95rem', color: '#4a5568', lineHeight: '1.6' }}>
                        {item.example}
                      </p>
                    </div>
                  )}
                  
                  {item.typography && (
                    <div style={{ marginBottom: '15px' }}>
                      <strong style={{ color: '#667eea', display: 'block', marginBottom: '8px' }}>
                        📝 Typography Tip:
                      </strong>
                      <p style={{ fontSize: '0.95rem', color: '#4a5568', lineHeight: '1.6' }}>
                        {item.typography}
                      </p>
                    </div>
                  )}

                  {item.guideline && (
                    <div style={{ marginBottom: '15px' }}>
                      <strong style={{ color: '#667eea', display: 'block', marginBottom: '8px' }}>
                        📋 Guideline:
                      </strong>
                      <p style={{ fontSize: '0.95rem', color: '#4a5568', lineHeight: '1.6' }}>
                        {item.guideline}
                      </p>
                    </div>
                  )}

                  {item.application && (
                    <div style={{ marginBottom: '15px' }}>
                      <strong style={{ color: '#667eea', display: 'block', marginBottom: '8px' }}>
                        🎯 Application:
                      </strong>
                      <p style={{ fontSize: '0.95rem', color: '#4a5568', lineHeight: '1.6' }}>
                        {item.application}
                      </p>
                    </div>
                  )}

                  {item.implementation && (
                    <div style={{ marginBottom: '15px' }}>
                      <strong style={{ color: '#667eea', display: 'block', marginBottom: '8px' }}>
                        ⚡ Implementation:
                      </strong>
                      <p style={{ fontSize: '0.95rem', color: '#4a5568', lineHeight: '1.6' }}>
                        {item.implementation}
                      </p>
                    </div>
                  )}

                  {item.ratio && (
                    <div style={{
                      background: '#f7fafc',
                      padding: '15px',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      color: '#2d3748',
                      fontFamily: 'monospace'
                    }}>
                      {item.ratio}
                    </div>
                  )}

                  {item.examples && (
                    <div style={{
                      background: '#f7fafc',
                      padding: '15px',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      color: '#2d3748'
                    }}>
                      {item.examples}
                    </div>
                  )}

                  {item.testing && (
                    <div style={{
                      background: '#fff5f5',
                      padding: '15px',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      color: '#c53030',
                      border: '1px solid #feb2b2'
                    }}>
                      <strong>Testing: </strong>{item.testing}
                    </div>
                  )}

                  {item.accessibility && (
                    <div style={{
                      background: '#f0fff4',
                      padding: '15px',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      color: '#22543d',
                      border: '1px solid #9ae6b4'
                    }}>
                      <strong>♿ Accessibility: </strong>{item.accessibility}
                    </div>
                  )}
                </div>
              )}

              {/* Expand indicator */}
              <div style={{
                marginTop: '15px',
                textAlign: 'center',
                color: '#a0aec0',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                {expandedCard === index ? '▲ Click to collapse' : '▼ Click to learn more'}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '60px',
          textAlign: 'center',
          color: 'white',
          opacity: 0.8
        }}>
          <p style={{ fontSize: '0.95rem' }}>
            💡 Click any card to expand and see detailed examples and guidelines
          </p>
        </div>
      </div>
    </div>
  );
};

export default LearningResource;