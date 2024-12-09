import React from 'react';
import { useRoutes } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import AdminLogin from './components/AdminLogin/AdminLogin'
import Dashboard from './components/Dashboard/Dashboard'

const App = () => {
  const routes = useRoutes([
    { path: '/', element: <AdminLogin /> },
    { path: '/dashboard', element: <Dashboard /> },
  ]);
  return routes;
};

export default App;