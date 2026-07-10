/* ===============================
GRID DATA
=============================== */

const columns = ["A", "B", "C", "D", "E"];
const rows = [1, 2, 3, 4, 5, 6, 7];

export const nodes = {};

// Scale: 80 units per column (x), 80 units per row (y)
// Y-axis is flipped so Row 1 is at the BOTTOM and Row 7 at the TOP
// (standard mathematical graph convention: y increases upward)
const SPACING_X = 80;
const SPACING_Y = 80;
const OFFSET_X = 150;  // A-column x-start
const OFFSET_Y = 60;   // Row 7 y-position (top of canvas)
const MAX_ROW_IDX = rows.length - 1; // = 6

columns.forEach((col, colIdx) => {
  rows.forEach((row, rowIdx) => {
    nodes[`${col}${row}`] = {
      x: OFFSET_X + colIdx * SPACING_X,
      // Flip: rowIdx=0 (row 1) → bottom; rowIdx=6 (row 7) → top
      y: OFFSET_Y + (MAX_ROW_IDX - rowIdx) * SPACING_Y
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

// Alpha nodes sit at the diagonal midpoints of the inscribed circle
// (inset 45-degree from square corners toward center)
// After Y-flip: A2=(150,460), A6=(150,140), E2=(470,460), E6=(470,140)
// Inner diagonal offset = 160 * (1 - 1/√2) ≈ 160 * 0.2929 ≈ 46.86 ≈ 49 units
export const alpha = {
  // Near A6 (top-left corner of square): move right and down toward center
  α1: { x: (nodes["A6"]?.x ?? 150) + 49, y: (nodes["A6"]?.y ?? 140) + 49 },
  // Near A2 (bottom-left corner of square): move right and up toward center
  α2: { x: (nodes["A2"]?.x ?? 150) + 49, y: (nodes["A2"]?.y ?? 460) - 49 },
  // Near E2 (bottom-right corner of square): move left and up toward center
  α3: { x: (nodes["E2"]?.x ?? 470) - 49, y: (nodes["E2"]?.y ?? 460) - 49 },
  // Near E6 (top-right corner of square): move left and down toward center
  α4: { x: (nodes["E6"]?.x ?? 470) - 49, y: (nodes["E6"]?.y ?? 140) + 49 },
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
