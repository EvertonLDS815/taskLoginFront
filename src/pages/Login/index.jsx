import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../config/api';
import './style.css'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se o token existe e redireciona para /todolist
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/todolist');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const {data} = await api.post('/login',{ email, password },);
      if (data && data.token) {
        localStorage.setItem('token', data.token);
        navigate('/todolist'); // Redireciona para a página protegida
      } else {
        throw new Error('Token not received');
      }
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className='container'>
      <form className='form' onSubmit={handleSubmit}>
      <h2>Form Login</h2>
        <div>
          <label for='email'>Login</label>
          <input
            id='email'
            type='text'
            placeholder='johnback@gmail.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label for='password'>Password</label>
          <input
            id='password'
            type='password'
            placeholder='******'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: '#d70101' }}>{error}</p>}
        <button type='submit'>Login</button>
      </form>
    </div>
  );
};

export default Login;
