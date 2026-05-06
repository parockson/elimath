import React, { useState, useEffect } from 'react';
import './styles/App.scss';

// --- Custom Modal Component ---
const ELIModal = ({ isOpen, title, message, onClose, type }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className={`modal-card animate-pop ${type}`}>
        <div className="modal-icon">{type === 'warning' ? '⚠️' : '👤'}</div>
        <h3>{title}</h3>
        <p>{message}</p>
        <button className="btn-primary" onClick={onClose}>Continue</button>
      </div>
    </div>
  );
};

// --- Multi-Part Test Form ---
const TestForm = ({ stageNumber, onComplete, isFinal, loading }) => {
  const [step, setStep] = useState(1);
  const [localData, setLocalData] = useState({});

  const letters = {
    part1: stageNumber === 1 ? ['a', 'b', 'c', 'd'] : ['i', 'j', 'k', 'l'],
    part2: stageNumber === 1 ? ['e', 'f', 'g', 'h'] : ['m', 'n', 'o', 'p']
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    } else {
      onComplete(localData);
    }
  };

  const update = (key, val) => setLocalData(prev => ({ ...prev, [key]: val }));

  return (
    <div className="card shadow-md">
      <div className="part-label">Stage {stageNumber === 1 ? 'ONE' : 'THREE'}: {stageNumber === 1 ? 'Pre-Test' : 'Post-Test'}</div>
      <form onSubmit={handleNext}>
        
        {step === 1 && (
          <section className="animate-fade-in">
            <h3 className="part-title">Part 1: Rectangle → Square</h3>
            <p className="instruction">The first part of your response should focus on transforming a rectangle into a square.</p>
            <div className="theme-block">
              <h4>1. Identify which part(s) of the rectangle you will focus on.</h4>
              {letters.part1.map(l => (
                <div key={l} className="input-row">
                  <label>{l}. Name of the Part:</label>
                  <input type="text" required placeholder="…….." onChange={e => update(`p1_name_${l}`, e.target.value)} />
                </div>
              ))}
            </div>
            <div className="theme-block">
              <h4>2. Explain the exact change you would make to each part so that the rectangle becomes a square.</h4>
              {letters.part1.map(l => (
                <div key={l} className="input-row">
                  <label>{l}. Description of change:</label>
                  <input type="text" required placeholder="…….." onChange={e => update(`p1_desc_${l}`, e.target.value)} />
                </div>
              ))}
            </div>
            <button type="submit" className="btn-primary">Next: Part 2</button>
          </section>
        )}

        {step === 2 && (
          <section className="animate-fade-in">
            <h3 className="part-title">Part 2: Square → Circle</h3>
            <p className="instruction">The second part of your response should focus on transforming a square into a circle.</p>
            <div className="theme-block">
              <h4>5. Identify which part(s) of the square you will focus on.</h4>
              {letters.part2.map(l => (
                <div key={l} className="input-row">
                  <label>{l}. Name of the Part:</label>
                  <input type="text" required placeholder="…….." onChange={e => update(`p2_name_${l}`, e.target.value)} />
                </div>
              ))}
            </div>
            <div className="theme-block">
              <h4>6. Explain the exact change you would make to each part so that the square becomes a circle.</h4>
              {letters.part2.map(l => (
                <div key={l} className="input-row">
                  <label>{l}. Description of change:</label>
                  <input type="text" required placeholder="…….." onChange={e => update(`p2_desc_${l}`, e.target.value)} />
                </div>
              ))}
            </div>
            <button type="submit" className="btn-primary">Next: Part 3</button>
          </section>
        )}

        {step === 3 && (
          <section className="animate-fade-in">
            <h3 className="part-title">Part 3: Rectangle → Square → Circle</h3>
            <div className="theme-block">
              <h4>9. Integrated Narrative</h4>
              <p className="instruction">Bring your responses together to write a narrative which details how you transformed a rectangle into a square and then into a circle and the AI concepts that emerged.</p>
              <textarea required rows="10" placeholder="…………………………………………………………………………….." onChange={e => update('narrative', e.target.value)} />
            </div>
            {isFinal && (
              <div className="final-notice">
                Print and submit your response to: <strong>Mathematicselithermos@gmail.com</strong>
              </div>
            )}
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Sending Data...' : isFinal ? 'Submit Final Responses' : 'Finish Stage'}
            </button>
          </section>
        )}
      </form>
    </div>
  );
};

