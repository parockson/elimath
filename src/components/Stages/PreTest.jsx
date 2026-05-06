import React, { useState } from 'react';

const PreTest = ({ onComplete }) => {
  return (
    <div className="card">
      <h2>STAGE ONE: Pre-Test</h2>
      <p>Describe how you would transform a rectangle into a square and then into a circle.</p>
      <form onSubmit={(e) => { e.preventDefault(); onComplete(); }}>
        <h3>Part 1: Rectangle → Square</h3>
        <label>Name of the Part (a):</label>
        <input type="text" placeholder="e.g. vertex, side, or angle" />
        {/* Simplified for now - repeat inputs as needed */}
        <button type="submit">Submit and Unlock ELI</button>
      </form>
    </div>
  );
};

export default PreTest;
