import React, { useState, useEffect } from 'react';
import './styles/App.scss';
import ELIInterface from './components/Stages/ELIInterface';

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

// --- Shape Visualizer ---
const ShapeVisuals = ({ type, scale = 1 }) => {
  const arrow = <span style={{fontSize: (1.5 * scale) + 'rem', color: '#94a3b8', margin: '0 ' + (15 * scale) + 'px'}}>➔</span>;
  const Rect = () => <div style={{width: (60 * scale) + 'px', height: (40 * scale) + 'px', border: (3 * scale) + 'px solid #dc2626', borderRadius: (4 * scale) + 'px', background: '#fee2e2'}}></div>;
  const Square = () => <div style={{width: (50 * scale) + 'px', height: (50 * scale) + 'px', background: '#dc2626', borderRadius: (4 * scale) + 'px'}}></div>;
  const Circle = () => <div style={{width: (55 * scale) + 'px', height: (55 * scale) + 'px', border: (4 * scale) + 'px solid #eab308', borderRadius: '50%', background: '#fef08a'}}></div>;
  
  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '25px'}}>
      {type === 1 && <><Rect/>{arrow}<Square/></>}
      {type === 2 && <><Square/>{arrow}<Circle/></>}
      {type === 3 && <><Rect/>{arrow}<Square/>{arrow}<Circle/></>}
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
      <div className="part-label">
        STAGE {isPre ? 'ONE: Pre-Test' : 'THREE: Post-Test'}
      </div>
      <h2>
        Question A: Describe how you would transform a rectangle into a square and then into a circle.
      </h2>
      <form onSubmit={handleNext}>
        {step === 1 && (
          <section className="animate-fade-in">
            <h3 className="part-title">Part 1: Rectangle → Square</h3>
            <p className="instruction">The first part of your response should focus on transforming a rectangle into a square. Write your response under each of these themes:</p>
            <ShapeVisuals type={1} />
            
            <div className="theme-block">
              <h4>{qNum.p1_parts}. Identify which part(s) of the rectangle you will focus on.</h4>
              {letters.part1.map(l => (
                <div key={l} className="input-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '5px', marginBottom: '15px' }}>
                  <label>{l}. Name of the Part (e.g., vertex, side, or angle):</label>
                  <input type="text" required onChange={e => update(`p1_part_${l}`, e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }} />
                </div>
              ))}
            </div>

            <div className="theme-block">
              <h4>{qNum.p1_changes}. Explain the exact change you would make to each part so that the rectangle becomes a square.</h4>
              {letters.part1.map(l => (
                <div key={l} className="input-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '5px', marginBottom: '15px' }}>
                  <label>{l}. Description of the change:</label>
                  <textarea required rows="2" onChange={e => update(`p1_change_${l}`, e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit', resize: 'vertical' }} />
                </div>
              ))}
            </div>

            <div className="theme-block">
              <h4>{qNum.p1_ai}. Identify moments in your process where reasoning similar to an AI concept appears.</h4>
              {letters.p1_ai.map(l => (
                <div key={l} className="input-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '5px', marginBottom: '15px' }}>
                  <label>{l}. Part, change made, and AI concept:</label>
                  <textarea required rows="2" onChange={e => update(`p1_ai_${l}`, e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit', resize: 'vertical' }} />
                </div>
              ))}
            </div>

            <div className="theme-block">
              <h4>{qNum.p1_narrative}. Combine your responses above into a short narrative explaining how you transformed the rectangle into a square and the AI-related reasoning that emerged during the process.</h4>
              <textarea required rows="4" onChange={e => update('p1_narrative', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit', resize: 'vertical' }} />
            </div>

            <button type="submit" className="btn-primary">Next: Part 2</button>
          </section>
        )}

        {step === 2 && (
          <section className="animate-fade-in">
            <h3 className="part-title">Part 2: Square → Circle</h3>
            <p className="instruction">The second part of your response should focus on transforming a square into a circle. Write your response under each of these themes:</p>
            <ShapeVisuals type={2} />
            
            <div className="theme-block">
              <h4>{qNum.p2_parts}. Identify which part(s) of the square you will focus on.</h4>
              {letters.part2.map(l => (
                <div key={l} className="input-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '5px', marginBottom: '15px' }}>
                  <label>{l}. Name of the Part (e.g., vertex, side, or angle):</label>
                  <input type="text" required onChange={e => update(`p2_part_${l}`, e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }} />
                </div>
              ))}
            </div>

            <div className="theme-block">
              <h4>{qNum.p2_changes}. Explain the exact change you would make to each part so that the square becomes a circle.</h4>
              {letters.part2.map(l => (
                <div key={l} className="input-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '5px', marginBottom: '15px' }}>
                  <label>{l}. Description of the change:</label>
                  <textarea required rows="2" onChange={e => update(`p2_change_${l}`, e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit', resize: 'vertical' }} />
                </div>
              ))}
            </div>

            <div className="theme-block">
              <h4>{qNum.p2_ai}. Identify moments in your process where reasoning similar to an AI concept appears.</h4>
              {letters.p2_ai.map(l => (
                <div key={l} className="input-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '5px', marginBottom: '15px' }}>
                  <label>{l}. Part, change made, and AI concept:</label>
                  <textarea required rows="2" onChange={e => update(`p2_ai_${l}`, e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit', resize: 'vertical' }} />
                </div>
              ))}
            </div>

            <div className="theme-block">
              <h4>{qNum.p2_narrative}. Combine your responses above into a short narrative explaining how you transformed the square into a circle and the AI-related reasoning that emerged during the process.</h4>
              <textarea required rows="4" onChange={e => update('p2_narrative', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit', resize: 'vertical' }} />
            </div>

            <button type="submit" className="btn-primary">Next: Part 3</button>
          </section>
        )}

        {step === 3 && (
          <section className="animate-fade-in">
            <h3 className="part-title">Part 3: Rectangle → Square → Circle</h3>
            <ShapeVisuals type={3} />
            <div className="theme-block">
              <h4>{qNum.p3_final}. Bring your responses in {qNum.p1_narrative} and {qNum.p2_narrative} together to write a narrative which details how you transformed a rectangle into a square and then into a circle and the AI concepts that emerged at instances of each transformation.</h4>
              <textarea required rows="8" onChange={e => update('final_narrative', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit', resize: 'vertical' }} />
            </div>
            
            {isFinal && (
              <div className="final-notice">
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
  const [modals, setModals] = useState({ id: false, lock: false, ded: false });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let interval;
    if (stage === 2 && eliTimer < 60) interval = setInterval(() => setEliTimer(t => t + 1), 1000);
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
      
      <ELIModal isOpen={modals.ded} title="Mathematics Education Interface Dedication" onClose={() => toggleModal('ded', false)} type="dedication" message={
        <div className="rich-text scrollable">
          <p>We dedicate this Mathematics Education agent-based learning environment to the scholarship of <strong>Dr. Eli Tucker-Raymond</strong> of Boston University.</p>
          <p>His mentorship has, methodologically, theoretically, empirically, and computationally, been a lifelong light that never dims within often onto-epistemologically endarkened academic spaces. These spaces have historically privileged and validated the ways of knowing of dominant groups as the primary context for mathematics education. Yet within these very spaces, often described as multicultural, scholars from non-dominant groups encounter deeply challenging paths as they work to establish recognition for their often taken-for-granted ways of knowing as rigorous, generative, and transformative approaches to learning mathematics.</p>
          <p>Through his guidance, we have been able to critically and courageously engage taken-for-granted assumptions in mathematics education and reimagine them through inclusive, justice-oriented, and culturally grounded approaches. His work has inspired us to understand mathematical reasoning not as detached symbolic manipulation but as deeply connected to spatial reasoning, cultural practice, and the natural world.</p>
          <p>This platform reflects that vision. It is grounded in African everyday practices, particularly weatherlore expressed through the altitudes at which birds fly and the corresponding states of the weather. In this system, bird movement across atmospheric layers is represented as structured configurations within a nine-dot rectangular array. As birds shift altitude in response to changing weather conditions, they are interpreted as restructuring their positions within this array, generating new geometric formations. These transformations allow learners to engage in proving how a rectangular arrangement of nine dots can be systematically restructured into a geometric square and subsequently into a circle.</p>
          <p>Through an automated theorem proving environment, learners are also invited to justify the mathematical and artificial intelligence concepts embedded within each step of structuring and restructuring. This includes reasoning about spatial transformation, constraint satisfaction, and formal proof construction as they relate to dynamic geometric change.</p>
          <p>In honor of his enduring influence, this platform proudly bears the name <strong>“ELI.”</strong></p>
        </div>
      } />

      <nav className="taskbar">
        <div className="taskbar-content">
          <div 
            className="brand" 
            onClick={() => stage === 0 && setStage(0)}
            onDoubleClick={() => {
              if (stage === 0) { setFullName("Test User"); setStage(1); }
              else if (stage === 1) { setPreTestData({ skipped: true }); setStage(2); }
              else if (stage === 2) { setStage(3); }
              else if (stage === 3) { 
                setLoading(true);
                setTimeout(() => { setLoading(false); setStage(4); }, 500);
              }
            }}
            title="Double-click to skip stage (Cheat)"
            style={{ userSelect: 'none' }}
          >
            <div className="logo-sq" /> ELIMATH
          </div>
          <div className="nav-links">
            <button className="text-link" onClick={() => toggleModal('ded', true)}>Dedication</button>
          </div>
          <div className="nav-steps">
            <span className={`step ${stage === 1 ? 'active' : ''}`}>PRE-TEST</span>
            <span className={`step ${stage === 2 ? 'active' : ''}`}>ELI</span>
            <span className={`step ${stage === 3 ? 'active' : ''}`}>POST-TEST</span>
          </div>
        </div>
      </nav>

      <div className={`container ${stage === 2 ? 'wide' : ''}`}>
        {stage === 0 && (
          <div className="home-hero animate-fade-in">
            <div className="hero-content">
              <div className="hero-badge">Welcome to ELI</div>
              <h1 className="hero-title">Automated Theorem Prover <br/><span className="gradient-text">Learning Environment</span></h1>
              <p className="hero-subtitle">Engage with ELI through a structured three-part process designed to build your understanding of mathematical proofs and scientific thinking.</p>
              
              <ShapeVisuals type={3} scale={1.8} />

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
          <ELIInterface timer={eliTimer} onComplete={() => { toggleModal('lock', true); setStage(3); }} />
        )}
        {stage === 3 && <TestForm stageNumber={3} onComplete={handleFinalSubmit} isFinal={true} loading={loading} />}
        {stage === 4 && <div className="card text-center"><h2 className="gradient-text">Submission Successful</h2><p>Thank you, {fullName}. Your data has been recorded.</p></div>}
      </div>
    </div>
  );
}