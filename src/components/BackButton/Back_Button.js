import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BackButton.module.css'; // Optional for styling

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.buttonContainer}>
      <button onClick={() => navigate('/dashboard')} className={styles.button}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default BackButton;