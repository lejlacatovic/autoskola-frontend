import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Tabs from '../components/Tabs';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [korisnici, setKorisnici] = useState([]);
  const [casovi, setCasovi] = useState([]);
  const [vozila, setVozila] = useState([]);
  const [napredak, setNapredak] = useState([]);
  const [poruka, setPoruka] = useState('');

  useEffect(() => {
    api.get('/auth/korisnici/').then(r => setKorisnici(r.data)).catch(() => {});
    api.get('/casovi/').then(r => setCasovi(r.data)).catch(() => {});
    api.get('/vozila/').then(r => setVozila(r.data)).catch(() => {});
    api.get('/napredak/').then(r => setNapredak(r.data)).catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleObrisiKorisnika = async (id) => {
    if (!window.confirm('Obrisati korisnika?')) return;
    try {
      await api.delete(`/auth/korisnici/${id}/`);
      setKorisnici(korisnici.filter(k => k.id !== id));
      setPoruka('Korisnik obrisan!');
      setTimeout(() => setPoruka(''), 3000);
    } catch {
      setPoruka('Greška pri brisanju!');
    }
  };

  const handleStatusVozila = async (id, status) => {
    try {
      await api.patch(`/vozila/${id}/`, { status });
      setVozila(vozila.map(v => v.id === id ? {...v, status} : v));
      setPoruka('Status vozila promijenjen!');
      setTimeout(() => setPoruka(''), 3000);
    } catch {
      setPoruka('Greška!');
    }
  };

  const getStatusBoja = (status) => {
    if (status === 'dostupan') return '#44ff88';
    if (status === 'zauzet') return '#f0c040';
    return '#ff4444';
  };

  const formatDatum = (datum) => {
    const d = new Date(datum);
    return d.toLocaleDateString('sr-RS', {
      weekday: 'short', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const kandidati = korisnici.filter(k => k.role === 'kandidat');
  const instruktori = korisnici.filter(k => k.role === 'instruktor');

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={{...styles.logo, cursor: 'pointer'}} onClick={() => navigate('/admin-dashboard')}>
          <span style={styles.logoIcon}>🚗</span>
          <span style={styles.logoText}>DrivePro</span>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.userName}>{user?.first_name || user?.username}</span>
          <span style={styles.adminBadge}>Administrator</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Odjavi se</button>
        </div>
      </div>

      <div style={styles.content}>
        <h2 style={styles.title}>⚙️ Administrator panel</h2>

        {poruka && <p style={styles.poruka}>{poruka}</p>}

        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{kandidati.length}</div>
            <div style={styles.statLabel}>Kandidata</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{instruktori.length}</div>
            <div style={styles.statLabel}>Instruktora</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{casovi.length}</div>
            <div style={styles.statLabel}>Ukupno časova</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{casovi.filter(c => c.status === 'zakazan').length}</div>
            <div style={styles.statLabel}>Zakazanih časova</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{vozila.filter(v => v.status === 'dostupan').length}</div>
            <div style={styles.statLabel}>Dostupnih vozila</div>
          </div>
        </div>

        <Tabs
          tabovi={[
            {
              id: 'kandidati',
              naziv: 'Kandidati',
              ikona: '👥',
              sadrzaj: (
                <div style={styles.tabela}>
                  <div style={styles.tabelaHeader}>
                    <span>Kandidat</span>
                    <span>Email</span>
                    <span>Teorija</span>
                    <span>Vožnja</span>
                    <span>Akcija</span>
                  </div>
                  {kandidati.map(k => {
                    const nap = napredak.find(n => n.kandidat === k.id);
                    return (
                      <div key={k.id} style={styles.tabelaRed}>
                        <span style={styles.ime}>{k.first_name} {k.last_name}</span>
                        <span style={styles.tekst}>{k.email || '—'}</span>
                        <span style={styles.tekst}>
                          {nap ? `${nap.teorija_odradjeno}/${nap.teorija_ukupno}` : '0/10'}
                        </span>
                        <span style={styles.tekst}>
                          {nap ? `${nap.voznja_odradjeno}/${nap.voznja_ukupno}` : '0/40'}
                        </span>
                        <span>
                          <button style={styles.obrisiBtn} onClick={() => handleObrisiKorisnika(k.id)}>
                            Obriši
                          </button>
                        </span>
                      </div>
                    );
                  })}
                </div>
              )
            },
            {
              id: 'instruktori',
              naziv: 'Instruktori',
              ikona: '👨‍🏫',
              sadrzaj: (
                <div style={styles.tabela}>
                  <div style={styles.tabelaHeader}>
                    <span>Instruktor</span>
                    <span>Email</span>
                    <span>Telefon</span>
                    <span>Akcija</span>
                  </div>
                  {instruktori.map(i => (
                    <div key={i.id} style={styles.tabelaRed}>
                      <span style={styles.ime}>{i.first_name} {i.last_name}</span>
                      <span style={styles.tekst}>{i.email || '—'}</span>
                      <span style={styles.tekst}>{i.phone || '—'}</span>
                      <span>
                        <button style={styles.obrisiBtn} onClick={() => handleObrisiKorisnika(i.id)}>
                          Obriši
                        </button>
                      </span>
                    </div>
                  ))}
                </div>
              )
            },
            {
              id: 'casovi',
              naziv: 'Časovi',
              ikona: '📅',
              sadrzaj: (
                <div style={styles.tabela}>
                  <div style={styles.tabelaHeader}>
                    <span>Tip</span>
                    <span>Datum</span>
                    <span>Status</span>
                    <span>Trajanje</span>
                  </div>
                  {casovi.map(c => (
                    <div key={c.id} style={styles.tabelaRed}>
                      <span style={styles.tekst}>{c.tip === 'voznja' ? '🚗 Vožnja' : '📚 Teorija'}</span>
                      <span style={styles.tekst}>{formatDatum(c.datum_vreme)}</span>
                      <span style={{color: getStatusBoja(c.status), fontSize: '13px'}}>● {c.status}</span>
                      <span style={styles.tekst}>{c.trajanje_min} min</span>
                    </div>
                  ))}
                </div>
              )
            },
            {
              id: 'vozila',
              naziv: 'Vozila',
              ikona: '🚙',
              sadrzaj: (
                <div style={styles.grid}>
                  {vozila.map(v => (
                    <div key={v.id} style={styles.voziloCard}>
                      <div style={styles.voziloHeader}>
                        <span style={styles.voziloModel}>{v.model}</span>
                        <span style={{color: getStatusBoja(v.status), fontSize: '13px'}}>
                          ● {v.status}
                        </span>
                      </div>
                      <p style={styles.tekst}>Kategorija: {v.kategorija}</p>
                      <p style={styles.tekst}>Mjenjač: {v.tip_menjaca}</p>
                      <div style={styles.voziloAkcije}>
                        <button
                          style={{...styles.statusBtn, borderColor: '#44ff88', color: '#44ff88'}}
                          onClick={() => handleStatusVozila(v.id, 'dostupan')}
                        >
                          Dostupan
                        </button>
                        <button
                          style={{...styles.statusBtn, borderColor: '#f0c040', color: '#f0c040'}}
                          onClick={() => handleStatusVozila(v.id, 'zauzet')}
                        >
                          Zauzet
                        </button>
                        <button
                          style={{...styles.statusBtn, borderColor: '#ff4444', color: '#ff4444'}}
                          onClick={() => handleStatusVozila(v.id, 'servis')}
                        >
                          Servis
                        </button>
                      </div>
                    </div>
                  ))}
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
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userName: {
    color: '#cccccc',
    fontSize: '14px',
  },
  adminBadge: {
    backgroundColor: '#ff444422',
    color: '#ff4444',
    border: '1px solid #ff4444',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
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
    fontSize: '24px',
    marginBottom: '24px',
  },
  poruka: {
    color: '#44ff88',
    marginBottom: '16px',
    fontSize: '14px',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
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
  tabela: {
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid #2a2a2a',
  },
  tabelaHeader: {
    display: 'grid',
    gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr',
    padding: '16px 24px',
    backgroundColor: '#222222',
    borderBottom: '1px solid #2a2a2a',
    color: '#888',
    fontSize: '13px',
    gap: '8px',
  },
  tabelaRed: {
    display: 'grid',
    gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr',
    padding: '16px 24px',
    borderBottom: '1px solid #2a2a2a',
    alignItems: 'center',
    gap: '8px',
  },
  ime: {
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  tekst: {
    color: '#888',
    fontSize: '13px',
  },
  obrisiBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #ff4444',
    color: '#ff4444',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
  },
  voziloCard: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    padding: '20px',
  },
  voziloHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  voziloModel: {
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  voziloAkcije: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
  },
  statusBtn: {
    flex: 1,
    backgroundColor: 'transparent',
    border: '1px solid',
    padding: '6px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: 'bold',
  },
};