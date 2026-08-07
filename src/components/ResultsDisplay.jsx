import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, Syringe, Info } from 'lucide-react';

const ResultsDisplay = ({ results }) => {
  const defaultDiseases = [
    'Rice Hispa',
    'Bacterial Leaf Blight',
    'Brown Spot',
    'Healthy Rice Leaf',
    'Leaf Blast',
    'Leaf scald',
    'Narrow Brown Leaf Spot'
  ];

  const { prediction, confidence, advice, all_probabilities } = results || {};
  
  const isHealthy = prediction === 'Healthy Rice Leaf';
  const confidenceValue = parseFloat(confidence) || 0;
  
  const probs = all_probabilities ? 
    Object.entries(all_probabilities).sort(([,a], [,b]) => b - a) :
    defaultDiseases.map(disease => [disease, 0]);

  return (
    <div className="results-layout">
      <div className="glass-panel results-container" id="tutorial-analysis">
        {results ? (
          <>
            <div className="prediction-header">
              <h2>Diagnosis Result</h2>
              <div className={`prediction-title ${isHealthy ? 'prediction-healthy' : 'prediction-danger'}`}>
                {prediction}
              </div>
              <div className="confidence-badge">
                Confidence: {confidenceValue.toFixed(1)}%
              </div>
            </div>

            <div className="advice-section animate-fade-in">
              <div className="advice-card">
                <h4><Info size={18} /> Description</h4>
                <p>{advice?.description || 'No description available for this classification.'}</p>
              </div>

              {!isHealthy && (
                <>
                  <div className="advice-card">
                    <h4><ShieldCheck size={18} /> Prevention</h4>
                    <p>{advice?.prevention || 'Maintain good agricultural practices.'}</p>
                  </div>

                  <div className="advice-card">
                    <h4><Syringe size={18} /> Treatment</h4>
                    <p>{advice?.treatment || 'Consult a local agricultural extension worker.'}</p>
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
            <p>Upload a leaf image to see the analysis.</p>
          </div>
        )}
      </div>

      <div className="probabilities-panel" id="tutorial-probabilities">
        <h3>Prediction Confidence</h3>
        <div className="probs-container">
          {probs.map(([className, prob], index) => (
            <div key={className} className="prob-row" style={{ animationDelay: results ? `${index * 0.1}s` : '0s' }}>
              <div className="prob-info">
                <span className="prob-label" style={{ fontWeight: prediction === className ? 700 : 400 }}>
                  {className}
                </span>
              </div>
              <div className="prob-bar-container">
                <div 
                  className="prob-bar animated-bar" 
                  style={{ 
                    width: `${prob}%`,
                    '--width': `${prob}%`
                  }} 
                ></div>
              </div>
              <span className="prob-value">
                {prob.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;

