import React from 'react';
import '../../styles/Alert.css'; // Add styles here
import { useAlert } from '../../context/AlertContext';

const AlertBox = () => {
  const { alert, hideAlert } = useAlert();
  

if (!alert.isVisible) return null;

  return (
    <div>
    {/* Backdrop to disable the underlying layer */}
    <div className="alert-backdrop" onClick={hideAlert}></div>
    <div className={`alert-box ${alert.type}`}>
      <p>{alert.message}</p>
      <button onClick={hideAlert}>Close</button>
    </div>
    </div>
  );
};

export default AlertBox;