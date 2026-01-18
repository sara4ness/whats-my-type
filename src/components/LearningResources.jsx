import React, { useState, useMemo } from 'react';
import './LearningResources.css';
import Navbar from './Navbar'; 

function LearningResources({ fontFamily, fontSize, lineHeight, textColor, bgColor, onClose, onViewSummary }) {
  const [flippedCardId, setFlippedCardId] = useState(null);
  const [activeTab, setActiveTab] = useState('ux');
  const [activeCategory, setActiveCategory] = useState('All');

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
    // =====================================================
    // UX DESIGN CARDS
    // =====================================================

    // --- GARRETT'S FIVE PLANES ---
    {
      id: 1,
      tab: 'ux',
      category: "Garrett's Five Planes",
      title: "Strategy Plane",
      summary: "Why are we building this?",
      details: "The foundation of Garrett's Elements of User Experience. The Strategy Plane defines user needs (what do users want from the product?) and business objectives (what do stakeholders want?). Every design decision should trace back to this plane.",
      action: "Define user goals and business goals before designing anything."
    },
    {
      id: 2,
      tab: 'ux',
      category: "Garrett's Five Planes",
      title: "Scope Plane",
      summary: "What are we going to build?",
      details: "The Scope Plane translates strategy into requirements. For functionality, this means feature specifications. For information, this means content requirements. Scope answers: what features and content will fulfill our strategic goals?",
      action: "Create a prioritized list of features based on user and business needs."
    },
    {
      id: 3,
      tab: 'ux',
      category: "Garrett's Five Planes",
      title: "Structure Plane",
      summary: "How is it organized?",
      details: "The Structure Plane defines how users move through the system. Interaction design shapes how users interact with functionality. Information architecture organizes content into coherent structures. This is where navigation patterns emerge.",
      action: "Map user flows and create an information architecture diagram."
    },
    {
      id: 4,
      tab: 'ux',
      category: "Garrett's Five Planes",
      title: "Skeleton Plane",
      summary: "How is it arranged on screen?",
      details: "The Skeleton Plane arranges elements for maximum effect. Interface design positions interactive elements. Navigation design helps users move through information. Information design presents content for comprehension. This is the wireframe level.",
      action: "Create wireframes that optimize element placement for usability."
    },
    {
      id: 5,
      tab: 'ux',
      category: "Garrett's Five Planes",
      title: "Surface Plane",
      summary: "How does it look?",
      details: "The Surface Plane is what users actually see: the visual design. Color, typography, imagery, and visual hierarchy come together here. The surface should reinforce and enhance all the planes beneath it, not just look pretty.",
      action: "Ensure visual design supports and doesn't contradict the UX beneath it."
    },

    // --- DON'T MAKE ME THINK ---
    {
      id: 10,
      tab: 'ux',
      category: "Don't Make Me Think",
      title: "Krug's First Law",
      summary: "Don't make me think!",
      details: "Steve Krug's foundational principle: a page should be self-evident and obvious. Users shouldn't have to spend mental effort figuring out what things are or how to use them. Every question mark adds to cognitive load and increases the chance users will leave.",
      action: "Ask yourself: would a user understand this instantly?"
    },
    {
      id: 11,
      tab: 'ux',
      category: "Don't Make Me Think",
      title: "How Users Actually Read",
      summary: "They don't read; they scan.",
      details: "Users don't read web pages word by word. They scan, picking out words and sentences that catch their interest. Design for scanning: use clear visual hierarchy, short paragraphs, bulleted lists, and meaningful headings. Make key information unmissable.",
      action: "Use headings, bold text, and visual breaks to support scanning."
    },
    {
      id: 12,
      tab: 'ux',
      category: "Don't Make Me Think",
      title: "Satisficing",
      summary: "Users choose the first reasonable option, not the best one.",
      details: "Users don't optimize; they 'satisfice' (satisfy + suffice). They'll click the first link that seems like it might lead somewhere useful. They won't carefully weigh all options. Design for this behavior by making the right path obvious.",
      action: "Make the primary action the most prominent and obviously correct choice."
    },
    {
      id: 13,
      tab: 'ux',
      category: "Don't Make Me Think",
      title: "Omit Needless Words",
      summary: "Half the words on most pages can go.",
      details: "Krug's Third Law of Usability: Get rid of half the words on each page, then get rid of half of what's left. Happy talk (intro text that doesn't say anything) and instructions (that nobody reads) should be ruthlessly cut.",
      action: "Edit your copy. Then edit it again. Remove everything non-essential."
    },
    {
      id: 14,
      tab: 'ux',
      category: "Don't Make Me Think",
      title: "The Trunk Test",
      summary: "Could you figure out where you are if dropped here randomly?",
      details: "Imagine being blindfolded, driven around, and dropped on a random page of a website. Could you answer: What site is this? What page am I on? What are the major sections? What are my options? Where's the search? This tests navigation clarity.",
      action: "Test any page in isolation. Can users orient themselves immediately?"
    },

    // --- COGNITIVE LOAD THEORY ---
    {
      id: 20,
      tab: 'ux',
      category: "Cognitive Load Theory",
      title: "What is Cognitive Load?",
      summary: "Working memory has hard limits.",
      details: "Cognitive Load Theory (Sweller, 1988) explains that working memory can only handle a limited amount of information at once. When interfaces exceed this capacity, users become confused, make errors, and abandon tasks. Good UX respects these mental limits.",
      action: "Audit your interface for unnecessary complexity."
    },
    {
      id: 21,
      tab: 'ux',
      category: "Cognitive Load Theory",
      title: "Intrinsic Load",
      summary: "The inherent complexity of the task.",
      details: "Intrinsic load comes from the complexity of the task itself. Filing taxes is inherently complex; checking the weather isn't. You can't eliminate intrinsic load, but you can break complex tasks into manageable chunks and provide scaffolding.",
      action: "Break complex tasks into smaller, sequential steps."
    },
    {
      id: 22,
      tab: 'ux',
      category: "Cognitive Load Theory",
      title: "Extraneous Load",
      summary: "Unnecessary complexity from bad design.",
      details: "Extraneous load is wasted mental effort caused by poor design: confusing layouts, inconsistent patterns, unclear labels, and visual clutter. This is the load you CAN and SHOULD eliminate. Every bit of extraneous load steals resources from the actual task.",
      action: "Remove anything that doesn't directly help users complete their task."
    },
    {
      id: 23,
      tab: 'ux',
      category: "Cognitive Load Theory",
      title: "Germane Load",
      summary: "Productive effort that builds understanding.",
      details: "Germane load is the good kind: mental effort spent building schemas and understanding. Well-designed learning experiences maximize germane load while minimizing extraneous load. The goal is to direct all available cognitive resources toward meaningful learning.",
      action: "Use progressive disclosure to introduce complexity gradually."
    },

    // --- MILLER'S LAW ---
    {
      id: 30,
      tab: 'ux',
      category: "Miller's Law",
      title: "The Magical Number 7±2",
      summary: "Working memory holds about 7 items.",
      details: "George Miller's 1956 paper found that people can hold roughly 7 (plus or minus 2) items in working memory. This doesn't mean every menu needs exactly 7 items, but it does mean overwhelming users with too many options at once will cause cognitive overload.",
      action: "Chunk information into groups of 5 to 9 related items."
    },
    {
      id: 31,
      tab: 'ux',
      category: "Miller's Law",
      title: "Chunking",
      summary: "Group information into meaningful units.",
      details: "Chunking organizes individual pieces of information into larger, meaningful units. Phone numbers are chunked (555-867-5309, not 5558675309). Credit cards use groups of four. Chunking extends effective memory by treating groups as single items.",
      action: "Group related items visually and logically to reduce perceived complexity."
    },

    // --- NORMAN'S THREE LEVELS ---
    {
      id: 40,
      tab: 'ux',
      category: "Norman's Three Levels",
      title: "Visceral Design",
      summary: "The immediate gut reaction.",
      details: "Don Norman's visceral level is automatic and prewired: our immediate emotional response to what we see. Before any conscious thought, we react to colors, shapes, sounds, and feel. First impressions happen here. Visceral design makes users feel something instantly.",
      action: "Consider the emotional impact of your visual design at first glance."
    },
    {
      id: 41,
      tab: 'ux',
      category: "Norman's Three Levels",
      title: "Behavioral Design",
      summary: "The pleasure of effective use.",
      details: "The behavioral level is about use. Does it work? Is it usable? Does it feel good to interact with? This is where traditional usability lives. Users get satisfaction from accomplishing tasks effectively, efficiently, and with a sense of control.",
      action: "Ensure interactions feel responsive, intuitive, and rewarding."
    },
    {
      id: 42,
      tab: 'ux',
      category: "Norman's Three Levels",
      title: "Reflective Design",
      summary: "The story we tell ourselves.",
      details: "The reflective level involves conscious thought: what does this product say about me? How do I feel about owning or using it? This is about self-image, personal satisfaction, and memories. Reflective design creates meaning and builds lasting relationships with products.",
      action: "Consider what identity and values your product communicates to users."
    },

    // --- NIELSEN'S 10 HEURISTICS ---
    {
      id: 50,
      tab: 'ux',
      category: "Nielsen's Heuristics",
      title: "#1: Visibility of System Status",
      summary: "Keep users informed about what's happening.",
      details: "The design should always keep users informed about what is going on, through appropriate feedback within reasonable time. Loading indicators, progress bars, success confirmations, and error states all contribute to system status visibility.",
      action: "Ensure every user action has immediate, visible feedback."
    },
    {
      id: 51,
      tab: 'ux',
      category: "Nielsen's Heuristics",
      title: "#2: Match with the Real World",
      summary: "Speak the user's language.",
      details: "The design should speak the users' language, using words, phrases, and concepts familiar to them. Follow real-world conventions, making information appear in a natural and logical order. Avoid system-oriented jargon.",
      action: "Use terminology your users actually use, not internal jargon."
    },
    {
      id: 52,
      tab: 'ux',
      category: "Nielsen's Heuristics",
      title: "#3: User Control & Freedom",
      summary: "Always provide an emergency exit.",
      details: "Users often perform actions by mistake. They need a clearly marked 'emergency exit' to leave the unwanted state without going through an extended process. Support undo and redo. Let users feel in control, not trapped.",
      action: "Add clear cancel, back, and undo options to all flows."
    },
    {
      id: 53,
      tab: 'ux',
      category: "Nielsen's Heuristics",
      title: "#4: Consistency & Standards",
      summary: "Don't make users wonder if different things mean the same.",
      details: "Users shouldn't have to wonder whether different words, situations, or actions mean the same thing. Follow platform and industry conventions. Internal consistency (within your product) and external consistency (with other products) both matter.",
      action: "Audit your interface for inconsistent patterns and terminology."
    },
    {
      id: 54,
      tab: 'ux',
      category: "Nielsen's Heuristics",
      title: "#5: Error Prevention",
      summary: "Prevent errors before they happen.",
      details: "Even better than good error messages is a careful design that prevents problems from occurring in the first place. Eliminate error-prone conditions or check for them and present users with a confirmation option before they commit to an action.",
      action: "Use constraints, defaults, and confirmations to prevent mistakes."
    },
    {
      id: 55,
      tab: 'ux',
      category: "Nielsen's Heuristics",
      title: "#6: Recognition over Recall",
      summary: "Show options rather than requiring memory.",
      details: "Minimize the user's memory load by making elements, actions, and options visible. Users shouldn't have to remember information from one part of the interface to another. Instructions should be visible or easily retrievable.",
      action: "Use menus, suggestions, and visible options instead of blank fields."
    },
    {
      id: 56,
      tab: 'ux',
      category: "Nielsen's Heuristics",
      title: "#7: Flexibility & Efficiency",
      summary: "Provide accelerators for expert users.",
      details: "Accelerators, often unseen by novice users, can speed up interaction for experts. Allow users to tailor frequent actions. Keyboard shortcuts, customization options, and power-user features let experienced users work faster without complicating the novice experience.",
      action: "Add keyboard shortcuts and customization for power users."
    },
    {
      id: 57,
      tab: 'ux',
      category: "Nielsen's Heuristics",
      title: "#8: Aesthetic & Minimalist Design",
      summary: "Remove everything that doesn't help.",
      details: "Interfaces should not contain information that is irrelevant or rarely needed. Every extra unit of information competes with relevant information and diminishes their relative visibility. Strive for signal, not noise.",
      action: "Question every element: does this help users accomplish their goal?"
    },
    {
      id: 58,
      tab: 'ux',
      category: "Nielsen's Heuristics",
      title: "#9: Help Users with Errors",
      summary: "Error messages should propose solutions.",
      details: "Error messages should be expressed in plain language (no codes), precisely indicate the problem, and constructively suggest a solution. Don't just say what went wrong; help users fix it and move forward.",
      action: "Write error messages that explain the problem and offer next steps."
    },
    {
      id: 59,
      tab: 'ux',
      category: "Nielsen's Heuristics",
      title: "#10: Help & Documentation",
      summary: "Provide searchable, task-focused help.",
      details: "Even though it's better if the system can be used without documentation, it may be necessary to provide help. Such information should be easy to search, focused on the user's task, list concrete steps, and not be too large.",
      action: "Create contextual help that appears where and when users need it."
    },

    // --- GESTALT PRINCIPLES ---
    {
      id: 60,
      tab: 'ux',
      category: "Gestalt Principles",
      title: "Law of Proximity",
      summary: "Things close together appear grouped.",
      details: "Objects that are near each other tend to be perceived as a group. This is fundamental to organizing information. We perceive elements that are closer together as related, while those further apart seem unrelated. Whitespace is a powerful grouping tool.",
      action: "Use consistent spacing to create clear visual groups."
    },
    {
      id: 61,
      tab: 'ux',
      category: "Gestalt Principles",
      title: "Law of Similarity",
      summary: "Similar elements appear grouped.",
      details: "Elements that share visual characteristics (color, shape, size, orientation) are perceived as related. When proximity isn't enough, use similarity to create associations. Conversely, make functionally different elements look different.",
      action: "Style related elements consistently; differentiate unrelated ones."
    },
    {
      id: 62,
      tab: 'ux',
      category: "Gestalt Principles",
      title: "Law of Closure",
      summary: "We complete incomplete shapes.",
      details: "The mind fills in missing information to perceive complete shapes, even when parts are missing. This allows designers to suggest shapes and connections without explicitly drawing them, creating cleaner, more elegant designs.",
      action: "Use implied shapes and connections to reduce visual clutter."
    },
    {
      id: 63,
      tab: 'ux',
      category: "Gestalt Principles",
      title: "Law of Continuity",
      summary: "The eye follows smooth paths.",
      details: "Elements arranged on a line or curve are perceived as more related than elements not on the line or curve. The eye naturally follows the smoothest path. Use this to guide attention and create visual flow through your design.",
      action: "Align elements to create clear visual paths through the interface."
    },
    {
      id: 64,
      tab: 'ux',
      category: "Gestalt Principles",
      title: "Figure-Ground",
      summary: "We separate foreground from background.",
      details: "The eye differentiates an object (figure) from its surrounding area (ground). The figure-ground relationship helps users understand what's interactive vs. decorative, what's primary vs. secondary, what to focus on vs. ignore.",
      action: "Create clear contrast between interactive elements and backgrounds."
    },
    {
      id: 65,
      tab: 'ux',
      category: "Gestalt Principles",
      title: "Law of Common Region",
      summary: "Enclosed elements appear grouped.",
      details: "Elements that share a common region (like a card, box, or background color) are perceived as belonging together. Borders and backgrounds create implicit groupings, helping users understand which elements are related.",
      action: "Use cards, containers, and backgrounds to group related content."
    },

    // --- PSYCHOLOGY & BEHAVIOR ---
    {
      id: 70,
      tab: 'ux',
      category: "Psychology & Behavior",
      title: "Fitts's Law",
      summary: "Bigger and closer targets are faster to hit.",
      details: "The time to acquire a target is a function of the distance to and size of the target. Large targets close to the user's current position are fastest to click. Edges and corners of screens are especially easy to hit (infinite edges).",
      action: "Make important buttons large and position them near likely cursor locations."
    },
    {
      id: 71,
      tab: 'ux',
      category: "Psychology & Behavior",
      title: "Hick's Law",
      summary: "More choices = longer decisions.",
      details: "The time it takes to make a decision increases with the number and complexity of choices. This doesn't mean fewer options are always better, but choices should be clearly differentiated and progressively disclosed when possible.",
      action: "Reduce options or break complex choices into sequential steps."
    },
    {
      id: 72,
      tab: 'ux',
      category: "Psychology & Behavior",
      title: "Jakob's Law",
      summary: "Users expect your site to work like others.",
      details: "Users spend most of their time on other sites. They prefer your site to work the same way. Leverage existing mental models. Innovation in interaction patterns has a cost: users must learn new behaviors.",
      action: "Follow established conventions unless you have a very good reason not to."
    },
    {
      id: 73,
      tab: 'ux',
      category: "Psychology & Behavior",
      title: "Peak-End Rule",
      summary: "Experiences are judged by peaks and endings.",
      details: "People judge an experience largely based on how they felt at its most intense point (peak) and at its end, rather than the average of every moment. A frustrating middle can be forgiven if the ending is delightful.",
      action: "Invest extra effort in high-impact moments and endings."
    },
    {
      id: 74,
      tab: 'ux',
      category: "Psychology & Behavior",
      title: "Serial Position Effect",
      summary: "We remember firsts and lasts best.",
      details: "Users have a propensity to best remember the first and last items in a series. Place the most important items at the beginning and end of lists, menus, and sequences. The middle is where things get lost.",
      action: "Put key actions at the start or end of navigation and lists."
    },
    {
      id: 75,
      tab: 'ux',
      category: "Psychology & Behavior",
      title: "Von Restorff Effect",
      summary: "Different things stand out.",
      details: "The Von Restorff effect (isolation effect) predicts that when multiple similar objects are present, the one that differs from the rest is most likely to be remembered. Use visual distinctiveness strategically to highlight what matters.",
      action: "Make your primary CTA visually distinct from secondary actions."
    },
    {
      id: 76,
      tab: 'ux',
      category: "Psychology & Behavior",
      title: "Aesthetic-Usability Effect",
      summary: "Beautiful things seem easier to use.",
      details: "Users often perceive aesthetically pleasing design as more usable. Beautiful products trigger positive emotions that actually improve cognitive abilities like creative thinking and problem-solving. Aesthetics aren't just superficial; they affect perceived usability.",
      action: "Invest in visual polish; it genuinely improves user perception."
    },
    {
      id: 77,
      tab: 'ux',
      category: "Psychology & Behavior",
      title: "Doherty Threshold",
      summary: "Keep response times under 400ms.",
      details: "Productivity soars when a computer and its users interact at a pace (<400ms) that ensures neither has to wait on the other. Delays longer than 400ms break concentration. Under 100ms feels instantaneous. Every millisecond matters.",
      action: "Optimize performance; use skeleton states for unavoidable delays."
    },
    {
      id: 78,
      tab: 'ux',
      category: "Psychology & Behavior",
      title: "Zeigarnik Effect",
      summary: "Incomplete tasks stay in our minds.",
      details: "People remember uncompleted or interrupted tasks better than completed ones. Progress indicators, checklists, and visible completion states leverage this effect. Showing 'almost done' can motivate users to complete tasks.",
      action: "Show progress and highlight incomplete steps to encourage completion."
    },

    // --- DESIGN PRINCIPLES ---
    {
      id: 80,
      tab: 'ux',
      category: "Design Principles",
      title: "Progressive Disclosure",
      summary: "Show only what's needed now.",
      details: "Defer advanced or rarely needed features to secondary screens. This keeps primary interfaces simple and approachable while still making power features accessible. Show the basics first; reveal complexity progressively as users need it.",
      action: "Move advanced options behind 'More' or 'Advanced' controls."
    },
    {
      id: 81,
      tab: 'ux',
      category: "Design Principles",
      title: "Affordances & Signifiers",
      summary: "Design should suggest its own use.",
      details: "Affordances are what an object allows you to do. Signifiers are signals that communicate where the action should take place. A button should look pressable. A link should look clickable. Don't make users guess how to interact.",
      action: "Ensure interactive elements have clear visual affordances."
    },
    {
      id: 82,
      tab: 'ux',
      category: "Design Principles",
      title: "Tesler's Law",
      summary: "Complexity can be moved, but not eliminated.",
      details: "The Law of Conservation of Complexity states that every application has inherent complexity that cannot be removed. The question is: who deals with it, the user or the developer? Good design absorbs complexity so users don't have to.",
      action: "Invest engineering effort to simplify things for users."
    },
    {
      id: 83,
      tab: 'ux',
      category: "Design Principles",
      title: "Postel's Law",
      summary: "Be liberal in what you accept.",
      details: "Be conservative in what you send, be liberal in what you accept. Also known as the Robustness Principle. Accept variable input from users (different date formats, with or without spaces) and convert it to a consistent format behind the scenes.",
      action: "Accept flexible inputs; provide structured outputs."
    },
    {
      id: 84,
      tab: 'ux',
      category: "Design Principles",
      title: "Mental Models",
      summary: "Design for how users think it works.",
      details: "A mental model is what the user believes about how a system works. Users build these models from experience with similar products. When your system matches users' mental models, it feels intuitive. When it doesn't, confusion follows.",
      action: "Research how users expect your product to work before designing."
    },
    {
      id: 85,
      tab: 'ux',
      category: "Design Principles",
      title: "Occam's Razor",
      summary: "The simplest solution is usually best.",
      details: "When choosing between design approaches, prefer the one with the fewest assumptions and complications. Complexity should be justified. Every added element, interaction, or concept is a potential source of confusion and bugs.",
      action: "Before adding anything, ask: is there a simpler way?"
    },

    // =====================================================
    // ACCESSIBILITY CARDS (POUR)
    // =====================================================

    // --- PERCEIVABLE ---
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
      details: "Every non-text element needs a text equivalent. Images require alt text, videos need captions and transcripts, and icons need accessible names. Screen readers can't interpret pixels; they need words. Decorative images get empty alt attributes; informative content needs full descriptions.",
      action: "Add meaningful alt text to every functional image."
    },
    {
      id: 102,
      tab: 'accessibility',
      category: "Perceivable",
      title: "Time-Based Media",
      summary: "Captions, transcripts, and audio descriptions.",
      details: "Videos need synchronized captions for deaf users and audio descriptions for blind users. Pre-recorded audio needs transcripts. Live content requires real-time captions. Don't let multimedia become a barrier. Provide multiple ways to access the same information.",
      action: "Add captions to all video content as a baseline."
    },
    {
      id: 103,
      tab: 'accessibility',
      category: "Perceivable",
      title: "Adaptable Content",
      summary: "Structure that transforms gracefully.",
      details: "Content should be presentable in different ways without losing meaning. Use semantic HTML so assistive technologies understand your structure. Headings, lists, tables, and landmarks must be properly coded, not just visually styled. When CSS is disabled, your content should still make sense.",
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

    // --- OPERABLE ---
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
      details: "Flashing content can trigger seizures. Nothing should flash more than 3 times per second. Animations can cause vestibular disorders and nausea. Provide controls to pause, stop, or hide motion. Respect the 'prefers-reduced-motion' setting in user's operating systems.",
      action: "Implement prefers-reduced-motion media queries."
    },
    {
      id: 204,
      tab: 'accessibility',
      category: "Operable",
      title: "Navigable",
      summary: "Help users find their way around.",
      details: "Users need to know where they are and how to get where they're going. Provide skip links, descriptive page titles, logical focus order, and multiple ways to find pages. Link text should describe the destination. 'Click here' tells users nothing.",
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

    // --- UNDERSTANDABLE ---
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
      details: "Identify the language of the page and any language changes within content. Write clearly and define unusual terms, abbreviations, and jargon. Consider reading level. Readable content benefits everyone, not just those with cognitive disabilities.",
      action: "Set the lang attribute on your HTML element."
    },
    {
      id: 302,
      tab: 'accessibility',
      category: "Understandable",
      title: "Predictable Behavior",
      summary: "No surprises; consistency builds confidence.",
      details: "Interfaces should behave consistently. Components that look the same should work the same. Focus shouldn't trigger unexpected changes. Forms shouldn't submit automatically. Navigation should remain consistent across pages. When users understand the pattern, they can use your site confidently.",
      action: "Keep navigation and component behavior consistent site-wide."
    },
    {
      id: 303,
      tab: 'accessibility',
      category: "Understandable",
      title: "Input Assistance",
      summary: "Help users avoid and correct mistakes.",
      details: "Clearly identify and describe errors in text, not just color. Provide labels and instructions before users need them. Offer suggestions for fixing errors. For important submissions, allow review, confirmation, or reversal. Everyone makes mistakes; good design helps recover from them.",
      action: "Show specific, helpful error messages next to form fields."
    },

    // --- ROBUST ---
    {
      id: 400,
      tab: 'accessibility',
      category: "Robust",
      title: "What is Robust?",
      summary: "Built to last and work everywhere.",
      details: "Content must work reliably across different browsers, devices, and assistive technologies, both now and in the future. Robust code follows standards, ensuring your accessibility efforts actually reach the users who need them.",
      action: "Validate your HTML and fix parsing errors."
    },
    {
      id: 401,
      tab: 'accessibility',
      category: "Robust",
      title: "Compatible Code",
      summary: "Valid, semantic, and standards-compliant.",
      details: "Use valid HTML with proper opening/closing tags and unique IDs. Avoid deprecated elements. Provide name, role, and value for all UI components, especially custom widgets. ARIA attributes must be used correctly: wrong ARIA is worse than no ARIA.",
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

    // --- POUR SUMMARY ---
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
      details: "Automated tools catch about 30% of issues. To truly test POUR: navigate your entire site by keyboard, use a screen reader, disable CSS, zoom to 200%, check contrast ratios, test on mobile, and most importantly, involve people with disabilities in your testing.",
      action: "Include manual testing and real user feedback in QA."
    }
  ];

  // Get unique categories for the current tab
  const categories = useMemo(() => {
    const tabPrinciples = principles.filter(p => p.tab === activeTab);
    const uniqueCategories = [...new Set(tabPrinciples.map(p => p.category))];
    return ['All', ...uniqueCategories];
  }, [activeTab]);

  // Reset category filter when switching tabs
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setActiveCategory('All');
    setFlippedCardId(null);
  };

  const handleCardClick = (id) => {
    setFlippedCardId(flippedCardId === id ? null : id);
  };

  const filteredPrinciples = principles.filter(p => {
    if (p.tab !== activeTab) return false;
    if (activeCategory === 'All') return true;
    return p.category === activeCategory;
  });

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
              onClick={() => handleTabChange('ux')}
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
              onClick={() => handleTabChange('accessibility')}
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

          {/* Category Filter Pills */}
          <div className="categoryFilters" style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            justifyContent: 'center',
            marginTop: '1.5rem',
            maxWidth: '900px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                style={{
                  fontSize: `${fontSize * 0.85}px`,
                  padding: '0.4rem 0.9rem',
                  borderRadius: '20px',
                  border: `1px solid ${textColor}44`,
                  backgroundColor: activeCategory === category ? `${textColor}22` : 'transparent',
                  color: textColor,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontWeight: activeCategory === category ? '600' : '400'
                }}
              >
                {category}
              </button>
            ))}
          </div>

          <p style={{ opacity: 0.8, marginTop: '2rem' }}>
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