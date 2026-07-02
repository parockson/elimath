import React, { useState, useEffect, useRef } from "react";
import {
  nodes,
  alpha,
  birdPaths,
  initialBirdLabels,
  getNodeColor,
  COLOR_DEEP_GREEN,
} from "./GridData";

/* ===============================
WEATHER OVERLAY COLORS
=============================== */
const weatherOverlay = {
  Hot:  "rgba(251, 191,  36, 0.18)",
  Cold:  "rgba( 96, 165, 250, 0.22)",
  Warm: "rgba( 30,  58, 138, 0.35)", // lighter tint for sunrise
};

/* ===============================
ALL NODES (grid + alpha combined)
=============================== */
const allNodes = { ...nodes, ...alpha };

/* ===============================
AUTO SEQUENCE ORDER
Birds move one-by-one in this order per wave
=============================== */
const AUTO_ORDER = ["A1", "C1", "E1", "A7", "C7", "E7"];
const BIRD_DELAY_MS = 10000; // 10s between each individual bird move

const VIEWBOX = { w: 800, h: 640 };
const BIRD_SIZE = 56;
const BIRD_ASSETS = {
  rest: "/birds/bird-normal1.png",
  flapA: "/birds/bird-flap11.png",
  flapB: "/birds/bird-flap21.png",
};

const birdPosToPercent = ({ x, y }) => ({
  left: `${(x / VIEWBOX.w) * 100}%`,
  top: `${(y / VIEWBOX.h) * 100}%`,
});

