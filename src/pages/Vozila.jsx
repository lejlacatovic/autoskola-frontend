import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Vozila() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [vozila, setVozila] = useState([]);

  useEffect(() => {
    api.get('/vozila/')
      .then(r => setVozila(r.data))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusBoja = (status) => {
    if (status === 'dostupan') return '#44ff88';
    if (status === 'zauzet') return '#f0c040';
    return '#ff4444';
  };

  const getStatusTekst = (status) => {
    if (status === 'dostupan') return 'Dostupan';
    if (status === 'zauzet') return 'Zauzet';
    return 'Na servisu';
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
        <h2 style={styles.title}>🚙 Vozila</h2>

        {vozila.length === 0 ? (
          <div style={styles.empty}>
            <p>Nema dostupnih vozila.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {vozila.map(vozilo => (
              <div key={vozilo.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={styles.voziloIkon}>🚗</span>
                  <span style={{
                    ...styles.status,
                    color: getStatusBoja(vozilo.status)
                  }}>
                    ● {getStatusTekst(vozilo.status)}
                  </span>
                </div>
                <h3 style={styles.voziloModel}>{vozilo.model}</h3>
                <div style={styles.info}>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Kategorija:</span>
                    <span style={styles.infoValue}>{vozilo.kategorija}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Mjenjač:</span>
                    <span style={styles.infoValue}>{vozilo.tip_menjaca}</span>
                  </div>
                  {vozilo.napomena_statusa && (
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>Napomena:</span>
                      <span style={styles.infoValue}>{vozilo.napomena_statusa}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
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
  },
  title: {
    color: '#f0c040',
    marginBottom: '24px',
    fontSize: '24px',
  },
  empty: {
    color: '#888',
    textAlign: 'center',
    padding: '48px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    padding: '24px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  voziloIkon: {
    fontSize: '32px',
  },
  status: {
    fontSize: '13px',
    fontWeight: 'bold',
  },
  voziloModel: {
    color: '#ffffff',
    fontSize: '18px',
    marginBottom: '16px',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  infoLabel: {
    color: '#888',
    fontSize: '13px',
  },
  infoValue: {
    color: '#ffffff',
    fontSize: '13px',
  },
};