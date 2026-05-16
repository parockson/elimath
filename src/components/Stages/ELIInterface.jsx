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
const ELIInterface = ({ timer, onComplete }) => {
  const [mode, setMode] = useState('Manual');
  const [weather, setWeather] = useState('Summer');
  const [movedBirds, setMovedBirds] = useState(new Set());
  const [lastMove, setLastMove] = useState(null);
  const [seasonsSeeen, setSeasonsSeeen] = useState(new Set(['Summer']));
  const [sequenceComplete, setSequenceComplete] = useState(false);

  // Weather updates based on moved birds
  useEffect(() => {
    let newWeather;
    if (movedBirds.size >= 6) newWeather = 'Monsoon';
    else if (movedBirds.size >= 3) newWeather = 'Winter';
    else newWeather = 'Summer';
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
            {weather === 'Summer' && '☀️ Summer'}
            {weather === 'Winter' && '❄️ Winter'}
            {weather === 'Monsoon' && '🌧️ Monsoon'}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '6px', textAlign: 'center' }}>
            {movedBirds.size}/6 birds moved · {[...seasonsSeeen].map(s => s === 'Summer' ? '☀️' : s === 'Winter' ? '❄️' : '🌧️').join(' ')}
          </div>
        </div>

        {/* AI CONCEPT CARD */}
        <div className="panel-card" style={{ padding: '16px' }}>
          <h3 style={{ marginBottom: '12px' }}>AI Concept</h3>
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
