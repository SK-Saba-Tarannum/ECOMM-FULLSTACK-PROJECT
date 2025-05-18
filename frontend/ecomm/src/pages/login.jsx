
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('https://ecomm-fullstack-project.onrender.com/api/auth/login', {
        email,
        password,
      });

      const token = response.data.token;
      localStorage.setItem('token', token);

      const decoded = jwtDecode(token);
      const role = decoded.role;

      localStorage.setItem('role', role);
      localStorage.setItem('userId', decoded.id);

      alert('Login successful!');

      if (role === 'SELLER') {
        navigate('/seller');
      } else if (role === 'CUSTOMER') {
        navigate('/dashboard');
      } else {
        alert('Invalid role');
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-200">
      <div className="bg-white p-4 rounded-xl shadow-md w-72">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-2 p-1 border border-gray-300 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full mb-2 p-1 border border-gray-300 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full mt-2 bg-gray-500 text-white py-1 rounded hover:bg-gray-700 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
