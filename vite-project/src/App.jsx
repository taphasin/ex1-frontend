import React, { useState } from 'react';
import './App.css';
import picture0 from './0.jpg';
import picture1 from './1.jpg';
import picture2 from './2.jpg';
import picture3 from './3.jpg';
import picture4 from './4.jpg';
import picture5 from './5.jpg';
import picture6 from './6.jpg';
import picture7 from './7.jpg';
import picture8 from './8.jpg';
import picture9 from './9.jpg';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null); // New state for preview URL
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setSelectedImageUrl(URL.createObjectURL(file)); // Create URL for preview
    setPrediction(null);
    setError(null);
  };

  const handleImageClick = (imageName) => {
    setSelectedFile(null); // Reset selectedFile for submission
    setSelectedImageUrl(imageName); // Set the image URL for preview
    setPrediction(null);
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile && !selectedImageUrl) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    const formData = new FormData();

    if (selectedFile) {
      formData.append('file', selectedFile);
    } else if (selectedImageUrl) {
      // If selectedImageUrl is set, fetch the image and append it to formData
      const response = await fetch(selectedImageUrl);
      const blob = await response.blob();
      formData.append('file', blob, selectedImageUrl);
    }

    try {
      const response = await fetch('http://127.0.0.1:5000', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Prediction failed');
      }

      const data = await response.json();
      setPrediction(data.prediction);
    } catch (err) {
      setError('Error making prediction: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Handwritten Number Predictor</h1>

      {/* Display number images */}
      <div className="number-selection">
        {[
          picture0,
          picture1,
          picture2,
          picture3,
          picture4,
          picture5,
          picture6,
          picture7,
          picture8,
          picture9,
        ].map((picture, i) => (
          <img
            key={i}
            src={picture}
            alt={`Number ${i}`}
            className="number-image"
            onClick={() => handleImageClick(picture)}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <button type="submit" className="predict" disabled={loading}>
            {loading ? 'Predicting...' : 'Predict Number'}
          </button>
        </div>
      </form>

      {selectedImageUrl && (
        <div className="preview">
          <h3>Selected Image:</h3>
          <img
            src={selectedImageUrl} // Use selectedImageUrl for preview
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
