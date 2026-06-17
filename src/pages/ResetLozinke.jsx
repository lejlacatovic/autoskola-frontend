import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';

export default function ResetLozinke() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [uspjeh, setUspjeh] = useState('');
  const [greska, setGreska] = useState('');

  const uid = searchParams.get('uid');
  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setGreska('Lozinke se ne podudaraju!');
      return;
    }
    try {
      await api.post('/auth/reset-password/', { uid, token, password });
      setUspjeh('Lozinka uspješno promijenjena!');
      setGreska('');
      setTimeout(() => navigate('/login'), 2000);
    } catch {
      setGreska('Greška! Link je možda istekao.');
      setUspjeh('');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>🚗 DrivePro</h2>
        <h3 style={styles.subtitle}>Nova lozinka</h3>

        {uspjeh ? (
          <p style={styles.uspjeh}>✅ {uspjeh}</p>
        ) : (
          <form onSubmit={handleSubmit}>
            {greska && <p style={styles.greska}>{greska}</p>}
            <input
              style={styles.input}
              type="password"
              placeholder="Nova lozinka"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <input
              style={styles.input}
              type="password"
              placeholder="Potvrdi novu lozinku"
              value={password2}
              onChange={e => setPassword2(e.target.value)}
              required
            />
            <button style={styles.button} type="submit">
              Promijeni lozinku
            </button>
          </form>
        )}
        <p style={styles.link}>
          <Link to="/login" style={styles.a}>← Nazad na prijavu</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    backgroundColor: '#1a1a1a',
    padding: '40px',
    borderRadius: '12px',
    border: '1px solid #f0c040',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    color: '#f0c040',
    textAlign: 'center',
    marginBottom: '8px',
  },
  subtitle: {
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: '24px',
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '16px',
    backgroundColor: '#2a2a2a',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#f0c040',
    color: '#000000',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  uspjeh: {
    color: '#44ff88',
    textAlign: 'center',
    fontSize: '16px',
    marginBottom: '16px',
  },
  greska: {
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: '16px',
    fontSize: '14px',
  },
  link: {
    color: '#888',
    textAlign: 'center',
    marginTop: '16px',
    fontSize: '14px',
  },
  a: {
    color: '#f0c040',
    textDecoration: 'none',
  },
};