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
/* ===============================
  STEP-BY-STEP CALCULATION PANEL
=============================== */
const CalcSteps = ({ concept }) => {
  const { distConcept, fromLabel, toLabel, fromPos, toPos, manhattan, euclidean } = concept;
  const fx = Math.round(fromPos.x), fy = Math.round(fromPos.y);
  const tx = Math.round(toPos.x),   ty = Math.round(toPos.y);
  const dx = tx - fx, dy = ty - fy;

  const stepStyle = {
    background: '#f8fafc',
    borderRadius: '8px',
    padding: '10px 12px',
    marginBottom: '8px',
    borderLeft: '3px solid',
    fontSize: '0.8rem',
    lineHeight: '1.6',
    fontFamily: 'monospace',
  };
  const labelStyle = { fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '4px' };

  if (distConcept === 'Manhattan Distance') {
    return (
      <div>
        <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#1e40af', marginBottom: '8px' }}>
          📐 Step-by-step: Rectangle → Square
        </div>
        <div style={{ ...stepStyle, borderColor: '#3b82f6' }}>
          <div style={labelStyle}>Step 1 — Identify the points</div>
          From: <strong>{fromLabel}</strong> ({fx}, {fy}) &nbsp;→&nbsp; To: <strong>{toLabel}</strong> ({tx}, {ty})
        </div>
        <div style={{ ...stepStyle, borderColor: '#8b5cf6' }}>
          <div style={labelStyle}>Step 2 — Apply the formula</div>
          d = |x₂ − x₁| + |y₂ − y₁|<br/>
          d = |{tx} − {fx}| + |{ty} − {fy}|<br/>
          d = |{dx}| + |{dy}|
        </div>
        <div style={{ ...stepStyle, borderColor: '#16a34a', background: '#f0fdf4' }}>
          <div style={labelStyle}>Step 3 — Result</div>
          Manhattan distance = <strong style={{ color: '#15803d' }}>{manhattan} units</strong><br/>
          <span style={{ color: '#64748b', fontSize: '0.72rem' }}>All vertices moved this exact distance vertically — confirming consistent vertical scaling.</span>
        </div>
      </div>
    );
  }

  // Euclidean
  const dx2 = (dx * dx).toFixed(0);
  const dy2 = (dy * dy).toFixed(0);
  const sumSq = (dx * dx + dy * dy).toFixed(0);
  return (
    <div>
      <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#7c3aed', marginBottom: '8px' }}>
        📐 Step-by-step: Square → Circle
      </div>
      <div style={{ ...stepStyle, borderColor: '#3b82f6' }}>
        <div style={labelStyle}>Step 1 — Identify the points</div>
        From: <strong>{fromLabel}</strong> ({fx}, {fy}) &nbsp;→&nbsp; To: <strong>{toLabel}</strong> ({tx}, {ty})
      </div>
      <div style={{ ...stepStyle, borderColor: '#8b5cf6' }}>
        <div style={labelStyle}>Step 2 — Apply the formula</div>
        d = √((x₂−x₁)² + (y₂−y₁)²)<br/>
        d = √(({tx}−{fx})² + ({ty}−{fy})²)<br/>
        d = √({dx}² + {dy}²)<br/>
        d = √({dx2} + {dy2})<br/>
        d = √{sumSq}
      </div>
      <div style={{ ...stepStyle, borderColor: '#16a34a', background: '#f0fdf4' }}>
        <div style={labelStyle}>Step 3 — Result</div>
        Euclidean distance = <strong style={{ color: '#15803d' }}>{euclidean} units</strong><br/>
        <span style={{ color: '#64748b', fontSize: '0.72rem' }}>This equals the circle radius — every boundary point is equidistant from centre E(310, 300).</span>
      </div>
    </div>
  );
};

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

      {/* Step-by-step calculations */}
      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px', marginTop: '4px' }}>
        <CalcSteps concept={concept} />
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
            <h3>Rectangle to Square Transformation in ELI</h3>
            <p>
              ELI demonstrates one possible proof for transforming a rectangle into a square using <strong>vertical scaling</strong>. The rectangle has width 320 units and height 480 units, and its centre remains fixed at E(310, 300).
            </p>
            <p>
              Because a square needs four equal sides, ELI scales only the vertical distance of each vertex from the centre by the factor <em>2/3</em>, while keeping the horizontal coordinates unchanged. The result is a figure with equal width and height of 320 units, and the right angles are preserved.
            </p>
            <div className="ai-tag manhattan">
              <span>AI Concept:</span> Manhattan Distance
            </div>
            <p className="ai-concept-detail">
              ELI verifies the transformation by computing the Manhattan distance each vertex travelled. All four vertices move exactly <strong>80 units</strong> along the vertical direction, confirming the scaling was applied consistently. Manhattan distance — used in AI for grid-based pathfinding, robot navigation, and image processing — measures movement along horizontal and vertical paths rather than direct diagonal distances.
            </p>
          </div>

          <div className="proof-block">
            <h3>Square to Circle Transformation in ELI</h3>
            <p>
              ELI next demonstrates how to transform the square into a circle using a <strong>centre-based Euclidean distance constraint</strong>. Instead of moving the corners alone, ELI redefines the boundary as the set of points that are all the same distance from the fixed centre E(310, 300).
            </p>
            <p>
              The boundary is represented by eight points: four on the symmetry lines — (310, 140), (470, 300), (310, 460), (150, 300) — and four on the diagonals — (196.86, 186.86), (423.14, 186.86), (423.14, 413.14), (196.86, 413.14). Each point is exactly <strong>160 units</strong> from the centre, giving the circle a consistent radius.
            </p>
            <div className="ai-tag euclidean">
              <span>AI Concept:</span> Euclidean Distance
            </div>
            <p className="ai-concept-detail">
              Euclidean distance (L2) measures the shortest straight-line distance between two points — unlike Manhattan distance, which follows grid directions. It is used in AI for computer vision, facial recognition, autonomous vehicles, and clustering algorithms such as k-means. Within ELI, it verifies that every selected boundary point lies at the same straight-line distance from the centre.
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
  const [weather, setWeather] = useState('Hot'); // starts Hot = Rectangle stage
  const [movedBirds, setMovedBirds] = useState(new Set());
  const [lastMove, setLastMove] = useState(null);
  const [seasonsSeeen, setSeasonsSeeen] = useState(new Set(['Hot']));
  const [sequenceComplete, setSequenceComplete] = useState(false);
  const [viewingPreamble, setViewingPreamble] = useState(timer < 60);
  const [hasEnteredProof, setHasEnteredProof] = useState(false);

  useEffect(() => {
    if (timer < 60) {
      setViewingPreamble(true);
    }
  }, [timer]);

  // Weather updates based on moved birds
  // Hot  = Rectangle stage  (0–2 birds moved  → sunny/hot background)
  // Warm = Square stage     (3–5 birds moved  → sunrise/sunset background)
  // Cold = Circle stage     (6   birds moved  → snowy/cold background)
  useEffect(() => {
    let newWeather;
    if (movedBirds.size >= 6) newWeather = 'Cold';
    else if (movedBirds.size >= 3) newWeather = 'Warm';
    else newWeather = 'Hot';
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

          <h4 style={{marginTop: '20px'}}>Shape Stage</h4>
          <div className="weather-select" style={{ background: '#f1f5f9', border: '1px dashed #cbd5e1', color: '#0f172a', fontWeight: '800', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
            {weather === 'Hot'  && '☀️ Rectangle (Hot)'}
            {weather === 'Warm' && '🌅 Square (Warm)'}
            {weather === 'Cold' && '❄️ Circle (Cold)'}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '6px', textAlign: 'center' }}>
            {movedBirds.size}/6 birds moved · {[...seasonsSeeen].map(s => s === 'Hot' ? '☀️' : s === 'Warm' ? '🌅' : '❄️').join(' ')}
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
