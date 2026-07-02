import React, { useState, useEffect } from 'react';
import Grid from './Grid';

/* ===============================
  MOVEMENT TYPE DETECTOR
=============================== */
const getMovementKind = (dx, dy) => {
  const adx = Math.abs(dx);
  const ady = Math.abs(dy);
  if (adx === 0 && ady !== 0) return { type: 'Vertical Movement',  concept: 'Manhattan Distance' };
  if (adx === ady && adx !== 0) return { type: 'Diagonal Movement', concept: 'Euclidean Distance' };
  return null; // horizontal or oblique — not recorded
};

/* ===============================
  AI CONCEPT CARD
=============================== */
const AIConceptCard = ({ concept }) => {
  const { movementType, distConcept, fromLabel, toLabel, fromPos, toPos, manhattan, euclidean } = concept;

  const fx = Math.round(fromPos.x);
  const fy = Math.round(fromPos.y);
  const tx = Math.round(toPos.x);
  const ty = Math.round(toPos.y);
  const dx = tx - fx;
  const dy = ty - fy;

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: '10px',
      padding: '16px',
      borderLeft: '4px solid #3b82f6',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Title */}
      <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', marginBottom: '2px' }}>
        {movementType}
      </div>

      {/* Subtitle */}
      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#475569', marginBottom: '10px' }}>
        {distConcept}
      </div>

      {/* Formula */}
      {distConcept === 'Manhattan Distance' ? (
        <>
          <div style={{ fontStyle: 'italic', color: '#dc2626', fontSize: '0.85rem', marginBottom: '6px' }}>
            d = |x₂ - x₁| + |y₂ - y₁|
          </div>
          <div style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.9rem', marginBottom: '10px', fontFamily: 'monospace' }}>
            |{tx}-{fx}| + |{ty}-{fy}| = {manhattan}
          </div>
        </>
      ) : (
        <>
          <div style={{ fontStyle: 'italic', color: '#dc2626', fontSize: '0.85rem', marginBottom: '6px' }}>
            d = √((x₂-x₁)² + (y₂-y₁)²)
          </div>
          <div style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.9rem', marginBottom: '10px', fontFamily: 'monospace' }}>
            √({dx}² + {dy}²) = {euclidean}
          </div>
        </>
      )}

      {/* Divider */}
      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b' }}>
        <span>From: <strong>{fromLabel}</strong> → To: <strong>{toLabel}</strong></span>
        <span style={{ fontFamily: 'monospace' }}>({fx},{fy}) → ({tx},{ty})</span>
      </div>
    </div>
  );
};

