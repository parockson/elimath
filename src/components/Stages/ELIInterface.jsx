import React, { useState } from 'react';

const ELIInterface = ({ onComplete }) => {
  return (
    <div className="card">
      <h2>STAGE TWO: Automated Theorem Prover-ELI</h2>
      <div className="cage" style={{ border: '4px solid #5d4037', height: '400px', position: 'relative' }}>
        {/* This is where the 9 birds and weather lore logic will live */}
        <p style={{ textAlign: 'center', marginTop: '180px' }}>[Interactive Birds Canvas Area]</p>
      </div>
      <button onClick={onComplete} style={{ marginTop: '20px' }}>Complete 45min Session</button>
    </div>
  );
};

export default ELIInterface;
