import React, { useState } from 'react';
import s3 from '../../aws/aws-config';
import styles from './DragAndDrop.module.css';
import { v4 as uuidv4 } from "uuid"; // Importing UUID to generate unique filenames

function DragDropUpload({ onUpload,productId }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    //const files = event.dataTransfer.files;

     // Convert FileList to an array
    const files = Array.from(event.dataTransfer.files);

    if (files.length) {
      files.forEach((file) => {
      const folderPath = `products/${productId}/`; // Folder path
      const uniqueFileName = `${uuidv4()}${file.name.slice(file.name.lastIndexOf("."))}`; // Generating a random filename with the same extension

      const params = {
        Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
        Key: `${folderPath}${uniqueFileName}`, // Use random filename
        Body: file,
        ContentType: file.type,
      };

      s3.upload(params, (err, data) => {
        if (err) {
          console.error('Upload failed:', err);
          alert('Error uploading file');
        } else {
          console.log('Upload successful:', data.Location);
          onUpload(data.Location);
        }
      });
    });
  }};

  return (
    <div
      style={{
        border: '2px dashed #ccc',
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        backgroundColor: isDragging ? '#e6f7ff' : '#f9f9f9',
        borderColor: isDragging ? '#007bff' : '#ccc',
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <p>{isDragging ? 'Release to upload' : 'Drop your image here'}</p>
    </div>
  );
}

export default DragDropUpload;