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
  
  useEffect(() => {
    const today = new Date();
    setWeekIndex(getCurrentWeekIndex(planData, today));
  }, []);

  const week = planData[weekIndex];
  const progressPercentage = Math.round(((weekIndex + 1) / planData.length) * 100);

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
            <a 
              href={passageLink(week.nt)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="reading-link"
            >
              {week.nt}
            </a>
          </div>
          
          <div className="reading-item">
            <span className="reading-label">
              OT Connection
            </span>
            <a 
              href={passageLink(week.otConnection)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="reading-link"
            >
              {week.otConnection}
            </a>
          </div>
          
          <div className="reading-item">
            <span className="reading-label">
              OT Reading
            </span>
            <a 
              href={passageLink(week.ot)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="reading-link"
            >
              {week.ot}
            </a>
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
          <h3 className="discipline-title">Bible Reading as a Spiritual Discipline</h3>
          <p className="discipline-text">
            Bible reading is far more than an intellectual exercise—it is a sacred spiritual discipline 
            that connects us with the living God. Through Scripture, the Holy Spirit speaks to our hearts, 
            transforms our minds, and shapes our character to reflect Christ's image.
          </p>
          <p className="discipline-text">
            <strong>Begin with Prayer:</strong> Always approach Scripture with a humble heart, asking the 
            Holy Spirit to illuminate God's truth and reveal what He wants you to understand. Prayer prepares 
            your heart to receive God's word and helps you listen with spiritual ears.
          </p>
          <p className="discipline-text">
            <strong>Read Meditatively:</strong> Don't rush through the text. Read slowly, allowing God's 
            word to penetrate your heart. Consider reading the same passage multiple times, asking: "What 
            is God saying to me through this text? How does this reveal God's character? What response does 
            God desire from me?"
          </p>
          <p className="discipline-text">
            <strong>Journal and Reflect:</strong> Write down insights, questions, and applications. Record 
            how God is speaking to you through His word. This practice helps you remember what you've learned 
            and track your spiritual growth over time.
          </p>
          <p className="discipline-text">
            <strong>Apply What You Learn:</strong> Scripture reading without application is incomplete. Ask 
            God to show you specific ways to live out what you've read. True spiritual growth happens when 
            we align our lives with God's word and allow it to transform our thoughts, words, and actions.
          </p>
          <p className="discipline-text">
            <strong>Stay Consistent:</strong> Like any relationship, consistency deepens intimacy. Even if 
            you can only read a few verses each day, maintain regular communion with God through His word. 
            Remember that God desires to speak to you personally through Scripture—He has something special 
            for you each day.
          </p>
          <p className="discipline-text">
            Building this discipline takes time and patience with yourself. Start where you are, be consistent, 
            and trust the Holy Spirit to guide you. Over time, Bible reading will become not just a habit, 
            but a cherished time of intimate fellowship with your heavenly Father.
          </p>
        </div>
      </footer>
    </div>
  );
}
