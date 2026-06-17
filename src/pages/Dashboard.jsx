import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api/axios';
import Tabs from '../components/Tabs';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [napredak, setNapredak] = useState(null);
  const [nadolazeci, setNadolazeci] = useState([]);
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => {
    api.get('/napredak/')
      .then(r => {
        const moj = r.data.find(n => n.kandidat === user?.id);
        setNapredak(moj);
      })
      .catch(() => {});

    api.get('/auth/nadolazeci-casovi/')
      .then(r => setNadolazeci(r.data))
      .catch(() => {});
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const teorijaProcent = napredak
    ? Math.round((napredak.teorija_odradjeno / napredak.teorija_ukupno) * 100)
    : 0;

  const voznjaProcent = napredak
    ? Math.round((napredak.voznja_odradjeno / napredak.voznja_ukupno) * 100)
    : 0;

  const formatDatum = (datum) => {
    const d = new Date(datum);
    return d.toLocaleDateString('sr-RS', {
      weekday: 'long', month: 'long', day: 'numeric',
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
          <div style={styles.notifWrap}>
            <button style={styles.notifBtn} onClick={() => setShowNotif(!showNotif)}>
              🔔 {nadolazeci.length > 0 && (
                <span style={styles.badge}>{nadolazeci.length}</span>
              )}
            </button>
            {showNotif && (
              <div style={styles.notifDropdown}>
                <h4 style={styles.notifTitle}>Nadolazeći časovi</h4>
                {nadolazeci.length === 0 ? (
                  <p style={styles.notifPrazno}>Nema nadolazećih časova</p>
                ) : (
                  nadolazeci.map(cas => (
                    <div key={cas.id} style={styles.notifItem}>
                      <span style={styles.notifTip}>
                        {cas.tip === 'voznja' ? '🚗' : '📚'}
                      </span>
                      <span style={styles.notifDatum}>{formatDatum(cas.datum_vreme)}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <span style={styles.userName}>{user?.first_name || user?.username}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Odjavi se</button>
        </div>
      </div>

      <div style={styles.welcome}>
        <h2 style={styles.welcomeTitle}>Dobrodošli, {user?.first_name || user?.username}! 👋</h2>
        <p style={styles.welcomeSub}>Uloga: <span style={styles.role}>{user?.role}</span></p>
      </div>

      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{napredak?.teorija_odradjeno ?? 0}</div>
          <div style={styles.statLabel}>Teorija odradjeno</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{napredak?.voznja_odradjeno ?? 0}</div>
          <div style={styles.statLabel}>Vožnja odradjeno</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{teorijaProcent}%</div>
          <div style={styles.statLabel}>Teorija napredak</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{voznjaProcent}%</div>
          <div style={styles.statLabel}>Vožnja napredak</div>
        </div>
      </div>

      <div style={styles.tabsWrap}>
        <Tabs
          tabovi={[
            {
              id: 'pregled',
              naziv: 'Pregled',
              ikona: '🏠',
              sadrzaj: (
                <div style={styles.grid}>
                  <div style={styles.card}>
                    <h3 style={styles.cardTitle}>📅 Kalendar časova</h3>
                    <p style={styles.cardText}>Naredni čas: <span style={styles.highlight}>
                      {nadolazeci.length > 0 ? formatDatum(nadolazeci[0].datum_vreme) : 'Nema zakazanih'}
                    </span></p>
                    <p style={styles.cardText}>Tip: <span style={styles.highlight}>
                      {nadolazeci.length > 0 ? (nadolazeci[0].tip === 'voznja' ? 'Vožnja' : 'Teorija') : '-'}
                    </span></p>
                    <button style={styles.cardBtn} onClick={() => navigate('/kalendar')}>Zakažite čas</button>
                  </div>

                  <div style={styles.card}>
                    <h3 style={styles.cardTitle}>📈 Napredak</h3>
                    <p style={styles.cardText}>Teorija</p>
                    <div style={styles.progressBar}>
                      <div style={{...styles.progressFill, width: `${teorijaProcent}%`}}></div>
                    </div>
                    <p style={styles.cardText}>
                      {napredak ? `${napredak.teorija_odradjeno}/${napredak.teorija_ukupno} časova` : '0/10 časova'}
                    </p>
                    <p style={styles.cardText}>Vožnja</p>
                    <div style={styles.progressBar}>
                      <div style={{...styles.progressFill, width: `${voznjaProcent}%`}}></div>
                    </div>
                    <p style={styles.cardText}>
                      {napredak ? `${napredak.voznja_odradjeno}/${napredak.voznja_ukupno} časova` : '0/40 časova'}
                    </p>
                    <button style={styles.cardBtn} onClick={() => navigate('/kalendar')}>Detalji</button>
                  </div>

                  <div style={styles.card}>
                    <h3 style={styles.cardTitle}>🚙 Vozila</h3>
                    <p style={styles.cardText}>VW Golf 7 — <span style={{color: '#44ff88'}}>Dostupan</span></p>
                    <p style={styles.cardText}>Škoda Octavia — <span style={{color: '#44ff88'}}>Dostupan</span></p>
                    <button style={styles.cardBtn} onClick={() => navigate('/vozila')}>Sva vozila</button>
                  </div>

                  <div style={styles.card}>
                    <h3 style={styles.cardTitle}>👤 Profil</h3>
                    <p style={styles.cardText}>Email: <span style={styles.highlight}>{user?.email || 'Nije uneseno'}</span></p>
                    <p style={styles.cardText}>Telefon: <span style={styles.highlight}>{user?.phone || 'Nije uneseno'}</span></p>
                    <p style={styles.cardText}>Uloga: <span style={styles.highlight}>{user?.role}</span></p>
                    <button style={styles.cardBtn} onClick={() => navigate('/profil')}>Uredi profil</button>
                    <button style={{...styles.cardBtn, marginTop: '8px'}} onClick={() => navigate('/ocijeni-instruktora')}>
                      ⭐ Ocijeni instruktora
                    </button>
                  </div>
                </div>
              )
            },
            {
              id: 'napredak',
              naziv: 'Napredak',
              ikona: '📈',
              sadrzaj: (
                <div style={styles.card}>
                  <h3 style={styles.cardTitle}>📈 Detaljan napredak</h3>
                  <p style={styles.cardText}>Teorija</p>
                  <div style={styles.progressBar}>
                    <div style={{...styles.progressFill, width: `${teorijaProcent}%`}}></div>
                  </div>
                  <p style={styles.cardText}>{teorijaProcent}% — {napredak?.teorija_odradjeno ?? 0}/{napredak?.teorija_ukupno ?? 10} časova</p>
                  <p style={styles.cardText}>Vožnja</p>
                  <div style={styles.progressBar}>
                    <div style={{...styles.progressFill, width: `${voznjaProcent}%`}}></div>
                  </div>
                  <p style={styles.cardText}>{voznjaProcent}% — {napredak?.voznja_odradjeno ?? 0}/{napredak?.voznja_ukupno ?? 40} časova</p>
                  <p style={styles.cardText}>Ocjena instruktora: <span style={styles.highlight}>
                    {napredak?.ocena_instruktora ? `⭐ ${napredak.ocena_instruktora}` : 'Nije ocijenjeno'}
                  </span></p>
                </div>
              )
            },
            {
              id: 'casovi',
              naziv: 'Časovi',
              ikona: '📅',
              sadrzaj: (
                <div style={styles.card}>
                  <h3 style={styles.cardTitle}>📅 Nadolazeći časovi</h3>
                  {nadolazeci.length === 0 ? (
                    <p style={styles.cardText}>Nema nadolazećih časova.</p>
                  ) : (
                    nadolazeci.map(cas => (
                      <div key={cas.id} style={{padding: '12px 0', borderBottom: '1px solid #2a2a2a'}}>
                        <p style={{color: '#f0c040', fontSize: '14px', marginBottom: '4px'}}>
                          {cas.tip === 'voznja' ? '🚗 Vožnja' : '📚 Teorija'}
                        </p>
                        <p style={{color: '#888', fontSize: '13px'}}>{formatDatum(cas.datum_vreme)}</p>
                      </div>
                    ))
                  )}
                  <button style={{...styles.cardBtn, marginTop: '16px'}} onClick={() => navigate('/kalendar')}>
                    Svi časovi
                  </button>
                </div>
              )
            },
          ]}
        />
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
    cursor: 'pointer',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  notifWrap: {
    position: 'relative',
  },
  notifBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #333',
    color: '#ffffff',
    padding: '8px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    position: 'relative',
  },
  badge: {
    backgroundColor: '#ff4444',
    color: '#ffffff',
    borderRadius: '50%',
    padding: '2px 6px',
    fontSize: '11px',
    fontWeight: 'bold',
    marginLeft: '4px',
  },
  notifDropdown: {
    position: 'absolute',
    top: '48px',
    right: '0',
    backgroundColor: '#1a1a1a',
    border: '1px solid #f0c040',
    borderRadius: '12px',
    padding: '16px',
    minWidth: '280px',
    zIndex: 100,
  },
  notifTitle: {
    color: '#f0c040',
    marginBottom: '12px',
    fontSize: '14px',
  },
  notifPrazno: {
    color: '#888',
    fontSize: '13px',
  },
  notifItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 0',
    borderBottom: '1px solid #2a2a2a',
  },
  notifTip: {
    fontSize: '18px',
  },
  notifDatum: {
    color: '#cccccc',
    fontSize: '13px',
  },
  userName: {
    color: '#cccccc',
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
  welcome: {
    padding: '32px 32px 0 32px',
  },
  welcomeTitle: {
    fontSize: '24px',
    marginBottom: '8px',
  },
  welcomeSub: {
    color: '#888',
    fontSize: '14px',
  },
  role: {
    color: '#f0c040',
    textTransform: 'capitalize',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
    padding: '24px 32px',
  },
  statCard: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #f0c040',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#f0c040',
  },
  statLabel: {
    fontSize: '12px',
    color: '#888',
    marginTop: '4px',
  },
  tabsWrap: {
    padding: '0 32px 32px 32px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    padding: '24px',
  },
  cardTitle: {
    color: '#f0c040',
    marginBottom: '16px',
    fontSize: '16px',
  },
  cardText: {
    color: '#888',
    fontSize: '14px',
    marginBottom: '8px',
  },
  highlight: {
    color: '#ffffff',
  },
  progressBar: {
    backgroundColor: '#2a2a2a',
    borderRadius: '4px',
    height: '8px',
    marginBottom: '12px',
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: '#f0c040',
    height: '100%',
    borderRadius: '4px',
  },
  cardBtn: {
    marginTop: '12px',
    backgroundColor: 'transparent',
    border: '1px solid #f0c040',
    color: '#f0c040',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    width: '100%',
  },
};