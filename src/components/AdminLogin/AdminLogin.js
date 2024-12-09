import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminContext } from '../../context/AdminContext';  // Import setadmin
import api from '../../api'; // Import the Axios instance

function AdminLogin() {
  const [email, setEmail] = useState('yasindu@example.com');
  const [password, setPassword] = useState('12345');
  const [error, setError] = useState('');
  const { setAdminData } = useAdminContext();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {

      const response = await api.post('/admin/login', { email, password }); // Call the /login endpoint
      setAdminData(response.data)
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ marginTop: '50px', textAlign: 'center' }}>
      <h1>Admin Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default AdminLogin;