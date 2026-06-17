import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login(username, password);
      if (userData?.role === 'instruktor') navigate('/instruktor');
      else if (userData?.role === 'admin') navigate('/admin-dashboard');
      else navigate('/dashboard');
    } catch {
      setError('Pogrešno korisničko ime ili lozinka.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>🚗 DrivePro</h2>
        <h3 style={styles.subtitle}>Prijava</h3>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            style={styles.input} placeholder="Korisničko ime"
            value={username} onChange={e => setUsername(e.target.value)} required
          />
          <input
            style={styles.input} type="password" placeholder="Lozinka"
            value={password} onChange={e => setPassword(e.target.value)} required
          />
          <button style={styles.button} type="submit">Prijavi se</button>
        </form>
        <p style={styles.link}>
          <Link to="/forgot-password" style={styles.a}>Zaboravili ste lozinku?</Link>
        </p>
        <p style={styles.link}>
          Nemate nalog? <Link to="/register" style={styles.a}>Registrujte se</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh', backgroundColor: '#0a0a0a',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  box: {
    backgroundColor: '#1a1a1a', padding: '40px', borderRadius: '12px',
    border: '1px solid #f0c040', width: '100%', maxWidth: '400px',
  },
  title: { color: '#f0c040', textAlign: 'center', marginBottom: '8px' },
  subtitle: { color: '#ffffff', textAlign: 'center', marginBottom: '24px' },
  input: {
    width: '100%', padding: '12px', marginBottom: '16px',
    backgroundColor: '#2a2a2a', border: '1px solid #333', borderRadius: '8px',
    color: '#ffffff', fontSize: '14px', boxSizing: 'border-box',
  },
  button: {
    width: '100%', padding: '12px', backgroundColor: '#f0c040',
    color: '#000000', border: 'none', borderRadius: '8px',
    fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
  },
  error: { color: '#ff4444', textAlign: 'center', marginBottom: '16px' },
  link: { color: '#888', textAlign: 'center', marginTop: '12px', fontSize: '14px' },
  a: { color: '#f0c040', textDecoration: 'none' },
};