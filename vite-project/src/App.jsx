// App.js
import React, { useState } from 'react';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setPrediction(null);
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('https://ex1-model-pythonanywhere-production.up.railway.app/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Prediction failed');
      }

      const data = await response.json();
      setPrediction(data.prediction); // Assuming your Flask app returns { "prediction": number }
    } catch (err) {
      setError('Error making prediction: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Handwritten Number Predictor</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Predicting...' : 'Predict Number'}
          </button>
        </div>
      </form>

      {selectedFile && (
        <div className="preview">
          <h3>Selected Image:</h3>
          <img 
            src={URL.createObjectURL(selectedFile)}
            alt="Preview"
            style={{ maxWidth: '200px' }}
          />
        </div>
      )}

      {prediction !== null && (
        <div className="result">
          <h3>Prediction: {prediction}</h3>
        </div>
      )}

      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

export default App;