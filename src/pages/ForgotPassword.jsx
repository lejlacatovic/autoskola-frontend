import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/forgot-password/', { email });
      setSent(true);
    } catch {
      setError('Greška. Pokušajte ponovo.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>🚗 DrivePro</h2>
        <h3 style={styles.subtitle}>Zaboravljena lozinka</h3>
        {sent ? (
          <p style={styles.success}>
            Link za reset je poslat na vaš email!
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <p style={styles.error}>{error}</p>}
            <p style={styles.opis}>
              Unesite vaš email i poslat ćemo vam link za reset lozinke.
            </p>
            <input
              style={styles.input}
              type="email"
              placeholder="Email adresa"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <button style={styles.button} type="submit">
              Pošalji link
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
  opis: {
    color: '#888',
    textAlign: 'center',
    marginBottom: '16px',
    fontSize: '14px',
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
  error: {
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: '16px',
  },
  success: {
    color: '#44ff88',
    textAlign: 'center',
    fontSize: '16px',
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
