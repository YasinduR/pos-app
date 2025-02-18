import React, { useState,useEffect } from 'react';
import '../../styles/DialogBox.css';
import { v4 as uuidv4 } from "uuid"; // Importing UUID to generate unique filenames


function DragDropUpload({ onUpload,cancelUpload,imageFiles,oldImages,setOldImages}) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState(imageFiles); // State to store dropped files
  const [oldfiles,setOldFiles] = useState(oldImages); // // State to store uploaded files

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

  const handleRemoveofExistingimages = (removeurl,event) => {
    if (event) {
      event.preventDefault();  // Avoid unnessary reloads and navigations // used this to debug the program have to study later
      event.stopPropagation();
    }
    setOldFiles((prevFiles) => prevFiles.filter((url) => url !== removeurl));
  };



  const handleSubmit = () => {
    setOldImages(oldfiles);// oldfiles
    onUpload(files); // files to be upploaded
    setFiles([]);
    setOldFiles([]);
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
    {/* Display old images */}
  
{/* Combined container for both old and new images */}
<div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px' }}>
  {/* Display old images */}
  {oldfiles.map((imageUrl) => (
    <div
      key={imageUrl}
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
        src={imageUrl}
        alt="preview"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      <button
        type="button"
        onClick={(event) => handleRemoveofExistingimages(imageUrl, event)}
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

  {/* Display selected new files */}
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
</div>
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