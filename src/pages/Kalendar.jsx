import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Modal from '../components/Modal';
import Toast, { useToast } from '../components/Toast';

export default function Kalendar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [casovi, setCasovi] = useState([]);
  const [modalOtvoren, setModalOtvoren] = useState(false);
  const [odabraniCas, setOdabraniCas] = useState(null);
  const { toasti, dodajToast, ukloniToast } = useToast();

  useEffect(() => {
    ucitajCasove();
  }, []);

  const ucitajCasove = () => {
    api.get('/casovi/')
      .then(r => setCasovi(r.data))
      .catch(() => {});
  };

  const handleOtkazi = (cas) => {
    setOdabraniCas(cas);
    setModalOtvoren(true);
  };

  const potvrdiOtkaz = async () => {
    try {
      await api.patch(`/casovi/${odabraniCas.id}/`, { status: 'slobodan' });
      dodajToast('Čas uspješno otkazan!', 'uspjeh');
      setModalOtvoren(false);
      setOdabraniCas(null);
      ucitajCasove();
    } catch {
      dodajToast('Greška pri otkazivanju časa.', 'greska');
      setModalOtvoren(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusBoja = (status) => {
    if (status === 'zakazan') return '#f0c040';
    if (status === 'odrzan') return '#44ff88';
    return '#888';
  };

  const formatDatum = (datum) => {
    const d = new Date(datum);
    return d.toLocaleDateString('sr-RS', {
      weekday: 'long', year: 'numeric',
      month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
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
        <div style={styles.titleRow}>
          <h2 style={styles.title}>📅 Kalendar časova</h2>
          <button style={styles.zakaziBtn} onClick={() => navigate('/zakazi-cas')}>
            + Zakaži čas
          </button>
        </div>

        {casovi.length === 0 ? (
          <div style={styles.empty}>
            <p>Nema zakazanih časova.</p>
          </div>
        ) : (
          <div style={styles.lista}>
            {casovi.map(cas => (
              <div key={cas.id} style={styles.casCard}>
                <div style={styles.casHeader}>
                  <span style={styles.casTip}>
                    {cas.tip === 'voznja' ? '🚗 Vožnja' : '📚 Teorija'}
                  </span>
                  <span style={{...styles.casStatus, color: getStatusBoja(cas.status)}}>
                    ● {cas.status}
                  </span>
                </div>
                <p style={styles.casDatum}>{formatDatum(cas.datum_vreme)}</p>
                <p style={styles.casInfo}>Trajanje: {cas.trajanje_min} min</p>
                {cas.napomena && (
                  <p style={styles.casNapomena}>Napomena: {cas.napomena}</p>
                )}
                {cas.status === 'zakazan' && (
                  <button
                    style={styles.otkaziBtn}
                    onClick={() => handleOtkazi(cas)}
                  >
                    Otkaži čas
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        otvoren={modalOtvoren}
        onZatvori={() => setModalOtvoren(false)}
        title="Otkaži čas"
      >
        <p style={{color: '#cccccc', marginBottom: '16px'}}>
          Da li ste sigurni da želite otkazati ovaj čas?
        </p>
        {odabraniCas && (
          <div style={{backgroundColor: '#2a2a2a', borderRadius: '8px', padding: '16px', marginBottom: '24px'}}>
            <p style={{color: '#f0c040', marginBottom: '8px'}}>
              {odabraniCas.tip === 'voznja' ? '🚗 Vožnja' : '📚 Teorija'}
            </p>
            <p style={{color: '#888', fontSize: '14px'}}>
              {formatDatum(odabraniCas.datum_vreme)}
            </p>
          </div>
        )}
        <div style={{display: 'flex', gap: '12px'}}>
          <button
            style={{
              flex: 1, padding: '12px', backgroundColor: 'transparent',
              border: '1px solid #888', color: '#888', borderRadius: '8px',
              cursor: 'pointer', fontSize: '14px'
            }}
            onClick={() => setModalOtvoren(false)}
          >
            Odustani
          </button>
          <button
            style={{
              flex: 1, padding: '12px', backgroundColor: '#ff4444',
              border: 'none', color: '#ffffff', borderRadius: '8px',
              cursor: 'pointer', fontSize: '14px', fontWeight: 'bold'
            }}
            onClick={potvrdiOtkaz}
          >
            Otkaži čas
          </button>
        </div>
      </Modal>

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
    cursor: 'pointer',
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
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    color: '#f0c040',
    fontSize: '24px',
  },
  zakaziBtn: {
    backgroundColor: '#f0c040',
    color: '#000000',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  empty: {
    color: '#888',
    textAlign: 'center',
    padding: '48px',
  },
  lista: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '16px',
  },
  casCard: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    padding: '20px',
  },
  casHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  casTip: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  casStatus: {
    fontSize: '13px',
    textTransform: 'capitalize',
    fontWeight: 'bold',
  },
  casDatum: {
    color: '#f0c040',
    fontSize: '14px',
    marginBottom: '8px',
  },
  casInfo: {
    color: '#888',
    fontSize: '13px',
    marginBottom: '4px',
  },
  casNapomena: {
    color: '#888',
    fontSize: '13px',
    fontStyle: 'italic',
    marginBottom: '8px',
  },
  otkaziBtn: {
    marginTop: '12px',
    backgroundColor: 'transparent',
    border: '1px solid #ff4444',
    color: '#ff4444',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    width: '100%',
  },
};