import React, { useState } from 'react';

const TestForm = ({ title, stageNumber, onComplete }) => {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Submitting Stage ${stageNumber}:`, formData);
    onComplete();
  };

  const renderPartInputs = (count, prefix) => {
    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p'];
    // Logic to select the correct slice of letters based on part
    return Array.from({ length: count }).map((_, index) => (
      <div key={index} className="input-group">
        <label>{letters[index + prefix]}. Name of the Part:</label>
        <input type="text" name={`part_${letters[index + prefix]}`} onChange={handleChange} />
      </div>
    ));
  };

  return (
    <div className="card animate-fade-in">
      <h2>STAGE {stageNumber === 1 ? 'ONE' : 'THREE'}: {title}</h2>
      <form onSubmit={handleSubmit}>
        <h3>Part 1: Rectangle → Square</h3>
        {renderPartInputs(4, stageNumber === 1 ? 0 : 8)}
        
        <h3>Part 2: Square → Circle</h3>
        {/* Similar logic for Square to Circle */}
        
        <div className="narrative-section">
          <h3>Part 3: Combined Narrative</h3>
          <textarea 
            name="narrative" 
            placeholder="Combine your responses into a short narrative..."
            onChange={handleChange}
            rows="5"
          />
        </div>

        <button type="submit" className="btn-submit">
          {stageNumber === 1 ? "Submit to Unlock ELI" : "Submit Final Results"}
        </button>
      </form>
    </div>
  );
};

export default TestForm;