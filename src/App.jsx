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

  const isPre = stageNumber === 1;

  // Question numbering based on stage
  const qNum = {
    p1_parts: isPre ? 1 : 10,
    p1_changes: isPre ? 2 : 11,
    p1_ai: isPre ? 3 : 12,
    p1_narrative: isPre ? 4 : 13,
    p2_parts: isPre ? 5 : 14,
    p2_changes: isPre ? 6 : 15,
    p2_ai: isPre ? 7 : 16,
    p2_narrative: isPre ? 8 : 17,
    p3_final: isPre ? 9 : 18
  };

  const letters = {
    part1: isPre ? ['a', 'b', 'c', 'd'] : ['i', 'j', 'k', 'l'],
    p1_ai: isPre ? ['a', 'b'] : ['e', 'f'],
    part2: isPre ? ['e', 'f', 'g', 'h'] : ['m', 'n', 'o', 'p'],
    p2_ai: isPre ? ['c', 'd'] : ['g', 'h']
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step < 3) { setStep(step + 1); window.scrollTo(0, 0); }
    else { onComplete(localData); }
  };

  const update = (key, val) => setLocalData(prev => ({ ...prev, [key]: val }));

  return (
    <div className="card shadow-md">
      <div className="part-label" style={{fontWeight: 800, color: '#64748b', fontSize: '0.9rem', marginBottom: '10px'}}>
        STAGE {isPre ? 'ONE: Pre-Test' : 'THREE: Post-Test'}
      </div>
      <h2 style={{marginTop: 0, marginBottom: '25px', color: '#221b4c', fontSize: '1.4rem'}}>
        Question A: Describe how you would transform a rectangle into a square and then into a circle.
      </h2>
      <form onSubmit={handleNext}>
        {step === 1 && (
          <section className="animate-fade-in">
            <h3 className="part-title" style={{color: '#3d3282', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px'}}>Part 1: Rectangle → Square</h3>
            <p className="instruction" style={{color: '#334155', marginBottom: '25px'}}>The first part of your response should focus on transforming a rectangle into a square. Write your response under each of these themes:</p>
            
            <div className="theme-block" style={{marginBottom: '30px'}}>
              <h4 style={{color: '#221b4c', marginBottom: '15px'}}>{qNum.p1_parts}. Identify which part(s) of the rectangle you will focus on.</h4>
              {letters.part1.map(l => (
                <div key={l} className="input-row" style={{marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '5px'}}>
                  <label style={{fontWeight: 600, fontSize: '0.9rem'}}>{l}. Name of the Part (e.g., vertex, side, or angle):</label>
                  <input type="text" required onChange={e => update(`p1_part_${l}`, e.target.value)} style={{padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1'}} />
                </div>
              ))}
            </div>

            <div className="theme-block" style={{marginBottom: '30px'}}>
              <h4 style={{color: '#221b4c', marginBottom: '15px'}}>{qNum.p1_changes}. Explain the exact change you would make to each part so that the rectangle becomes a square.</h4>
              {letters.part1.map(l => (
                <div key={l} className="input-row" style={{marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '5px'}}>
                  <label style={{fontWeight: 600, fontSize: '0.9rem'}}>{l}. Description of the change:</label>
                  <input type="text" required onChange={e => update(`p1_change_${l}`, e.target.value)} style={{padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1'}} />
                </div>
              ))}
            </div>

            <div className="theme-block" style={{marginBottom: '30px'}}>
              <h4 style={{color: '#221b4c', marginBottom: '15px'}}>{qNum.p1_ai}. Identify moments in your process where reasoning similar to an AI concept appears.</h4>
              {letters.p1_ai.map(l => (
                <div key={l} className="input-row" style={{marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '5px'}}>
                  <label style={{fontWeight: 600, fontSize: '0.9rem'}}>{l}. Part, change made, and AI concept:</label>
                  <input type="text" required onChange={e => update(`p1_ai_${l}`, e.target.value)} style={{padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1'}} />
                </div>
              ))}
            </div>

            <div className="theme-block" style={{marginBottom: '30px'}}>
              <h4 style={{color: '#221b4c', marginBottom: '15px'}}>{qNum.p1_narrative}. Combine your responses above into a short narrative explaining how you transformed the rectangle into a square and the AI-related reasoning that emerged during the process.</h4>
              <textarea required rows="4" onChange={e => update('p1_narrative', e.target.value)} style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box'}} />
            </div>

            <button type="submit" className="btn-primary">Next: Part 2</button>
          </section>
        )}

        {step === 2 && (
          <section className="animate-fade-in">
            <h3 className="part-title" style={{color: '#3d3282', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px'}}>Part 2: Square → Circle</h3>
            <p className="instruction" style={{color: '#334155', marginBottom: '25px'}}>The second part of your response should focus on transforming a square into a circle. Write your response under each of these themes:</p>
            
            <div className="theme-block" style={{marginBottom: '30px'}}>
              <h4 style={{color: '#221b4c', marginBottom: '15px'}}>{qNum.p2_parts}. Identify which part(s) of the square you will focus on.</h4>
              {letters.part2.map(l => (
                <div key={l} className="input-row" style={{marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '5px'}}>
                  <label style={{fontWeight: 600, fontSize: '0.9rem'}}>{l}. Name of the Part (e.g., vertex, side, or angle):</label>
                  <input type="text" required onChange={e => update(`p2_part_${l}`, e.target.value)} style={{padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1'}} />
                </div>
              ))}
            </div>

            <div className="theme-block" style={{marginBottom: '30px'}}>
              <h4 style={{color: '#221b4c', marginBottom: '15px'}}>{qNum.p2_changes}. Explain the exact change you would make to each part so that the square becomes a circle.</h4>
              {letters.part2.map(l => (
                <div key={l} className="input-row" style={{marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '5px'}}>
                  <label style={{fontWeight: 600, fontSize: '0.9rem'}}>{l}. Description of the change:</label>
                  <input type="text" required onChange={e => update(`p2_change_${l}`, e.target.value)} style={{padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1'}} />
                </div>
              ))}
            </div>

            <div className="theme-block" style={{marginBottom: '30px'}}>
              <h4 style={{color: '#221b4c', marginBottom: '15px'}}>{qNum.p2_ai}. Identify moments in your process where reasoning similar to an AI concept appears.</h4>
              {letters.p2_ai.map(l => (
                <div key={l} className="input-row" style={{marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '5px'}}>
                  <label style={{fontWeight: 600, fontSize: '0.9rem'}}>{l}. Part, change made, and AI concept:</label>
                  <input type="text" required onChange={e => update(`p2_ai_${l}`, e.target.value)} style={{padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1'}} />
                </div>
              ))}
            </div>

            <div className="theme-block" style={{marginBottom: '30px'}}>
              <h4 style={{color: '#221b4c', marginBottom: '15px'}}>{qNum.p2_narrative}. Combine your responses above into a short narrative explaining how you transformed the square into a circle and the AI-related reasoning that emerged during the process.</h4>
              <textarea required rows="4" onChange={e => update('p2_narrative', e.target.value)} style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box'}} />
            </div>

            <button type="submit" className="btn-primary">Next: Part 3</button>
          </section>
        )}

        {step === 3 && (
          <section className="animate-fade-in">
            <h3 className="part-title" style={{color: '#3d3282', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px'}}>Part 3: Rectangle → Square → Circle</h3>
            <div className="theme-block" style={{marginBottom: '30px'}}>
              <h4 style={{color: '#221b4c', marginBottom: '15px', lineHeight: '1.5'}}>{qNum.p3_final}. Bring your responses in {qNum.p1_narrative} and {qNum.p2_narrative} together to write a narrative which details how you transformed a rectangle into a square and then into a circle and the AI concepts that emerged at instances of each transformation.</h4>
              <textarea required rows="8" onChange={e => update('final_narrative', e.target.value)} style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box'}} />
            </div>
            
            {isFinal && (
              <div className="final-notice" style={{marginBottom: '20px', padding: '15px', backgroundColor: '#fef3c7', color: '#92400e', borderRadius: '8px', border: '1px solid #fcd34d', textAlign: 'center'}}>
                Submit to: <strong>Mathematicselithermos@gmail.com</strong>
              </div>
            )}
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