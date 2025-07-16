import React, { useState, useEffect } from 'react';
import './App.css';
import planData from './reading-plan-with-dates';
import logo from './logo.png';

function passageLink(passage) {
  if (!passage) return null;
  // Remove extra spaces, replace ' - ' with '-', handle commas, ensure space after semicolons
  let formatted = passage
    .replace(/\s*-\s*/g, '-')
    .replace(/\s*,\s*/g, ', ')
    .replace(/;\s*/g, '; ')
    .replace(/\s+/g, ' ')
    .trim();
  // Remove double spaces that may result from replacements
  formatted = formatted.replace(/  +/g, ' ');
  return `https://www.biblegateway.com/passage/?search=${encodeURIComponent(formatted)}&version=NIV`;
}

function getCurrentWeekIndex(plan, today) {
  const releaseDate = new Date('2025-09-08');
  if (today < releaseDate) return 0;
  for (let i = plan.length - 1; i >= 0; i--) {
    if (today >= new Date(plan[i].date)) return i;
  }
  return 0;
}

// Adding Bible resources and advice for reading scripture
const bibleResources = [
  { name: 'Bible Hub', url: 'https://biblehub.com/' },
  { name: 'Bible Gateway', url: 'https://www.biblegateway.com/' },
  { name: 'Blue Letter Bible', url: 'https://www.blueletterbible.org/' },
  { name: 'YouVersion', url: 'https://www.youversion.com/' },
  { name: 'ESV Bible', url: 'https://www.esv.org/' },
  { name: 'Logos Bible Software', url: 'https://www.logos.com/' },
  { name: 'BibleStudyTools', url: 'https://www.biblestudytools.com/' },
  { name: 'Olive Tree Bible', url: 'https://www.olivetree.com/' },
  { name: 'Bible.com', url: 'https://www.bible.com/' },
  { name: 'Accordance Bible Software', url: 'https://www.accordancebible.com/' },
  { name: 'Crossway', url: 'https://www.crossway.org/' },
  { name: 'Got Questions', url: 'https://www.gotquestions.org/' }
];

