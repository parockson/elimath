/* ===============================
GRID DATA
=============================== */

const columns = ["A", "B", "C", "D", "E"];
const rows = [1, 2, 3, 4, 5, 6, 7];

export const nodes = {};

// Increase spacing to make grid larger
const SPACING_X = 80;
const SPACING_Y = 80;
const OFFSET_X = 150; // shift right to center in a 700 width canvas
const OFFSET_Y = 60;  // shift down

columns.forEach((col, colIdx) => {
  rows.forEach((row, rowIdx) => {
    nodes[`${col}${row}`] = {
      x: OFFSET_X + colIdx * SPACING_X,
      y: OFFSET_Y + rowIdx * SPACING_Y
    };
  });
});

/* ===============================
COLORS & HELPERS
=============================== */

export const COLOR_PALE_ORANGE = "#F6C28B";
export const COLOR_DEEP_GREEN = "#1F6F43";
export const COLOR_PALE_GREEN = "#9AD3A6";

export const dispersalNodes = [
  "A1", "B1", "C1", "D1", "E1",
  "A7", "B7", "C7", "D7", "E7"
];

export const convergenceNodes = [
  "B3", "B4", "B5", "D3", "D4", "D5",
  "C2", "C3", "C4", "C5", "C6"
];

export const getNodeColor = (label) => {
  if (dispersalNodes.includes(label)) return COLOR_PALE_ORANGE;
  if (convergenceNodes.includes(label)) return COLOR_DEEP_GREEN;
  return COLOR_PALE_GREEN;
};

/* ===============================
ALPHA NODES
=============================== */

// Alpha nodes sit at the corners of the inner square (circumscribed circle)
export const alpha = {
  α1: { x: (nodes["A2"]?.x ?? 125) + 49, y: (nodes["A6"]?.y ?? 355) - 49 }, // right+up
  α2: { x: (nodes["A2"]?.x ?? 125) + 49, y: (nodes["A2"]?.y ?? 120) + 49 }, // right+down
  α3: { x: (nodes["E2"]?.x ?? 455) - 49, y: (nodes["A2"]?.y ?? 120) + 49 }, // left+down
  α4: { x: (nodes["E2"]?.x ?? 455) - 49, y: (nodes["A6"]?.y ?? 440) - 49 }, // left+up
};

/* ===============================
INITIAL BIRDS
=============================== */

export const initialBirdLabels = [
  "A1", "C1", "E1",
  "A4", "C4", "E4",
  "A7", "C7", "E7"
];

export const initialBirdPositions = Object.fromEntries(
  initialBirdLabels.map(l => [l, nodes[l]])
);

/* ===============================
BIRD PATHS (one step forward/back)
=============================== */

// Each bird's allowed path in order; first node = starting position
export const birdPaths = {
  "A1": ["A1", "A2", "α2"],
  "C1": ["C1", "C2"],
  "E1": ["E1", "E2", "α3"],
  "A7": ["A7", "A6", "α1"],
  "C7": ["C7", "C6"],
  "E7": ["E7", "E6", "α4"],
};
