import React, { useState, useEffect } from 'react';
import { Leaf } from 'lucide-react';
import ImageUploader from './components/ImageUploader';
import ResultsDisplay from './components/ResultsDisplay';
import TutorialModal from './components/TutorialModal';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);

  const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');
  const apiUrl = baseUrl.endsWith('/predict') ? baseUrl : `${baseUrl}/predict`;

  useEffect(() => {
    const hasVisited = localStorage.getItem('rice-disease-visited');
    if (!hasVisited) {
      setShowTutorial(true);
      localStorage.setItem('rice-disease-visited', 'true');
    }
  }, []);

  const handleImageSelect = (file) => {
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setResults(null);
    setError(null);
    
    submitImage(file);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setResults(null);
    setError(null);
  };

  const submitImage = async (file) => {
    if (!file) return;
    
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error("Error predicting:", err);
      setError("Failed to connect to the prediction server. Please ensure your FastAPI server is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} />}
      
      <header className="app-header animate-fade-in">
        <h1>
          <Leaf size={40} style={{ display: 'inline', marginRight: '10px', verticalAlign: 'middle', color: 'var(--color-text-main)' }} />
          Rice Leaf Disease Detection 
        </h1>
        <p>Instantly diagnose rice leaf diseases and get actionable agricultural advice powered by deep learning.</p>

        
      </header>

      <main className="main-content">
        <section className="upload-section animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <ImageUploader 
            onImageSelect={handleImageSelect} 
            imagePreview={imagePreview}
            onReset={handleReset}
            isLoading={isLoading}
          />
        </section>

        <section className="results-section animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {isLoading ? (
            <div className="glass-panel loading-container">
              <div className="spinner"></div>
              <p>Analyzing leaf structures...</p>
            </div>
          ) : error ? (
            <div className="glass-panel">
              <div className="error-message">
                {error}
              </div>
            </div>
          ) : (
            <ResultsDisplay results={results} />
          )}
        </section>
      </main>

      <footer style={{ textAlign: 'center', padding: '20px', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
        Developed by: Mark Joseph Potot
      </footer>
    </div>
  );
}

export default App;
