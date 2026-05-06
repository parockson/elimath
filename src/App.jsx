import React, { useState, useEffect } from 'react';
import './styles/App.scss';

// --- Reusable Modal Component ---
const ELIModal = ({ isOpen, title, message, onClose, type }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-card animate-pop ${type}`} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="close-x" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">{message}</div>
        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

// --- Test Form Component ---
const TestForm = ({ stageNumber, onComplete, isFinal, loading }) => {
  const [step, setStep] = useState(1);
  const [localData, setLocalData] = useState({});

  const letters = {
    part1: stageNumber === 1 ? ['a', 'b', 'c', 'd'] : ['i', 'j', 'k', 'l'],
    part2: stageNumber === 1 ? ['e', 'f', 'g', 'h'] : ['m', 'n', 'o', 'p']
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step < 3) { setStep(step + 1); window.scrollTo(0, 0); }
    else { onComplete(localData); }
  };

  const update = (key, val) => setLocalData(prev => ({ ...prev, [key]: val }));

  return (
    <div className="card shadow-md">
      <div className="part-label">Stage {stageNumber === 1 ? 'ONE' : 'THREE'}</div>
      <form onSubmit={handleNext}>
        {step === 1 && (
          <section className="animate-fade-in">
            <h3 className="part-title">Part 1: Rectangle → Square</h3>
            <p className="instruction">Focus on transforming a rectangle into a square.</p>
            <div className="theme-block">
              <h4>1. Identify focusing part(s):</h4>
              {letters.part1.map(l => (
                <div key={l} className="input-row"><label>{l}. Name:</label><input type="text" required onChange={e => update(`p1_n_${l}`, e.target.value)} /></div>
              ))}
            </div>
            <div className="theme-block">
              <h4>2. Explain exact changes:</h4>
              {letters.part1.map(l => (
                <div key={l} className="input-row"><label>{l}. Change:</label><input type="text" required onChange={e => update(`p1_c_${l}`, e.target.value)} /></div>
              ))}
            </div>
            <button type="submit" className="btn-primary">Next: Part 2</button>
          </section>
        )}
        {step === 2 && (
          <section className="animate-fade-in">
            <h3 className="part-title">Part 2: Square → Circle</h3>
            <p className="instruction">Focus on transforming a square into a circle.</p>
            <div className="theme-block">
              <h4>5. Identify focusing part(s):</h4>
              {letters.part2.map(l => (
                <div key={l} className="input-row"><label>{l}. Name:</label><input type="text" required onChange={e => update(`p2_n_${l}`, e.target.value)} /></div>
              ))}
            </div>
            <div className="theme-block">
              <h4>6. Explain exact changes:</h4>
              {letters.part2.map(l => (
                <div key={l} className="input-row"><label>{l}. Change:</label><input type="text" required onChange={e => update(`p2_c_${l}`, e.target.value)} /></div>
              ))}
            </div>
            <button type="submit" className="btn-primary">Next: Part 3</button>
          </section>
        )}
        {step === 3 && (
          <section className="animate-fade-in">
            <h3 className="part-title">Part 3: Final Narrative</h3>
            <div className="theme-block">
              <h4>9. Integrated Narrative</h4>
              <p className="instruction">Detail the transformations and AI concepts that emerged.</p>
              <textarea required rows="10" onChange={e => update('narrative', e.target.value)} />
            </div>
            {isFinal && <div className="final-notice">Submit to: <strong>Mathematicselithermos@gmail.com</strong></div>}
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Sending...' : 'Finish Stage'}</button>
          </section>
        )}
      </form>
    </div>
  );
};

export default function App() {
  const [stage, setStage] = useState(0);
  const [fullName, setFullName] = useState('');
  const [preTestData, setPreTestData] = useState({});
  const [eliTimer, setEliTimer] = useState(0);
  const [modals, setModals] = useState({ id: false, lock: false, info: false, ded: false });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let interval;
    if (stage === 2 && eliTimer < 180) interval = setInterval(() => setEliTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [stage, eliTimer]);

  const toggleModal = (key, val) => setModals(prev => ({ ...prev, [key]: val }));

  const handleStart = (e) => {
    e.preventDefault();
    if (fullName.trim()) setStage(1);
    else toggleModal('id', true);
  };

  const handleFinalSubmit = async (postData) => {
    setLoading(true);
    try {
      await fetch("https://formspree.io/f/YOUR_ID", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: fullName, pre: preTestData, post: postData, timeSpent: eliTimer }),
      });
      setStage(4);
    } catch { alert("Error."); } finally { setLoading(false); }
  };

  return (
    <div className="app-shell">
      <ELIModal isOpen={modals.id} title="Identification Required" message={<p>Please enter your Full Name to proceed.</p>} onClose={() => toggleModal('id', false)} type="profile" />
      <ELIModal isOpen={modals.lock} title="Access Locked" message={<p>You are now moving to Stage 3. You cannot return.</p>} onClose={() => toggleModal('lock', false)} type="warning" />
      
      <ELIModal isOpen={modals.info} title="Information Section" onClose={() => toggleModal('info', false)} type="info" message={
        <div className="rich-text">
          <p>Every day, our bodies quietly respond to the temperature around us. This response is shaped by the relationship between our internal body temperature and the temperature of the external environment...</p>
          <p><strong>ELI</strong> is a biomimicry-based interactive learning environment designed to help you explore these questions. Through eight engaging lessons, you will build an understanding of how nature’s solutions can inspire scientific thinking.</p>
        </div>
      } />
      
      <ELIModal isOpen={modals.ded} title="Science Education Interface Dedication" onClose={() => toggleModal('ded', false)} type="dedication" message={
        <div className="rich-text scrollable">
          <p>We dedicate this environment to the scholarship of <strong>Dr. Eli Tucker-Raymond</strong> of Boston University.</p>
          <p>His mentorship has been a lifelong light, helping scholars from non-dominant groups establish recognition for their ways of knowing in science education.</p>
          <p>In honor of his enduring influence, this platform proudly bears the name <strong>“ELI.”</strong></p>
        </div>
      } />

      <nav className="taskbar">
        <div className="taskbar-content">
          <div className="brand" onClick={() => stage === 0 && setStage(0)}><div className="logo-sq" /> ELIMATH</div>
          <div className="nav-links">
            <button className="text-link" onClick={() => toggleModal('info', true)}>Information</button>
            <button className="text-link" onClick={() => toggleModal('ded', true)}>Dedication</button>
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
          <div className="home-hero animate-fade-in">
            <div className="hero-content">
              <div className="hero-badge">Welcome to ELI</div>
              <h1 className="hero-title">Automated Theorem Prover <br/><span className="gradient-text">Learning Environment</span></h1>
              <p className="hero-subtitle">Engage with ELI through a structured three-part process designed to build your understanding of mathematical proofs and scientific thinking.</p>
              
              <div className="process-steps">
                <div className="process-step">
                  <div className="step-icon">1</div>
                  <div className="step-text">Pre-Test</div>
                </div>
                <div className="process-divider"></div>
                <div className="process-step">
                  <div className="step-icon">2</div>
                  <div className="step-text">ELI Interaction</div>
                </div>
                <div className="process-divider"></div>
                <div className="process-step">
                  <div className="step-icon">3</div>
                  <div className="step-text">Post-Test</div>
                </div>
              </div>

              <div className="hero-notice">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span>Access to subsequent stages is only granted upon completion of the prior stage.</span>
              </div>

              <form className="hero-form" onSubmit={handleStart}>
                <div className="input-group-modern">
                  <input 
                    type="text" 
                    placeholder="Enter your full name to begin..." 
                    onChange={e => setFullName(e.target.value)} 
                    required
                  />
                  <button type="submit" className="btn-primary-glow">Begin Journey</button>
                </div>
              </form>
            </div>
          </div>
        )}
        {stage === 1 && <TestForm stageNumber={1} onComplete={(d) => { setPreTestData(d); setStage(2); }} />}
        {stage === 2 && (
          <div className="card animate-fade-in text-center">
            <h2>ELI Engagement</h2>
            <div className="timer-ui">{Math.floor(eliTimer/60)}:{(eliTimer%60).toString().padStart(2,'0')}</div>
            <div className="canvas-box">Interactive ELI Interface</div>
            <button className="btn-primary" disabled={eliTimer < 180} onClick={() => { toggleModal('lock', true); setStage(3); }}>
              {eliTimer < 180 ? `Wait to Unlock (${180 - eliTimer}s)` : 'Unlock Stage 3'}
            </button>
          </div>
        )}
        {stage === 3 && <TestForm stageNumber={3} onComplete={handleFinalSubmit} isFinal={true} loading={loading} />}
        {stage === 4 && <div className="card text-center"><h2 className="gradient-text">Submission Successful</h2><p>Thank you, {fullName}. Your data has been recorded.</p></div>}
      </div>
    </div>
  );
}