/* ===============================
GRID COMPONENT
=============================== */
export default function Grid({ onBirdMove, weather = "Warm", autoMode = false, onSequenceComplete }) {
  const [birdNodes,   setBirdNodes]   = useState(() => Object.fromEntries(initialBirdLabels.map(l => [l, l])));
  const [birdPathIdx, setBirdPathIdx] = useState(() => Object.fromEntries(initialBirdLabels.map(l => [l, 0])));
  const [movingBird,  setMovingBird]  = useState(null);
  const [dragPos,     setDragPos]     = useState(null);
  const [flapFrame,   setFlapFrame]   = useState(0);
  const [currentlyFlying, setCurrentlyFlying] = useState(null); // birdId flying in auto mode

  const videoRef      = useRef(null);
  const svgRef        = useRef(null);
  const dragStartNode = useRef(null);
  const dragTargetRef = useRef(null);
  const autoTimers    = useRef([]);

  // Geometric constants
  const center = nodes.C4;
  const radius = Math.hypot(center.x - nodes.A2.x, center.y - nodes.A2.y) * 0.7;
  const diag1  = [nodes.A2, nodes.E6];
  const diag2  = [nodes.E2, nodes.A6];

  /* ===============================
  FLAP ANIMATION
  =============================== */
  useEffect(() => {
    const isAnyone = movingBird || currentlyFlying;
    if (!isAnyone) return;
    const interval = setInterval(() => setFlapFrame(f => (f + 1) % 2), 80);
    return () => clearInterval(interval);
  }, [movingBird, currentlyFlying]);

  /* ===============================
  AUTO MODE SEQUENCE
  Wave sequence (all birds one-by-one):
    Wave A: 0→1 (1st→2nd)
    Wave B: 1→2 (2nd→3rd) — only birds with path.length > 2
    Wave C: 2→1 (3rd→2nd)
    Wave D: 1→0 (2nd→1st)
  Each bird waits 10s after the previous one
  =============================== */
  const clearAutoTimers = () => {
    autoTimers.current.forEach(clearTimeout);
    autoTimers.current = [];
  };

  useEffect(() => {
    if (!autoMode) {
      clearAutoTimers();
      setCurrentlyFlying(null);
      // Reset birds to start when leaving auto mode
      setBirdNodes(Object.fromEntries(initialBirdLabels.map(l => [l, l])));
      setBirdPathIdx(Object.fromEntries(initialBirdLabels.map(l => [l, 0])));
      return;
    }

    // Build the full sequence of individual bird moves
    // [{ birdId, targetIdx }]
    const sequence = [];

    // Wave A: all → step 1
    AUTO_ORDER.forEach(birdId => {
      if (birdPaths[birdId]?.[1]) sequence.push({ birdId, targetIdx: 1 });
    });
    // Wave B: → step 2 (only birds with 3 nodes)
    AUTO_ORDER.forEach(birdId => {
      if (birdPaths[birdId]?.length > 2) sequence.push({ birdId, targetIdx: 2 });
    });
    // Wave C: back to step 1
    AUTO_ORDER.forEach(birdId => {
      if (birdPaths[birdId]?.length > 2) sequence.push({ birdId, targetIdx: 1 });
      else if (birdPaths[birdId]?.[1])   sequence.push({ birdId, targetIdx: 1 });
    });
    // Wave D: back to step 0
    AUTO_ORDER.forEach(birdId => {
      if (birdPaths[birdId]) sequence.push({ birdId, targetIdx: 0 });
    });

    // Use a single mutable state snapshot to correctly chain moves
    let snap = Object.fromEntries(initialBirdLabels.map(l => [l, l]));
    let idxSnap = Object.fromEntries(initialBirdLabels.map(l => [l, 0]));
    setBirdNodes({ ...snap });
    setBirdPathIdx({ ...idxSnap });

    let cumulativeDelay = 500; // small initial pause

    sequence.forEach(({ birdId, targetIdx }, i) => {
      const t = setTimeout(() => {
        const path = birdPaths[birdId];
        if (!path) return;
        const toLabel   = path[targetIdx];
        const fromLabel = snap[birdId];
        const fromPos   = allNodes[fromLabel];
        const toPos     = allNodes[toLabel];
        if (!toPos || fromLabel === toLabel) return;

        setCurrentlyFlying(birdId);
        snap[birdId]    = toLabel;
        idxSnap[birdId] = targetIdx;
        setBirdNodes(prev => ({ ...prev, [birdId]: toLabel }));
        setBirdPathIdx(prev => ({ ...prev, [birdId]: targetIdx }));
        onBirdMove?.({ bird: birdId, fromLabel, toLabel, fromPos, toPos, nodeColor: getNodeColor(toLabel) });

        // Stop flapping after 2s
        const stopFlap = setTimeout(() => setCurrentlyFlying(null), 2000);
        autoTimers.current.push(stopFlap);

        // If last move in sequence → notify complete
        if (i === sequence.length - 1) {
          const done = setTimeout(() => onSequenceComplete?.(), 500);
          autoTimers.current.push(done);
        }
      }, cumulativeDelay);

      autoTimers.current.push(t);
      cumulativeDelay += BIRD_DELAY_MS;
    });

    return clearAutoTimers;
  }, [autoMode]);

  /* ===============================
  DRAG AND DROP (Manual)
  =============================== */
  const getSVGPos = (e) => {
    const CTM = svgRef.current.getScreenCTM();
    return { x: (e.clientX - CTM.e) / CTM.a, y: (e.clientY - CTM.f) / CTM.d };
  };

  const getValidTarget = (birdId, fromNodeLabel, toNodeLabel) => {
    const path = birdPaths[birdId];
    if (!path) return null;
    const fromIdx = path.indexOf(fromNodeLabel);
    const toIdx   = path.indexOf(toNodeLabel);
    if (fromIdx === -1 || toIdx === -1) return null;
    if (Math.abs(toIdx - fromIdx) === 1) return { label: toNodeLabel, idx: toIdx };
    return null;
  };

  const handlePointerDown = (e, birdId) => {
    if (autoMode) return;
    if (videoRef.current?.muted) {
      videoRef.current.muted = false;
      videoRef.current.play().catch(() => {});
    }
    dragStartNode.current = birdNodes[birdId];
    dragTargetRef.current = e.currentTarget;
    setMovingBird(birdId);
    setDragPos(getSVGPos(e));
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!movingBird || !svgRef.current) return;
    setDragPos(getSVGPos(e));
  };

  const handlePointerUp = (e) => {
    if (!movingBird || !dragPos) return;

    let closestLabel = null;
    let minDist = Infinity;
    Object.entries(allNodes).forEach(([label, pos]) => {
      const dist = Math.hypot(pos.x - dragPos.x, pos.y - dragPos.y);
      if (dist < minDist) { minDist = dist; closestLabel = label; }
    });

    const fromLabel   = dragStartNode.current;
    const validTarget = getValidTarget(movingBird, fromLabel, closestLabel);

    if (validTarget && validTarget.label !== fromLabel) {
      setBirdNodes(prev => ({ ...prev, [movingBird]: validTarget.label }));
      setBirdPathIdx(prev => ({ ...prev, [movingBird]: validTarget.idx }));
      onBirdMove?.({
        bird: movingBird, fromLabel, toLabel: validTarget.label,
        fromPos: allNodes[fromLabel], toPos: allNodes[validTarget.label],
        nodeColor: getNodeColor(validTarget.label),
      });
    }

    dragStartNode.current = null;
    dragTargetRef.current?.releasePointerCapture?.(e.pointerId);
    dragTargetRef.current = null;
    setMovingBird(null);
    setDragPos(null);
  };

  /* ===============================
  RENDER
  =============================== */
  const getBirdPos = (birdId) => {
    if (movingBird === birdId && dragPos) return dragPos;
    return allNodes[birdNodes[birdId]];
  };

  const getBirdSrc = (isFlapping) => {
    if (!isFlapping) return BIRD_ASSETS.rest;
    return flapFrame === 0 ? BIRD_ASSETS.flapA : BIRD_ASSETS.flapB;
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "800px",
        margin: "0 auto",
        aspectRatio: `${VIEWBOX.w} / ${VIEWBOX.h}`,
      }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* BACKGROUND IMAGE AND DYNAMIC EFFECTS */}
      <div style={{
        position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
        zIndex: 0, overflow: "hidden"
      }}>
        <img 
          src={
            weather === 'Winter' ? '/cold.jpg' : 
            weather === 'Monsoon' ? '/warm.jpg' : 
            '/hot.jpg'
          } 
          alt={weather} 
          style={{
            width: "100%", height: "100%",
            objectFit: "cover",
            transition: "all 1.5s ease-in-out",
          }} 
        />
        
        {/* Dynamic Weather Overlay Effects */}
        {weather === 'Winter' && (
          <>
            <div className="snow-layer-1" />
            <div className="snow-layer-2" />
          </>
        )}
        {weather === 'Monsoon' && (
          <div className="warm-glow" />
        )}
        {weather === 'Summer' && (
          <div className="hot-flare" />
        )}
      </div>

      {/* DARK OVERLAY — HTML div so bird transparent pixels show background, not this */}
      <div style={{
        position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
        background: "rgba(0,0,0,0.35)", zIndex: 1, pointerEvents: "none"
      }} />

      {/* WEATHER TINT — also HTML div */}
      <div style={{
        position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
        background: weatherOverlay[weather] ?? weatherOverlay.Summer,
        zIndex: 2, pointerEvents: "none", transition: "background 1.5s ease",
        mixBlendMode: "multiply", opacity: 0.4
      }} />

      <svg ref={svgRef} viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`} width="100%" height="100%"
        style={{ position: "absolute", inset: 0, zIndex: 3, touchAction: "none", pointerEvents: "none" }}
      >
        {/* Outer rectangle */}
        <polygon points={`${nodes.A1.x},${nodes.A1.y} ${nodes.E1.x},${nodes.E1.y} ${nodes.E7.x},${nodes.E7.y} ${nodes.A7.x},${nodes.A7.y}`}
          fill="none" stroke="#60a5fa" strokeWidth="2.5" opacity="0.9" />

        {/* Inner square */}
        <polygon points={`${nodes.A2.x},${nodes.A2.y} ${nodes.E2.x},${nodes.E2.y} ${nodes.E6.x},${nodes.E6.y} ${nodes.A6.x},${nodes.A6.y}`}
          fill="none" stroke="#fb923c" strokeWidth="2.5" opacity="0.9" />

        {/* Circle */}
        <circle cx={center.x} cy={center.y} r={radius} fill="none" stroke="#4ade80" strokeWidth="2.5" opacity="0.9" />

        {/* Diagonals */}
        <line x1={diag1[0].x} y1={diag1[0].y} x2={diag1[1].x} y2={diag1[1].y} stroke="#c084fc" strokeWidth="1.5" opacity="0.7" />
        <line x1={diag2[0].x} y1={diag2[0].y} x2={diag2[1].x} y2={diag2[1].y} stroke="#c084fc" strokeWidth="1.5" opacity="0.7" />

        {/* Path guide lines */}
        {Object.entries(birdPaths).map(([birdId, path]) => {
          const pts = path.map(l => allNodes[l]).filter(Boolean);
          if (pts.length < 2) return null;
          return (
            <polyline key={birdId}
              points={pts.map(p => `${p.x},${p.y}`).join(" ")}
              fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="6,5"
            />
          );
        })}

        {/* GRID NODES */}
        {Object.entries(nodes).map(([l, p]) => {
          const isCalculatedNode = [
            "A1", "A2", "C1", "C2", "E1", "E2", 
            "A7", "A6", "C7", "C6", "E7", "E6", "C4"
          ].includes(l);
          return (
            <g key={l}>
              <circle cx={p.x} cy={p.y} r={5} fill={getNodeColor(l)} stroke="white" strokeWidth="1.5" />
              <text x={p.x + 8} y={p.y - 6} fontSize="11" fill="rgba(255,255,255,0.85)" fontWeight="600">{l}</text>
              {isCalculatedNode && (
                <text x={p.x + 8} y={p.y + 6} fontSize="9" fill="rgba(255,255,255,0.6)" fontWeight="500">
                  ({Math.round(p.x)},{Math.round(p.y)})
                </text>
              )}
            </g>
          );
        })}

        {/* ALPHA NODES */}
        {Object.entries(alpha).map(([l, p]) => (
          <g key={l}>
            <circle cx={p.x} cy={p.y} r={6} fill={COLOR_DEEP_GREEN} stroke="white" strokeWidth="1.5" />
            <text x={p.x + 9} y={p.y - 6} fontSize="11" fill="red" fontWeight="700">{l}</text>
            <text x={p.x + 9} y={p.y + 6} fontSize="9" fill="rgba(255,200,200,0.8)" fontWeight="600">
              ({Math.round(p.x)},{Math.round(p.y)})
            </text>
          </g>
        ))}
      </svg>

      <div className="birds-layer" style={{ position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none" }}>
        {initialBirdLabels.map((birdId) => {
          const p = getBirdPos(birdId);
          if (!p) return null;
          const isFlapping = movingBird === birdId || currentlyFlying === birdId;
          const hasPath = !!birdPaths[birdId];
          const pos = birdPosToPercent(p);

          return (
            <div
              key={birdId}
              style={{
                position: "absolute",
                left: pos.left,
                top: pos.top,
                width: `${(BIRD_SIZE / VIEWBOX.w) * 100}%`,
                transform: "translate(-50%, -50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                pointerEvents: "none"
              }}
            >
              <img
                src={getBirdSrc(isFlapping)}
                alt=""
                draggable={false}
                style={{
                  width: "100%",
                  height: "auto",
                  mixBlendMode: "screen",
                  cursor: hasPath && !autoMode ? (isFlapping ? "grabbing" : "grab") : "default",
                  pointerEvents: hasPath && !autoMode ? "auto" : "none",
                  userSelect: "none",
                  touchAction: "none",
                }}
                onPointerDown={hasPath && !autoMode ? (e) => handlePointerDown(e, birdId) : undefined}
              />
              <div style={{
                background: "rgba(15, 23, 42, 0.8)",
                color: "#fff",
                padding: "1px 4px",
                borderRadius: "3px",
                fontSize: "0.65rem",
                fontFamily: "monospace",
                marginTop: "-4px",
                whiteSpace: "nowrap",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.4)",
                zIndex: 10
              }}>
                ({Math.round(p.x)},{Math.round(p.y)})
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
