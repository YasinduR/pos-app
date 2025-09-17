// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/table.css'; // Import table.css globally
import App from './App';
import { AdminProvider } from './context/AdminContext';
import { AlertProvider } from './context/AlertContext';
import { CitiesProvider } from './context/CityContext';
import AlertBox from './components/AlertBox/AlertBox'

// Ensure the entire App is wrapped inside BrowserRouter
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <AdminProvider>
      <CitiesProvider>
    <AlertProvider>
    <AlertBox />
        <App />
    </AlertProvider>
    </CitiesProvider>
    </AdminProvider>
    </BrowserRouter>
  </React.StrictMode>
);