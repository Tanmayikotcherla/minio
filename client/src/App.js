import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const ImageUpload = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/gif')) {
      setUploading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append('photo', file);

        const response = await axios.post('http://127.0.0.1:5000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        setUploadedImage(response.data.message);
        setError(null);
      } catch (err) {
        setError('Error uploading the image. Please try again.');
        console.error('Error uploading image:', err);
      } finally {
        setUploading(false);
      }
    } else {
      setError('Invalid file format. Please upload an image (PNG, JPEG, or GIF).');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/png, image/jpeg, image/gif',
    multiple: false,
  });

  const dropzoneStyles = {
    border: '2px dashed #3498db', // Blue border
    borderRadius: '5px',
    padding: '50px',
    textAlign: 'center',
    cursor: 'pointer',
    marginTop: '50px',
    backgroundColor: '#f0f0f0', // Light gray background
  };

  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    maxWidth: '400px',
    margin: '0 auto',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f9f9f9', // Light gray background
  };

  const errorMessageStyles = {
    color: '#ff0000',
    marginTop: '10px',
    textAlign: 'center',
  };

  // Rest of your component code

  return (
    <div style={containerStyles} className="image-upload-container">
      <div {...getRootProps()} style={dropzoneStyles} id="dropzone">
        <input {...getInputProps()} />
        {uploading ? (
          <p>Uploading...</p>
        ) : (
          <p>
            {isDragActive
              ? 'Drop the image here'
              : 'Drag & drop an image file here or click to select one'}
          </p>
        )}
      </div>
      {error && <div style={errorMessageStyles} className="error-message">{error}</div>}
      {uploadedImage && (
        <div className="uploaded-image-container">
          <p>Image uploaded successfully!</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
