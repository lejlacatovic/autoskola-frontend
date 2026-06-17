import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Toast, { useToast } from '../components/Toast';

export default function Profil() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const { toasti, dodajToast, ukloniToast } = useToast();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/auth/me/update/`, form);
      dodajToast('Profil uspješno ažuriran!', 'uspjeh');
    } catch {
      dodajToast('Greška pri ažuriranju profila.', 'greska');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={{...styles.logo, cursor: 'pointer'}} onClick={() => navigate('/dashboard')}>
          <span style={styles.logoIcon}>🚗</span>
          <span style={styles.logoText} onClick={() => navigate('/dashboard')} role="button">DrivePro</span>
        </div>
        <div style={styles.headerRight}>
          <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Nazad</button>
          <button style={styles.logoutBtn} onClick={handleLogout}>Odjavi se</button>
        </div>
      </div>

      <div style={styles.content}>
        <h2 style={styles.title}>👤 Moj profil</h2>

        <div style={styles.card}>
          <div style={styles.avatar}>
            {user?.first_name?.[0] || user?.username?.[0] || '?'}
          </div>
          <p style={styles.username}>@{user?.username}</p>
          <p style={styles.role}>{user?.role}</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>Ime</label>
                <input
                  style={styles.input}
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  placeholder="Ime"
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Prezime</label>
                <input
                  style={styles.input}
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  placeholder="Prezime"
                />
              </div>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input
                style={styles.input}
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Telefon</label>
              <input
                style={styles.input}
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Telefon"
              />
            </div>
            <button style={styles.button} type="submit">
              Sačuvaj izmjene
            </button>
          </form>
        </div>
      </div>
      <Toast toasti={toasti} ukloniToast={ukloniToast} />
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0a',
    color: '#ffffff',
  },
  header: {
    backgroundColor: '#111111',
    borderBottom: '2px solid #f0c040',
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoIcon: { fontSize: '28px' },
  logoText: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#f0c040',
  },
  headerRight: {
    display: 'flex',
    gap: '12px',
  },
  backBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #888',
    color: '#888',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #f0c040',
    color: '#f0c040',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  content: {
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    color: '#f0c040',
    marginBottom: '24px',
    fontSize: '24px',
    alignSelf: 'flex-start',
  },
  card: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    padding: '32px',
    width: '100%',
    maxWidth: '600px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#f0c040',
    color: '#000000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '16px',
  },
  username: {
    color: '#888',
    fontSize: '14px',
    marginBottom: '4px',
  },
  role: {
    color: '#f0c040',
    fontSize: '13px',
    textTransform: 'capitalize',
    marginBottom: '24px',
  },
  form: {
    width: '100%',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '0px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '16px',
  },
  label: {
    color: '#888',
    fontSize: '13px',
    marginBottom: '6px',
  },
  input: {
    padding: '12px',
    backgroundColor: '#2a2a2a',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '14px',
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
    marginTop: '8px',
  },
  uspjeh: {
    color: '#44ff88',
    marginBottom: '16px',
    fontSize: '14px',
  },
  greska: {
    color: '#ff4444',
    marginBottom: '16px',
    fontSize: '14px',
  },
};