export default function App() {
  const [weekIndex, setWeekIndex] = useState(0);
  const [readingProgress, setReadingProgress] = useState({});
  
  useEffect(() => {
    const today = new Date();
    setWeekIndex(getCurrentWeekIndex(planData, today));
    
    // Load reading progress from localStorage
    const savedProgress = localStorage.getItem('bibleReadingProgress');
    if (savedProgress) {
      setReadingProgress(JSON.parse(savedProgress));
    }
  }, []);

  const week = planData[weekIndex];
  const progressPercentage = Math.round(((weekIndex + 1) / planData.length) * 100);

  // Function to handle checkbox changes
  const handleReadingCheck = (weekIndex, readingType, sectionIndex, chapterIndex = null) => {
    const key = chapterIndex !== null 
      ? `${weekIndex}-${readingType}-${sectionIndex}-${chapterIndex}`
      : `${weekIndex}-${readingType}-${sectionIndex}`;
    
    const newProgress = {
      ...readingProgress,
      [key]: !readingProgress[key]
    };
    
    setReadingProgress(newProgress);
    localStorage.setItem('bibleReadingProgress', JSON.stringify(newProgress));
  };

  // Function to check if a reading is completed
  const isReadingCompleted = (weekIndex, readingType, sectionIndex, chapterIndex = null) => {
    const key = chapterIndex !== null 
      ? `${weekIndex}-${readingType}-${sectionIndex}-${chapterIndex}`
      : `${weekIndex}-${readingType}-${sectionIndex}`;
    
    return readingProgress[key] || false;
  };

  // Function to parse chapter ranges and get individual chapters
  const parseChapterRange = (passage) => {
    if (!passage) return [];
    
    // Handle ranges like "Matthew 1-2" or "Genesis 1-3"
    const rangeMatch = passage.match(/^(.+?)\s+(\d+)-(\d+)$/);
    if (rangeMatch) {
      const [, book, start, end] = rangeMatch;
      const chapters = [];
      for (let i = parseInt(start); i <= parseInt(end); i++) {
        chapters.push({
          reference: `${book} ${i}`,
          chapterNumber: i
        });
      }
      return { 
        display: passage, 
        chapters: chapters,
        isRange: true 
      };
    }
    
    // Handle single chapters like "Genesis 3" or other formats
    const singleChapterMatch = passage.match(/^(.+?)\s+(\d+)$/);
    if (singleChapterMatch) {
      const [, book, chapter] = singleChapterMatch;
      return { 
        display: passage, 
        chapters: [{
          reference: passage,
          chapterNumber: parseInt(chapter)
        }],
        isRange: false 
      };
    }
    
    // Handle other formats (like "Psalm 1:1-6" or complex references)
    return { 
      display: passage, 
      chapters: [{
        reference: passage,
        chapterNumber: 1 // Default to 1 for complex references
      }],
      isRange: false 
    };
  };

  // Function to split passages into chapters
  const getChapters = (passage) => {
    if (!passage) return [];
    // Split by semicolon first, then by comma if no semicolon
    const sections = passage.includes(';') 
      ? passage.split(';').map(ch => ch.trim())
      : passage.split(',').map(ch => ch.trim());
    
    return sections.map(section => parseChapterRange(section));
  };

  return (
    <div className="container">
      <header className="header">
        <img 
          src={logo} 
          alt="K-ZMC logo" 
          className="logo"
        />
        <h1 className="title">
          Bible Reading Plan
        </h1>
        <p className="subtitle">Grow in faith with a guided weekly plan</p>
        <div className="pdf-link-container">
          <a 
            href="/Full 156 week plan KZMC.pdf" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="pdf-link"
          >
            📄 Download Full 156 Week Plan (PDF)
          </a>
        </div>
      </header>
      
      <main className="main">
        <div className="navigation">
          <button
            onClick={() => setWeekIndex(i => Math.max(0, i - 1))}
            disabled={weekIndex === 0}
            className="nav-button"
          >
            Previous
          </button>
          
          <div className="week-display">
            Week {weekIndex + 1} of {planData.length}
            <span className="week-highlight">{week.date}</span>
            <div className="progress-container">
              <div 
                className="progress-bar" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="progress-text">
              {progressPercentage}% Complete
            </div>
          </div>
          
          <button
            onClick={() => setWeekIndex(i => Math.min(planData.length - 1, i + 1))}
            disabled={weekIndex === planData.length - 1}
            className="nav-button"
          >
            Next
          </button>
        </div>
        
        <div className="content">
          <div className="reading-item">
            <span className="reading-label">
              NT Reading
            </span>
            <div className="reading-passages">
              {getChapters(week.nt).map((section, sectionIndex) => (
                <div key={sectionIndex} className="passage-item">
                  <div className="reading-link-container">
                    <a 
                      href={passageLink(section.display)} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="reading-link"
                    >
                      {section.display}
                    </a>
                    <div className="chapter-checkboxes">
                      {section.chapters.map((chapter, chapterIndex) => (
                        <label key={chapterIndex} className="chapter-checkbox-label">
                          <input
                            type="checkbox"
                            id={`nt-${weekIndex}-${sectionIndex}-${chapterIndex}`}
                            checked={isReadingCompleted(weekIndex, 'nt', sectionIndex, chapterIndex)}
                            onChange={() => handleReadingCheck(weekIndex, 'nt', sectionIndex, chapterIndex)}
                            className="reading-checkbox"
                          />
                          <span className="chapter-number">Ch {chapter.chapterNumber}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="reading-item">
            <span className="reading-label">
              OT Connection
            </span>
            <div className="reading-passages">
              {getChapters(week.otConnection).map((section, sectionIndex) => (
                <div key={sectionIndex} className="passage-item">
                  <div className="reading-link-container">
                    <a 
                      href={passageLink(section.display)} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="reading-link"
                    >
                      {section.display}
                    </a>
                    <div className="chapter-checkboxes">
                      {section.chapters.map((chapter, chapterIndex) => (
                        <label key={chapterIndex} className="chapter-checkbox-label">
                          <input
                            type="checkbox"
                            id={`otConnection-${weekIndex}-${sectionIndex}-${chapterIndex}`}
                            checked={isReadingCompleted(weekIndex, 'otConnection', sectionIndex, chapterIndex)}
                            onChange={() => handleReadingCheck(weekIndex, 'otConnection', sectionIndex, chapterIndex)}
                            className="reading-checkbox"
                          />
                          <span className="chapter-number">Ch {chapter.chapterNumber}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="reading-item">
            <span className="reading-label">
              OT Reading
            </span>
            <div className="reading-passages">
              {getChapters(week.ot).map((section, sectionIndex) => (
                <div key={sectionIndex} className="passage-item">
                  <div className="reading-link-container">
                    <a 
                      href={passageLink(section.display)} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="reading-link"
                    >
                      {section.display}
                    </a>
                    <div className="chapter-checkboxes">
                      {section.chapters.map((chapter, chapterIndex) => (
                        <label key={chapterIndex} className="chapter-checkbox-label">
                          <input
                            type="checkbox"
                            id={`ot-${weekIndex}-${sectionIndex}-${chapterIndex}`}
                            checked={isReadingCompleted(weekIndex, 'ot', sectionIndex, chapterIndex)}
                            onChange={() => handleReadingCheck(weekIndex, 'ot', sectionIndex, chapterIndex)}
                            className="reading-checkbox"
                          />
                          <span className="chapter-number">Ch {chapter.chapterNumber}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="footer">
          {weekIndex === 0 
            ? 'Reading plan starts September 8, 2025' 
            : `Stay consistent in your daily reading journey!`
          }
        </div>
      </main>
      
      <footer className="resources-footer">
        <h2 className="resources-title">
          Bible Resources
        </h2>
        <ul className="resources-list">
          {bibleResources.map(resource => (
            <li key={resource.name} className="resource-item">
              <a 
                href={resource.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="resource-link"
              >
                {resource.name}
              </a>
            </li>
          ))}
        </ul>
        <div className="spiritual-discipline-section">
          <h3 className="discipline-title">Bible Reading as Apprenticeship to Jesus</h3>
          <p className="discipline-text">
            True discipleship is about learning to live like Jesus—not just knowing about Him, but becoming 
            like Him. Bible reading is one of the most powerful spiritual disciplines for this transformation, 
            as it allows us to <strong>be with Jesus</strong>, <strong>become like Jesus</strong>, and learn to 
            <strong> do as Jesus did</strong>.
          </p>
          <p className="discipline-text">
            <strong>Be with Jesus:</strong> When we read Scripture, we're not just gathering information—we're 
            entering into the presence of the living Word. Approach your Bible reading as sacred time with 
            Jesus. Slow down, quiet your heart, and practice abiding in His presence. Let Scripture become 
            a place where you meet with God, not merely a book to be studied.
          </p>
          <p className="discipline-text">
            <strong>Become like Jesus:</strong> Scripture is God's primary tool for spiritual formation. 
            As you read, pay attention to how Jesus lived, how He treated people, how He responded to 
            challenges. Ask yourself: "How is the Spirit inviting me to become more like Jesus through 
            this passage?" Let God's Word shape your character, values, and way of seeing the world.
          </p>
          <p className="discipline-text">
            <strong>Do as Jesus Did:</strong> Jesus didn't just teach about love—He embodied it. As you 
            read Scripture, look for practical ways to live out what you're learning. How can you extend 
            mercy, practice forgiveness, serve others, or seek justice in your daily life? Scripture 
            without application remains powerless to transform us.
          </p>
          <p className="discipline-text">
            <strong>Create Sacred Rhythms:</strong> Develop a sustainable rule of life that includes regular 
            Scripture reading. This isn't about checking off a religious duty, but about creating space 
            for God to form you. Start small—even five minutes of intentional Bible reading can become 
            a powerful spiritual discipline when practiced consistently.
          </p>
          <p className="discipline-text">
            <strong>Practice Lectio Divina:</strong> Try reading Scripture slowly and prayerfully. Read 
            a short passage three times: first for understanding, second for personal application, third 
            for hearing God's invitation to you. This ancient practice helps us encounter God through 
            His Word rather than just analyzing it.
          </p>
          <p className="discipline-text">
            Remember, spiritual formation is not about perfection but about apprenticeship. You're learning 
            to follow Jesus in the way of love, and Scripture is your guide. Be patient with yourself, 
            stay consistent, and trust that God is at work in you through His Word. This is how we grow 
            from being merely believers to becoming true apprentices of Jesus.
          </p>
        </div>
      </footer>
    </div>
  );
}
