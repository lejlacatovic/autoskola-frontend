import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Modal from '../components/Modal';
import Toast, { useToast } from '../components/Toast';

export default function InstruktorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [casovi, setCasovi] = useState([]);
  const [kandidati, setKandidati] = useState([]);
  const [korisnici, setKorisnici] = useState([]);
  const [modalCas, setModalCas] = useState(null);
  const [modalKandidat, setModalKandidat] = useState(null);
  const [napomena, setNapomena] = useState('');
  const { toasti, dodajToast, ukloniToast } = useToast();

  useEffect(() => {
    ucitajPodatke();
  }, []);

  const ucitajPodatke = () => {
    api.get('/casovi/').then(r => setCasovi(r.data)).catch(() => {});
    api.get('/napredak/').then(r => setKandidati(r.data)).catch(() => {});
    api.get('/auth/korisnici/').then(r => setKorisnici(r.data)).catch(() => {});
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleOznaciOdrzan = async (cas) => {
    try {
      await api.patch(`/casovi/${cas.id}/`, { status: 'odrzan' });
      dodajToast('Čas označen kao održan!', 'uspjeh');
      setModalCas(null);
      ucitajPodatke();
    } catch {
      dodajToast('Greška!', 'greska');
    }
  };

  const handleOtkaziCas = async (cas) => {
    try {
      await api.patch(`/casovi/${cas.id}/`, { status: 'slobodan' });
      dodajToast('Čas otkazan!', 'uspjeh');
      setModalCas(null);
      ucitajPodatke();
    } catch {
      dodajToast('Greška!', 'greska');
    }
  };

  const handleDodajNapomenu = async () => {
    try {
      await api.patch(`/casovi/${modalCas.id}/`, { napomena });
      dodajToast('Napomena dodana!', 'uspjeh');
      setModalCas(null);
      setNapomena('');
      ucitajPodatke();
    } catch {
      dodajToast('Greška!', 'greska');
    }
  };

  const formatDatum = (datum) => {
    const d = new Date(datum);
    return d.toLocaleDateString('sr-RS', {
      weekday: 'short', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getStatusBoja = (status) => {
    if (status === 'zakazan') return '#f0c040';
    if (status === 'odrzan') return '#44ff88';
    return '#888';
  };

  const getKandidat = (id) => korisnici.find(u => u.id === id);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={{...styles.logo, cursor: 'pointer'}} onClick={() => navigate('/instruktor')}>
          <span style={styles.logoIcon}>🚗</span>
          <span style={styles.logoText}>DrivePro</span>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.userName}>{user?.first_name || user?.username}</span>
          <span style={styles.roleBadge}>Instruktor</span>
          <button style={styles.rasporedBtn} onClick={() => navigate('/raspored')}>
            📆 Raspored
          </button>
          <button style={styles.adminBtn} onClick={() => navigate('/admin-panel')}>
            ⚙️ Admin panel
          </button>
          <button style={styles.logoutBtn} onClick={handleLogout}>Odjavi se</button>
        </div>
      </div>

      <div style={styles.welcome}>
        <h2 style={styles.welcomeTitle}>Instruktorski panel 👨‍🏫</h2>
        <p style={styles.welcomeSub}>
          Dobrodošli, <span style={styles.highlight}>{user?.first_name || user?.username}</span>!
        </p>
      </div>

      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{casovi.length}</div>
          <div style={styles.statLabel}>Ukupno časova</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{casovi.filter(c => c.status === 'zakazan').length}</div>
          <div style={styles.statLabel}>Zakazanih</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{casovi.filter(c => c.status === 'odrzan').length}</div>
          <div style={styles.statLabel}>Održanih</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{kandidati.length}</div>
          <div style={styles.statLabel}>Kandidata</div>
        </div>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
            <h3 style={{...styles.cardTitle, marginBottom: 0}}>📅 Svi časovi</h3>
            <button style={styles.zakaziBtn} onClick={() => navigate('/zakazi-cas')}>
              + Zakaži čas
            </button>
          </div>
          {casovi.length === 0 ? (
            <p style={styles.prazno}>Nema časova.</p>
          ) : (
            casovi.map(cas => (
              <div key={cas.id} style={styles.casRow}>
                <span style={styles.casTip}>
                  {cas.tip === 'voznja' ? '🚗' : '📚'}
                </span>
                <div style={{flex: 1, marginLeft: '8px'}}>
                  <div style={styles.casDatum}>{formatDatum(cas.datum_vreme)}</div>
                  {cas.napomena && (
                    <div style={styles.casNapomena}>📝 {cas.napomena}</div>
                  )}
                </div>
                <span style={{...styles.casStatus, color: getStatusBoja(cas.status)}}>
                  {cas.status}
                </span>
                <button
                  style={styles.casBtn}
                  onClick={() => { setModalCas(cas); setNapomena(cas.napomena || ''); }}
                >
                  ✏️
                </button>
              </div>
            ))
          )}
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>👥 Kandidati i napredak</h3>
          {kandidati.length === 0 ? (
            <p style={styles.prazno}>Nema kandidata.</p>
          ) : (
            kandidati.map(k => {
              const kandidat = getKandidat(k.kandidat);
              return (
                <div
                  key={k.id}
                  style={{...styles.kandidatRow, cursor: 'pointer'}}
                  onClick={() => setModalKandidat({...k, korisnik: kandidat})}
                >
                  <div style={styles.kandidatInfo}>
                    <span style={styles.kandidatIme}>
                      {kandidat?.first_name || 'Kandidat'} {kandidat?.last_name || ''}
                    </span>
                    <span style={styles.kandidatEmail}>{kandidat?.email || ''}</span>
                  </div>
                  <div style={styles.napredakInfo}>
                    <div style={styles.miniBar}>
                      <div style={{
                        ...styles.miniBarFill,
                        width: `${Math.round((k.teorija_odradjeno / k.teorija_ukupno) * 100)}%`
                      }}></div>
                    </div>
                    <span style={styles.napredakTekst}>
                      T: {k.teorija_odradjeno}/{k.teorija_ukupno} | V: {k.voznja_odradjeno}/{k.voznja_ukupno}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <Modal
        otvoren={!!modalCas}
        onZatvori={() => setModalCas(null)}
        title="Upravljanje časom"
      >
        {modalCas && (
          <div>
            <p style={{color: '#f0c040', marginBottom: '8px'}}>
              {modalCas.tip === 'voznja' ? '🚗 Vožnja' : '📚 Teorija'}
            </p>
            <p style={{color: '#888', fontSize: '14px', marginBottom: '16px'}}>
              {formatDatum(modalCas.datum_vreme)}
            </p>
            <p style={{color: '#888', fontSize: '13px', marginBottom: '4px'}}>Napomena:</p>
            <textarea
              style={{
                width: '100%', padding: '10px', backgroundColor: '#2a2a2a',
                border: '1px solid #333', borderRadius: '8px', color: '#fff',
                fontSize: '14px', marginBottom: '16px', height: '80px',
                resize: 'vertical', boxSizing: 'border-box'
              }}
              value={napomena}
              onChange={e => setNapomena(e.target.value)}
              placeholder="Unesite napomenu..."
            />
            <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
              <button
                style={{
                  padding: '10px', backgroundColor: 'transparent',
                  border: '1px solid #f0c040', color: '#f0c040',
                  borderRadius: '8px', cursor: 'pointer', fontSize: '13px'
                }}
                onClick={handleDodajNapomenu}
              >
                💾 Sačuvaj napomenu
              </button>
              {modalCas.status === 'zakazan' && (
                <button
                  style={{
                    padding: '10px', backgroundColor: '#44ff8822',
                    border: '1px solid #44ff88', color: '#44ff88',
                    borderRadius: '8px', cursor: 'pointer', fontSize: '13px'
                  }}
                  onClick={() => handleOznaciOdrzan(modalCas)}
                >
                  ✅ Označi kao održan
                </button>
              )}
              {modalCas.status === 'zakazan' && (
                <button
                  style={{
                    padding: '10px', backgroundColor: '#ff444422',
                    border: '1px solid #ff4444', color: '#ff4444',
                    borderRadius: '8px', cursor: 'pointer', fontSize: '13px'
                  }}
                  onClick={() => handleOtkaziCas(modalCas)}
                >
                  ❌ Otkaži čas
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        otvoren={!!modalKandidat}
        onZatvori={() => setModalKandidat(null)}
        title="Profil kandidata"
      >
        {modalKandidat && (
          <div>
            <div style={{
              width: '60px', height: '60px', borderRadius: '50%',
              backgroundColor: '#f0c040', color: '#000', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '24px', fontWeight: 'bold', margin: '0 auto 16px'
            }}>
              {modalKandidat.korisnik?.first_name?.[0] || '?'}
            </div>
            <p style={{color: '#ffffff', textAlign: 'center', fontSize: '18px', fontWeight: 'bold', marginBottom: '4px'}}>
              {modalKandidat.korisnik?.first_name} {modalKandidat.korisnik?.last_name}
            </p>
            <p style={{color: '#888', textAlign: 'center', fontSize: '13px', marginBottom: '24px'}}>
              {modalKandidat.korisnik?.email}
            </p>
            <div style={{backgroundColor: '#2a2a2a', borderRadius: '8px', padding: '16px'}}>
              <p style={{color: '#888', fontSize: '13px', marginBottom: '8px'}}>Teorija</p>
              <div style={{backgroundColor: '#1a1a1a', borderRadius: '4px', height: '8px', marginBottom: '8px', overflow: 'hidden'}}>
                <div style={{
                  backgroundColor: '#f0c040', height: '100%', borderRadius: '4px',
                  width: `${Math.round((modalKandidat.teorija_odradjeno / modalKandidat.teorija_ukupno) * 100)}%`
                }}></div>
              </div>
              <p style={{color: '#cccccc', fontSize: '13px', marginBottom: '16px'}}>
                {modalKandidat.teorija_odradjeno}/{modalKandidat.teorija_ukupno} časova
              </p>
              <p style={{color: '#888', fontSize: '13px', marginBottom: '8px'}}>Vožnja</p>
              <div style={{backgroundColor: '#1a1a1a', borderRadius: '4px', height: '8px', marginBottom: '8px', overflow: 'hidden'}}>
                <div style={{
                  backgroundColor: '#f0c040', height: '100%', borderRadius: '4px',
                  width: `${Math.round((modalKandidat.voznja_odradjeno / modalKandidat.voznja_ukupno) * 100)}%`
                }}></div>
              </div>
              <p style={{color: '#cccccc', fontSize: '13px', marginBottom: '16px'}}>
                {modalKandidat.voznja_odradjeno}/{modalKandidat.voznja_ukupno} časova
              </p>
              <p style={{color: '#888', fontSize: '13px'}}>
                Ocjena: <span style={{color: '#f0c040'}}>
                  {modalKandidat.ocena_instruktora ? `⭐ ${modalKandidat.ocena_instruktora}` : 'Nije ocijenjeno'}
                </span>
              </p>
            </div>
          </div>
        )}
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
  roleBadge: {
    backgroundColor: '#f0c040',
    color: '#000000',
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
  rasporedBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #f0c040',
    color: '#f0c040',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  adminBtn: {
    backgroundColor: '#ff444422',
    border: '1px solid #ff4444',
    color: '#ff4444',
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
  highlight: {
    color: '#f0c040',
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    padding: '0 32px 32px 32px',
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
  prazno: {
    color: '#888',
    fontSize: '14px',
  },
  zakaziBtn: {
    backgroundColor: '#f0c040',
    color: '#000000',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 'bold',
  },
  casRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #2a2a2a',
  },
  casTip: {
    fontSize: '18px',
  },
  casDatum: {
    color: '#cccccc',
    fontSize: '13px',
  },
  casNapomena: {
    color: '#888',
    fontSize: '11px',
    marginTop: '2px',
  },
  casStatus: {
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'capitalize',
    marginRight: '8px',
  },
  casBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #333',
    color: '#888',
    padding: '4px 8px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  kandidatRow: {
    padding: '12px 0',
    borderBottom: '1px solid #2a2a2a',
  },
  kandidatInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  kandidatIme: {
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  kandidatEmail: {
    color: '#888',
    fontSize: '12px',
  },
  napredakInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  miniBar: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: '4px',
    height: '6px',
    overflow: 'hidden',
  },
  miniBarFill: {
    backgroundColor: '#f0c040',
    height: '100%',
    borderRadius: '4px',
  },
  napredakTekst: {
    color: '#888',
    fontSize: '12px',
    whiteSpace: 'nowrap',
  },
};