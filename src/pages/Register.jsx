import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Register() {
  const [form, setForm] = useState({
    username: '', email: '', first_name: '',
    last_name: '', phone: '',
    password: '', password2: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password2) {
      setError('Lozinke se ne podudaraju!');
      return;
    }
    try {
      await api.post('/auth/register/', { ...form, role: 'kandidat' });
      navigate('/login');
    } catch {
      setError('Greška pri registraciji. Provjeri podatke.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>🚗 DrivePro</h2>
        <h3 style={styles.subtitle}>Registracija</h3>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} name="first_name" placeholder="Ime"
            value={form.first_name} onChange={handleChange} required />
          <input style={styles.input} name="last_name" placeholder="Prezime"
            value={form.last_name} onChange={handleChange} required />
          <input style={styles.input} name="username" placeholder="Korisničko ime"
            value={form.username} onChange={handleChange} required />
          <input style={styles.input} name="email" type="email" placeholder="Email"
            value={form.email} onChange={handleChange} required />
          <input style={styles.input} name="phone" placeholder="Telefon"
            value={form.phone} onChange={handleChange} />
          <input style={styles.input} name="password" type="password" placeholder="Lozinka"
            value={form.password} onChange={handleChange} required />
          <input style={styles.input} name="password2" type="password" placeholder="Potvrdi lozinku"
            value={form.password2} onChange={handleChange} required />
          <button style={styles.button} type="submit">Registruj se</button>
        </form>
        <p style={styles.link}>
          Već imate nalog? <Link to="/login" style={styles.a}>Prijavite se</Link>
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