export default function App() {
  const [stage, setStage] = useState(0);
  const [userData, setUserData] = useState({ name: '', username: '' });
  const [preTestData, setPreTestData] = useState({});
  const [eliTimer, setEliTimer] = useState(0);
  
  const [isIdModalOpen, setIsIdModalOpen] = useState(false);
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let interval;
    if (stage === 2 && eliTimer < 180) {
      interval = setInterval(() => setEliTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [stage, eliTimer]);

  const handleStart = (e) => {
    e.preventDefault();
    if (userData.name.trim() || userData.username.trim()) setStage(1);
    else setIsIdModalOpen(true);
  };

  const handleFinalSubmit = async (postData) => {
    setIsSubmitting(true);
    const payload = {
      user: userData,
      preTest: preTestData,
      postTest: postData,
      engagementSeconds: eliTimer
    };

    try {
      await fetch("https://formspree.io/f/YOUR_ID", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setStage(4);
    } catch {
      alert("Submission error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-shell">
      <ELIModal 
        isOpen={isIdModalOpen} 
        title="Identification Required" 
        message="Please enter a Name or User ID to proceed." 
        onClose={() => setIsIdModalOpen(false)} 
        type="profile" 
      />
      
      <ELIModal 
        isOpen={isLockModalOpen} 
        title="Access Locked" 
        message="You are now moving to Stage 3. You cannot return to previous stages." 
        onClose={() => setIsLockModalOpen(false)} 
        type="warning" 
      />

      <nav className="taskbar">
        <div className="taskbar-content">
          <div className="brand" onClick={() => stage === 0 && setStage(0)}>
            <div className="logo-sq" /> ELIMATH
          </div>
          <div className="nav-steps">
            <span className={`step ${stage === 1 ? 'active' : ''}`}>PRE-TEST</span>
            <span className={`step ${stage === 2 ? 'active' : ''}`}>ELI</span>
            <span className={`step ${stage === 3 ? 'active' : ''}`}>POST-TEST</span>
          </div>
        </div>
      </nav>

      <div className="container">
        {stage === 0 && (
          <div className="card animate-fade-in">
            <h2 className="gradient-text">Welcome</h2>
            <div className="home-instruction-block">
              <p>In this learning environment, you will engage with the Automated Theorem Prover called <strong>ELI</strong>. Your engagement with ELI is structured in three parts:</p>
              <ol className="engagement-list">
                <li>Pre-Test</li>
                <li>Engagement with ELI</li>
                <li>Post-Test</li>
              </ol>
              <p>You may begin with the Pre-Test. <span className="note-text">Note that access to the next stage will only be granted after completing the previous stage.</span></p>
            </div>
            <hr className="divider" />
            <form onSubmit={handleStart}>
              <div className="input-group">
                <label>1. Name</label>
                <input type="text" placeholder="Full name..." onChange={e => setUserData({...userData, name: e.target.value})} />
              </div>
              <div className="input-group">
                <label>2. User</label>
                <input type="text" placeholder="Username or ID..." onChange={e => setUserData({...userData, username: e.target.value})} />
              </div>
              <button type="submit" className="btn-primary">Begin Pre-Test</button>
            </form>
          </div>
        )}

        {stage === 1 && (
          <TestForm 
            stageNumber={1} 
            onComplete={(data) => { setPreTestData(data); setStage(2); }} 
          />
        )}

        {stage === 2 && (
          <div className="card animate-fade-in text-center">
            <h2>ELI Engagement</h2>
            <div className="timer-ui">
              {Math.floor(eliTimer/60)}:{(eliTimer%60).toString().padStart(2,'0')}
            </div>
            <div className="canvas-box">ELI Platform Engagement Area</div>
            <button 
              className="btn-primary" 
              disabled={eliTimer < 180} 
              onClick={() => { setIsLockModalOpen(true); setStage(3); }}
            >
              {eliTimer < 180 ? `Wait ${180 - eliTimer}s to Unlock` : 'Unlock Stage 3'}
            </button>
          </div>
        )}

        {stage === 3 && (
          <TestForm 
            stageNumber={3} 
            onComplete={handleFinalSubmit} 
            isFinal={true} 
            loading={isSubmitting} 
          />
        )}

        {stage === 4 && <div className="card text-center"><h2 className="gradient-text">Submitted</h2><p>Data successfully sent to ELI Database.</p></div>}
      </div>
    </div>
  );
}