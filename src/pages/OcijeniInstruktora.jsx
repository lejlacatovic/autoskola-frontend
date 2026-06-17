import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Toast, { useToast } from '../components/Toast';

export default function OcijeniInstruktora() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [instruktori, setInstruktori] = useState([]);
  const [odabraniInstruktor, setOdabraniInstruktor] = useState('');
  const [ocjena, setOcjena] = useState(0);
  const [greska, setGreska] = useState('');
  const { toasti, dodajToast, ukloniToast } = useToast();

  useEffect(() => {
    api.get('/auth/instruktori/')
      .then(r => setInstruktori(r.data))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGreska('');
    if (!odabraniInstruktor) {
      setGreska('Izaberite instruktora!');
      return;
    }
    if (ocjena === 0) {
      setGreska('Izaberite ocjenu!');
      return;
    }
    try {
      await api.post('/ocijeni-instruktora/', {
        instruktor_id: odabraniInstruktor,
        ocjena: ocjena,
      });
      dodajToast('Ocjena uspješno dodata! Hvala vam!', 'uspjeh');
      setOdabraniInstruktor('');
      setOcjena(0);
    } catch {
      dodajToast('Greška pri ocjenjivanju.', 'greska');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={{...styles.logo, cursor: 'pointer'}} onClick={() => navigate('/dashboard')}>
          <span style={styles.logoIcon}>🚗</span>
          <span style={styles.logoText}>DrivePro</span>
        </div>
        <div style={styles.headerRight}>
          <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Nazad</button>
          <button style={styles.logoutBtn} onClick={handleLogout}>Odjavi se</button>
        </div>
      </div>

      <div style={styles.content}>
        <h2 style={styles.title}>⭐ Ocijeni instruktora</h2>
        <div style={styles.card}>
          <form onSubmit={handleSubmit}>
            {greska && <p style={styles.greskaText}>{greska}</p>}

            <div style={styles.field}>
              <label style={styles.label}>Izaberi instruktora</label>
              <select
                style={styles.input}
                value={odabraniInstruktor}
                onChange={e => { setOdabraniInstruktor(e.target.value); setGreska(''); }}
              >
                <option value="">-- Izaberi --</option>
                {instruktori.map(i => (
                  <option key={i.id} value={i.id}>
                    {i.first_name} {i.last_name} (@{i.username})
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Ocjena</label>
              <div style={styles.zvjezdice}>
                {[1, 2, 3, 4, 5].map(n => (
                  <span
                    key={n}
                    style={{
                      ...styles.zvjezdica,
                      color: n <= ocjena ? '#f0c040' : '#333',
                    }}
                    onClick={() => { setOcjena(n); setGreska(''); }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p style={styles.ocjenaTekst}>
                {ocjena === 0 && 'Kliknite na zvjezdicu'}
                {ocjena === 1 && '1 — Loše'}
                {ocjena === 2 && '2 — Može bolje'}
                {ocjena === 3 && '3 — Dobro'}
                {ocjena === 4 && '4 — Vrlo dobro'}
                {ocjena === 5 && '5 — Odlično!'}
              </p>
            </div>

            <button style={styles.button} type="submit">
              Pošalji ocjenu
            </button>
          </form>
        </div>
      </div>
      <Toast toasti={toasti} ukloniToast={ukloniToast} />
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#ffffff' },
  header: {
    backgroundColor: '#111111', borderBottom: '2px solid #f0c040',
    padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  logo: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoIcon: { fontSize: '28px' },
  logoText: { fontSize: '22px', fontWeight: 'bold', color: '#f0c040' },
  headerRight: { display: 'flex', gap: '12px' },
  backBtn: {
    backgroundColor: 'transparent', border: '1px solid #888', color: '#888',
    padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px',
  },
  logoutBtn: {
    backgroundColor: 'transparent', border: '1px solid #f0c040', color: '#f0c040',
    padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px',
  },
  content: { padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  title: { color: '#f0c040', marginBottom: '24px', fontSize: '24px', alignSelf: 'flex-start' },
  card: {
    backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a',
    borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '500px',
  },
  field: { marginBottom: '24px' },
  label: { display: 'block', color: '#888', fontSize: '13px', marginBottom: '8px' },
  input: {
    width: '100%', padding: '12px', backgroundColor: '#2a2a2a',
    border: '1px solid #333', borderRadius: '8px', color: '#ffffff',
    fontSize: '14px', boxSizing: 'border-box',
  },
  zvjezdice: { display: 'flex', gap: '8px', marginBottom: '8px' },
  zvjezdica: { fontSize: '40px', cursor: 'pointer', transition: 'color 0.2s' },
  ocjenaTekst: { color: '#888', fontSize: '13px' },
  button: {
    width: '100%', padding: '12px', backgroundColor: '#f0c040',
    color: '#000000', border: 'none', borderRadius: '8px',
    fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
  },
  greskaText: { color: '#ff4444', marginBottom: '16px', fontSize: '14px' },
};