import React, { useCallback, useState } from 'react';
import { UploadCloud, RefreshCw } from 'lucide-react';

const ImageUploader = ({ onImageSelect, imagePreview, onReset, isLoading }) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const file = files[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  return (
    <div className="glass-panel" style={{ height: '100%' }}>
      <input 
        id="image-upload" 
        type="file" 
        accept="image/*" 
        style={{ display: 'none' }} 
        onChange={handleChange}
      />
      {imagePreview ? (
        <div className="uploader-container preview-container" id="tutorial-upload">
          <img src={imagePreview} alt="Leaf Preview" className="image-preview" />
          <label 
            className="reupload-btn" 
            htmlFor={isLoading ? undefined : "image-upload"}
            style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
          >
            <RefreshCw size={18} className={isLoading ? "spinner" : ""} style={{border: 'none'}} />
            {isLoading ? "Analyzing..." : "Analyze Another Leaf"}
          </label>
        </div>
      ) : (
        <label 
          id="tutorial-upload"
          className={`uploader-container ${isDragActive ? "drag-active" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          htmlFor="image-upload"
        >
          <UploadCloud size={64} className="upload-icon" />
          <div className="upload-text">
            <h3>Upload Leaf Image</h3>
            <p>Drag and drop your image here, or click to browse</p>
          </div>
          <div className="upload-btn">Select Image</div>
        </label>
      )}
    </div>
  );
};

export default ImageUploader;