/* ===============================
  ELI INTERFACE
=============================== */
const PreambleView = ({ timer, setTimer, onProceed, isReturning }) => {
  const remaining = Math.max(0, 60 - timer);
  const isComplete = timer >= 60;

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="preamble-card animate-fade-in">
      <div className="preamble-header">
        <div className="preamble-badge">Stage Two</div>
        <h2>Exploring Geometric Transformations with ELI</h2>
      </div>

      <div className="preamble-body">
        <div className="preamble-column">
          <p className="intro-text">
            In Stage One, you transformed a rectangle into a square and then a square into a circle. As you worked, you explained the parts of each figure you focused on, the changes you made, and the Artificial Intelligence (AI) concepts you believed were involved.
          </p>
          <p className="intro-text">
            Your explanations represent your own mathematical reasoning. There are many valid ways to justify these transformations.
          </p>
          <p className="intro-text">
            In this stage, you will engage with ELI, an automated geometry prover. Rather than replacing your ideas, ELI provides one computational proof of the transformations, making explicit the mathematical reasoning and AI concepts that support each step. As you interact with ELI, compare its reasoning with your own and consider the similarities and differences between the two approaches.
          </p>

          <div className="cultural-card">
            <h4>Ghanaian Ways of Knowing</h4>
            <p>
              ELI is inspired by two Ghanaian ways of knowing. The first is <strong>Kwasiadfranka</strong>, a traditional pebble game in which nine pebbles arranged in a rectangular pattern are repositioned to create new geometric configurations. The second is <strong>Ghanaian weather lore</strong>, where birds gathering in circular formations before rainfall inspire ideas about circular geometry and spatial organisation.
            </p>
            <p>
              To reflect the structure of the pebble game, the figures are represented as a 3 × 3 array of points. You will observe how moving these points transforms one geometric figure into another while preserving particular mathematical properties.
            </p>
          </div>
        </div>

        <div className="preamble-column">
          <div className="proof-block">
            <h3>Proving the Rectangle-to-Square Transformation</h3>
            <p>
              ELI demonstrates one proof by moving the points on the longer sides horizontally inward until all four sides become equal. The proof is based on preserving equal horizontal and vertical displacement, resulting in a figure that satisfies the defining properties of a square.
            </p>
            <div className="ai-tag manhattan">
              <span>AI Concept:</span> Manhattan Distance
            </div>
            <p className="ai-concept-detail">
              Movement is measured along horizontal and vertical paths rather than by direct diagonal movement.
            </p>
          </div>

          <div className="proof-block">
            <h3>Proving the Square-to-Circle Transformation</h3>
            <p>
              ELI then demonstrates how the corner points move diagonally towards the centre until they are all the same straight-line distance from that centre. These equal distances become the radii that define the circle.
            </p>
            <div className="ai-tag euclidean">
              <span>AI Concept:</span> Euclidean Distance
            </div>
            <p className="ai-concept-detail">
              Measures the shortest straight-line distance between two points.
            </p>
          </div>

          <div className="reflection-card">
            <h4>Ask Yourself:</h4>
            <ul>
              <li>How does ELI's proof compare with my own explanation?</li>
              <li>Which mathematical properties does ELI preserve during each transformation?</li>
              <li>Why is Manhattan distance appropriate for the rectangle-to-square transformation?</li>
              <li>Why is Euclidean distance appropriate for the square-to-circle transformation?</li>
              <li>What do these AI concepts reveal about different ways of reasoning about geometric transformations?</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="preamble-footer-note">
        <p className="compare-prompt">
          As you engage with ELI, compare its computational proof with your own reasoning from Stage One.
        </p>
        <p className="correctness-notice">
          Remember that ELI presents one mathematically valid proof. Your own reasoning may differ while still being mathematically correct.
        </p>
      </div>

      <div className="preamble-action-bar">
        <div className="timer-wrapper" onDoubleClick={() => setTimer && setTimer(60)} title="Double-click to skip wait (Dev)">
          <div className="circular-chart-container">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="circle" strokeDasharray={`${Math.min(100, (timer / 60) * 100)}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div className="timer-text">{formatTime(remaining)}</div>
          </div>
          <div className="timer-label">
            {isComplete ? "Preamble read requirement met." : "Please read the preamble before starting Stage Two."}
          </div>
        </div>

        <button 
          className={`btn-proceed-stage ${isComplete ? 'active' : 'disabled'}`}
          disabled={!isComplete}
          onClick={onProceed}
        >
          {isReturning 
            ? "Return to ELI Proof" 
            : isComplete 
              ? "Begin Stage Two Proof" 
              : `Wait ${remaining}s to Begin`}
        </button>
      </div>
    </div>
  );
};

const ELIInterface = ({ timer, setTimer, onComplete }) => {
  const [mode, setMode] = useState('Manual');
  const [weather, setWeather] = useState('Warm');
  const [movedBirds, setMovedBirds] = useState(new Set());
  const [lastMove, setLastMove] = useState(null);
  const [seasonsSeeen, setSeasonsSeeen] = useState(new Set(['Warm']));
  const [sequenceComplete, setSequenceComplete] = useState(false);
  const [viewingPreamble, setViewingPreamble] = useState(timer < 60);
  const [hasEnteredProof, setHasEnteredProof] = useState(false);

  useEffect(() => {
    if (timer < 60) {
      setViewingPreamble(true);
    }
  }, [timer]);

  // Weather updates based on moved birds
  useEffect(() => {
    let newWeather;
    if (movedBirds.size >= 6) newWeather = 'Cold';
    else if (movedBirds.size >= 3) newWeather = 'Hot';
    else newWeather = 'Warm';
    setWeather(newWeather);
    setSeasonsSeeen(prev => new Set([...prev, newWeather]));
  }, [movedBirds]);

  // Unlock: either auto sequence completes OR all 3 seasons seen manually
  const allSeasonsUnlocked = sequenceComplete || seasonsSeeen.size >= 3;

  const handleBirdMove = (data) => {
    const dx = data.toPos.x - data.fromPos.x;
    const dy = data.toPos.y - data.fromPos.y;
    const kind = getMovementKind(dx, dy);

    setMovedBirds(prev => {
      const newSet = new Set(prev);
      newSet.add(data.bird);
      return newSet;
    });

    if (kind) {
      setLastMove({
        movementType: kind.type,
        distConcept: kind.concept,
        fromLabel: data.fromLabel || data.bird,
        toLabel: data.toLabel,
        fromPos: data.fromPos,
        toPos: data.toPos,
        euclidean: Math.hypot(dx, dy).toFixed(2),
        manhattan: (Math.abs(dx) + Math.abs(dy)).toFixed(2),
      });
    }
  };

  const handleProceed = () => {
    setViewingPreamble(false);
    setHasEnteredProof(true);
  };

  if (viewingPreamble) {
    return (
      <PreambleView 
        timer={timer} 
        setTimer={setTimer} 
        onProceed={handleProceed} 
        isReturning={hasEnteredProof} 
      />
    );
  }

  return (
    <div className="eli-layout animate-fade-in">
      {/* 1/5 Sidebar */}
      <div className="eli-sidebar">
        <div className="panel-card">
          <h3>Controls</h3>
          <div className="toggle-group">
            <button className={`toggle-btn ${mode === 'Auto' ? 'active' : ''}`} onClick={() => setMode('Auto')}>Auto</button>
            <button className={`toggle-btn ${mode === 'Manual' ? 'active' : ''}`} onClick={() => setMode('Manual')}>Manual</button>
          </div>

          <h4 style={{marginTop: '20px'}}>Weather State</h4>
          <div className="weather-select" style={{ background: '#f1f5f9', border: '1px dashed #cbd5e1', color: '#0f172a', fontWeight: '800', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
            {weather === 'Warm' && '🌅 Warm'}
            {weather === 'Hot' && '🌇 Hot'}
            {weather === 'Cold' && '❄️ Cold'}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '6px', textAlign: 'center' }}>
            {movedBirds.size}/6 birds moved · {[...seasonsSeeen].map(s => s === 'Warm' ? '🌅' : s === 'Hot' ? '🌇' : '❄️').join(' ')}
          </div>
        </div>

        <div className="panel-card" style={{ padding: '12px' }}>
          <button 
            className="btn-secondary" 
            style={{ 
              width: '100%', 
              padding: '10px', 
              borderRadius: '8px', 
              border: '1px solid #7f1d1d', 
              background: '#fff', 
              color: '#7f1d1d', 
              fontWeight: '700', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              transition: 'background 0.2s, color 0.2s'
            }}
            onClick={() => setViewingPreamble(true)}
            onMouseOver={(e) => { e.currentTarget.style.background = '#7f1d1d'; e.currentTarget.style.color = '#fff'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#7f1d1d'; }}
          >
            📖 Read Stage Preamble
          </button>
        </div>

        {/* AI CONCEPT CARD */}
        <div className="panel-card" style={{ padding: '16px' }}>
          <h3 style={{ marginBottom: '12px', fontSize: '0.88rem' }}>Explainable Interface for AI Concepts</h3>
          {lastMove ? (
            <AIConceptCard concept={lastMove} />
          ) : (
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', textAlign: 'center', padding: '20px 0' }}>
              Drag a bird to see the<br/>AI concept analysis
            </div>
          )}
        </div>

        <button className="btn-primary" onClick={onComplete} disabled={!allSeasonsUnlocked}>
          {allSeasonsUnlocked
            ? 'Unlock Stage 3 →'
            : sequenceComplete
              ? 'Complete the sequence...'
              : `Activity needed (${seasonsSeeen.size}/3 seasons)`}
        </button>
      </div>

      {/* 4/5 Interactive Interface */}
      <div className="eli-main">
        <div className="cage-container">
          <Grid
            weather={weather}
            autoMode={mode === 'Auto'}
            onBirdMove={handleBirdMove}
            onSequenceComplete={() => setSequenceComplete(true)}
          />
        </div>
      </div>
    </div>
  );
};

export default ELIInterface;
