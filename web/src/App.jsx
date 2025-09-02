import React, { useState, useEffect } from 'react';
import './App.css';
import planData from './reading-plan-with-dates';
import logo from './logo.png';

// Bible book chapter counts
const bookChapterCounts = {
  // Old Testament
  'Genesis': 50, 'Exodus': 40, 'Leviticus': 27, 'Numbers': 36, 'Deuteronomy': 34,
  'Joshua': 24, 'Judges': 21, 'Ruth': 4, '1 Samuel': 31, '2 Samuel': 24,
  '1 Kings': 22, '2 Kings': 25, '1 Chronicles': 29, '2 Chronicles': 36, 'Ezra': 10,
  'Nehemiah': 13, 'Esther': 10, 'Job': 42, 'Psalms': 150, 'Proverbs': 31,
  'Ecclesiastes': 12, 'Song of Solomon': 8, 'Song of Songs': 8, 'Isaiah': 66, 'Jeremiah': 52,
  'Lamentations': 5, 'Ezekiel': 48, 'Daniel': 12, 'Hosea': 14, 'Joel': 3,
  'Amos': 9, 'Obadiah': 1, 'Jonah': 4, 'Micah': 7, 'Nahum': 3,
  'Habakkuk': 3, 'Zephaniah': 3, 'Haggai': 2, 'Zechariah': 14, 'Malachi': 4,
  // New Testament
  'Matthew': 28, 'Mark': 16, 'Luke': 24, 'John': 21, 'Acts': 28,
  'Romans': 16, '1 Corinthians': 16, '2 Corinthians': 13, 'Galatians': 6, 'Ephesians': 6,
  'Philippians': 4, 'Colossians': 4, '1 Thessalonians': 5, '2 Thessalonians': 3, '1 Timothy': 6,
  '2 Timothy': 4, 'Titus': 3, 'Philemon': 1, 'Hebrews': 13, 'James': 5,
  '1 Peter': 5, '2 Peter': 3, '1 John': 5, '2 John': 1, '3 John': 1,
  'Jude': 1, 'Revelation': 22
};

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
  if (today < releaseDate) return -1; // Return -1 to indicate plan hasn't started
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
    const currentWeek = getCurrentWeekIndex(planData, today);
    setWeekIndex(currentWeek === -1 ? 0 : currentWeek); // Show week 0 if plan hasn't started
    
    // Load reading progress from localStorage
    const savedProgress = localStorage.getItem('bibleReadingProgress');
    if (savedProgress) {
      setReadingProgress(JSON.parse(savedProgress));
    }
  }, []);

  const today = new Date();
  const planStarted = today >= new Date('2025-09-08');
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
    
    // Handle cross-book ranges like "Genesis 49-Exodus 4"
    const crossBookMatch = passage.match(/^(.+?)\s+(\d+)-(.+?)\s+(\d+)$/);
    if (crossBookMatch) {
      const [, firstBook, firstChapter, secondBook, secondChapter] = crossBookMatch;
      const chapters = [];
      
      const firstBookChapterCount = bookChapterCounts[firstBook];
      const firstChapterNum = parseInt(firstChapter);
      const secondChapterNum = parseInt(secondChapter);
      
      // Add remaining chapters from the first book (from firstChapter to end of book)
      if (firstBookChapterCount) {
        for (let i = firstChapterNum; i <= firstBookChapterCount; i++) {
          chapters.push({
            reference: `${firstBook} ${i}`,
            chapterNumber: i
          });
        }
      } else {
        // Fallback if book not found
        chapters.push({
          reference: `${firstBook} ${firstChapter}`,
          chapterNumber: firstChapterNum
        });
      }
      
      // Add chapters from the second book (from 1 to secondChapter)
      for (let i = 1; i <= secondChapterNum; i++) {
        chapters.push({
          reference: `${secondBook} ${i}`,
          chapterNumber: i
        });
      }
      
      return { 
        display: passage, 
        chapters: chapters,
        isRange: true 
      };
    }
    
    // Handle same-book ranges like "Matthew 1-2" or "Genesis 1-3"
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
    
    // First, normalize the passage to handle different separators
    let normalizedPassage = passage;
    
    // Handle cases like "Mark 16 Luke 1" - replace space between book references with semicolon
    // This regex looks for: digit + space + capital letter + lowercase letter(s) (indicating a new book name)
    // This prevents breaking "1 Samuel 2" while still catching "Mark 16 Luke 1"
    normalizedPassage = normalizedPassage.replace(/(\d+)\s+([A-Z][a-z]+)/g, (match, digit, bookStart) => {
      // Don't split if this looks like a numbered book (1 Samuel, 2 Kings, etc.)
      if (normalizedPassage.includes(digit + ' ' + bookStart) && 
          (bookStart === 'Samuel' || bookStart === 'Kings' || bookStart === 'Chronicles' || 
           bookStart === 'Corinthians' || bookStart === 'Thessalonians' || bookStart === 'Timothy' || 
           bookStart === 'Peter' || bookStart === 'John')) {
        return match; // Keep as is
      }
      return digit + '; ' + bookStart;
    });
    
    // Split by semicolon first, then by comma if no semicolon
    const sections = normalizedPassage.includes(';') 
      ? normalizedPassage.split(';').map(ch => ch.trim())
      : normalizedPassage.split(',').map(ch => ch.trim());
    
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
        <div className="arrow-container">
          <div className="download-arrow">
            <span className="arrow-text">Get the full plan!</span>
            <svg 
              className="arrow-svg" 
              viewBox="0 0 100 50" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M10 25 Q30 10, 70 25 Q75 28, 80 35" 
                stroke="#FFD700" 
                strokeWidth="3" 
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path 
                d="M72 32 L80 42 M88 32 L80 42" 
                stroke="#FFD700" 
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
        </div>
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
              {planStarted ? `${progressPercentage}% Complete` : `Preview Mode - ${progressPercentage}% Complete`}
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
                      title="Click to read on Bible Gateway"
                    >
                      {section.display}
                      <i className="fas fa-external-link-alt reading-link-icon"></i>
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
                      title="Click to read on Bible Gateway"
                    >
                      {section.display}
                      <i className="fas fa-external-link-alt reading-link-icon"></i>
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
                      title="Click to read on Bible Gateway"
                    >
                      {section.display}
                      <i className="fas fa-external-link-alt reading-link-icon"></i>
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
          {!planStarted 
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
