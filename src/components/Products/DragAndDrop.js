import React, { useState,useEffect } from 'react';
import s3 from '../../aws/aws-config';
import '../../styles/DialogBox.css';
import styles from './DragAndDrop.module.css';
import { v4 as uuidv4 } from "uuid"; // Importing UUID to generate unique filenames


function DragDropUpload({ onUpload,cancelUpload,imageFiles}) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState(imageFiles); // State to store dropped files

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(event.dataTransfer.files);

    if (droppedFiles.length) {
      droppedFiles.forEach((file) => {
        const reader = new FileReader();
        const uniqueId = uuidv4(); // Generate unique ID for each file
        reader.onload = () => {
          setFiles((prevFiles) => [
            ...prevFiles,
            { id: uniqueId, file, preview: reader.result }, // Store file and its base64 preview
          ]);
        };
        reader.readAsDataURL(file); // Read the file as a data URL
      });
    }
  };

  useEffect(() => {
    console.log('Updated files state:', files); // Logs updated state
  }, [files]); // Runs whenever `files` state changes


  useEffect(() => {
    console.log('Updated files state:', files); // Logs updated state
  }, [files]); // Runs whenever `files` state changes

  const handleCancel = () => {
    cancelUpload();
  }

  const handleRemove = (id, event) => {
    if (event) {
      event.preventDefault();  // Avoid unnessary reloads and navigations // used this to debug the program have to study later
      event.stopPropagation();
    }
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  };

  const handleSubmit_ = () => {
    if (files.length === 0) {
      alert("No files to upload!");
      return;
    }

    const folderPath = `products/`;

    files.forEach((file) => {
      const uniqueFileName = `${uuidv4()}${file.name.slice(file.name.lastIndexOf("."))}`;

      const params = {
        Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
        Key: `${folderPath}${uniqueFileName}`, // Use random filename
        Body: file,
        ContentType: file.type,
      };

      s3.upload(params, (err, data) => {
        if (err) {
          console.error("Upload failed:", err);
          alert(`Error uploading file: ${file.name}`);
        } else {
          console.log("Upload successful:", data.Location);
          onUpload(data.Location); // Pass uploaded file URL back to the parent component
        }
      });

    });

    // Clear the local files after upload
    setFiles([]);
    alert("Upload complete!");
  };

  const handleSubmit = () => {
    onUpload(files)
    setFiles([]);
    alert("Upload complete!");
  };


  

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
      <div
        style={{
          border: "2px dashed #ccc",
          borderRadius: "8px",
          padding: "20px",
          textAlign: "center",
          cursor: "pointer",
          transition: "background-color 0.3s ease",
          backgroundColor: isDragging ? "#e6f7ff" : "#f9f9f9",
          borderColor: isDragging ? "#007bff" : "#ccc",
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <p>
          {isDragging
            ? "Release to upload"
            : "Drop your images here (they won't be uploaded until you submit)"}
        </p>
      


      {/* Display selected files */}
      {files.length > 0 && (
        <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {files.map(({ id, preview }, index) => (
            <div
              key={id}
              style={{
                position: 'relative',
                width: '100px',
                height: '100px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#f5f5f5',
              }}
            >
              <img
                src={preview}
                alt="preview"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <button
                type="button"
                onClick={(event) => handleRemove(id, event)}
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  padding: '2px 6px',
                  fontSize: '12px',
                  border: 'none',
                  borderRadius: '50%',
                  backgroundColor: '#ff4d4f',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>
          ))}
          </div>)
          }
      
      </div>
      {/* Submit Button */}
      <div className="dialog-actions">
            <button type="button" onClick={handleSubmit}>
              Save
            </button>
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
      </div>
    </div>
    </div>
  );
}

export default DragDropUpload;