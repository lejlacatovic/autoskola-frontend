import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [korisnici, setKorisnici] = useState([]);
  const [pretraga, setPretraga] = useState('');
  const [filterRole, setFilterRole] = useState('svi');
  const [poruka, setPoruka] = useState('');

  useEffect(() => {
    ucitajKorisnike();
  }, []);

  const ucitajKorisnike = () => {
    api.get('/auth/korisnici/')
      .then(r => setKorisnici(r.data))
      .catch(() => {});
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleObrisi = async (id) => {
    if (!window.confirm('Da li ste sigurni da želite obrisati ovog korisnika?')) return;
    try {
      await api.delete(`/auth/korisnici/${id}/`);
      setPoruka('Korisnik uspješno obrisan!');
      ucitajKorisnike();
      setTimeout(() => setPoruka(''), 3000);
    } catch {
      setPoruka('Greška pri brisanju korisnika.');
    }
  };

  const getRoleBoja = (role) => {
    if (role === 'instruktor') return '#f0c040';
    if (role === 'admin') return '#ff4444';
    return '#44ff88';
  };

  const filtrirani = korisnici.filter(k => {
    const matchPretraga =
      k.username.toLowerCase().includes(pretraga.toLowerCase()) ||
      (k.first_name && k.first_name.toLowerCase().includes(pretraga.toLowerCase())) ||
      (k.last_name && k.last_name.toLowerCase().includes(pretraga.toLowerCase())) ||
      (k.email && k.email.toLowerCase().includes(pretraga.toLowerCase()));
    const matchRole = filterRole === 'svi' || k.role === filterRole;
    return matchPretraga && matchRole;
  });

  return (
    <div style={styles.container}>
      <div style={styles.header}>
         <div style={{...styles.logo, cursor: 'pointer'}} onClick={() => navigate('/instruktor')} role="button">
          <span style={styles.logoIcon}>🚗</span>
          <span style={styles.logoText}>DrivePro</span>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.userName}>{user?.first_name || user?.username}</span>
          <span style={styles.adminBadge}>Admin</span>
          <button style={styles.backBtn} onClick={() => navigate('/instruktor')}>← Nazad</button>
          <button style={styles.logoutBtn} onClick={handleLogout}>Odjavi se</button>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.titleRow}>
          <h2 style={styles.title}>⚙️ Admin panel — Korisnici</h2>
        </div>

        {poruka && (
          <p style={{
            ...styles.poruka,
            color: poruka.includes('Greška') ? '#ff4444' : '#44ff88'
          }}>
            {poruka}
          </p>
        )}

        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{korisnici.length}</div>
            <div style={styles.statLabel}>Ukupno korisnika</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>
              {korisnici.filter(k => k.role === 'kandidat').length}
            </div>
            <div style={styles.statLabel}>Kandidata</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>
              {korisnici.filter(k => k.role === 'instruktor').length}
            </div>
            <div style={styles.statLabel}>Instruktora</div>
          </div>
        </div>

        <div style={styles.filterRow}>
          <input
            style={styles.searchInput}
            placeholder="🔍 Pretraži po imenu, username ili emailu..."
            value={pretraga}
            onChange={e => setPretraga(e.target.value)}
          />
          <select
            style={styles.filterSelect}
            value={filterRole}
            onChange={e => setFilterRole(e.target.value)}
          >
            <option value="svi">Sve uloge</option>
            <option value="kandidat">Kandidati</option>
            <option value="instruktor">Instruktori</option>
            <option value="admin">Admini</option>
          </select>
        </div>

        <p style={styles.rezultati}>
          Prikazano: {filtrirani.length} od {korisnici.length} korisnika
        </p>

        <div style={styles.tabela}>
          <div style={styles.tabelaHeader}>
            <span style={styles.kolona}>Korisnik</span>
            <span style={styles.kolona}>Email</span>
            <span style={styles.kolona}>Telefon</span>
            <span style={styles.kolona}>Uloga</span>
            <span style={styles.kolona}>Akcija</span>
          </div>
          {filtrirani.length === 0 ? (
            <div style={styles.prazno}>
              <p>Nema korisnika koji odgovaraju pretrazi.</p>
            </div>
          ) : (
            filtrirani.map(k => (
              <div key={k.id} style={styles.tabelaRed}>
                <span style={styles.kolona}>
                  <div style={styles.avatar}>
                    {k.first_name?.[0] || k.username?.[0]}
                  </div>
                  <div>
                    <div style={styles.ime}>{k.first_name} {k.last_name}</div>
                    <div style={styles.username}>@{k.username}</div>
                  </div>
                </span>
                <span style={styles.kolona}>
                  <span style={styles.tekst}>{k.email || '—'}</span>
                </span>
                <span style={styles.kolona}>
                  <span style={styles.tekst}>{k.phone || '—'}</span>
                </span>
                <span style={styles.kolona}>
                  <span style={{
                    ...styles.roleBadge,
                    backgroundColor: getRoleBoja(k.role) + '22',
                    color: getRoleBoja(k.role),
                    border: `1px solid ${getRoleBoja(k.role)}`
                  }}>
                    {k.role}
                  </span>
                </span>
                <span style={styles.kolona}>
                  <button
                    style={styles.obrisiBtn}
                    onClick={() => handleObrisi(k.id)}
                  >
                    Obriši
                  </button>
                </span>
              </div>
            ))
          )}
        </div>
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
    marginBottom: '24px',
  },
  title: {
    color: '#f0c040',
    fontSize: '24px',
  },
  poruka: {
    marginBottom: '16px',
    fontSize: '14px',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
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
  filterRow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '12px',
  },
  searchInput: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '14px',
  },
  filterSelect: {
    padding: '12px',
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '14px',
  },
  rezultati: {
    color: '#888',
    fontSize: '13px',
    marginBottom: '16px',
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
  },
  tabelaRed: {
    display: 'grid',
    gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr',
    padding: '16px 24px',
    borderBottom: '1px solid #2a2a2a',
    alignItems: 'center',
  },
  kolona: {
    color: '#888',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#f0c040',
    color: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  ime: {
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  username: {
    color: '#888',
    fontSize: '12px',
  },
  tekst: {
    color: '#cccccc',
    fontSize: '13px',
  },
  roleBadge: {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
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
  prazno: {
    color: '#888',
    textAlign: 'center',
    padding: '32px',
    fontSize: '14px',
  },
};