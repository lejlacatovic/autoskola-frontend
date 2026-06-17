import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Raspored() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [casovi, setCasovi] = useState([]);
  const [odabraniDatum, setOdabraniDatum] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [korisnici, setKorisnici] = useState([]);

  useEffect(() => {
    api.get('/casovi/').then(r => setCasovi(r.data)).catch(() => {});
    api.get('/auth/korisnici/').then(r => setKorisnici(r.data)).catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getKorisnik = (id) => korisnici.find(u => u.id === id);

  const getStatusBoja = (status) => {
    if (status === 'zakazan') return '#f0c040';
    if (status === 'odrzan') return '#44ff88';
    return '#888';
  };

  const filtrirani = casovi.filter(cas => {
    const datum = new Date(cas.datum_vreme).toISOString().split('T')[0];
    return datum === odabraniDatum;
  }).sort((a, b) => new Date(a.datum_vreme) - new Date(b.datum_vreme));

  const formatVrijeme = (datum) => {
    const d = new Date(datum);
    return d.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDatum = (datum) => {
    const d = new Date(datum);
    return d.toLocaleDateString('sr-RS', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const goBack = () => {
    if (user?.role === 'instruktor') navigate('/instruktor');
    else if (user?.role === 'administrator' || user?.role === 'admin') navigate('/admin-dashboard');
    else navigate('/dashboard');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={{...styles.logo, cursor: 'pointer'}} onClick={goBack}>
          <span style={styles.logoIcon}>🚗</span>
          <span style={styles.logoText}>DrivePro</span>
        </div>
        <div style={styles.headerRight}>
          <button style={styles.backBtn} onClick={goBack}>← Nazad</button>
          <button style={styles.logoutBtn} onClick={handleLogout}>Odjavi se</button>
        </div>
      </div>

      <div style={styles.content}>
        <h2 style={styles.title}>📆 Raspored po datumu</h2>

        <div style={styles.datumWrap}>
          <input
            type="date"
            style={styles.datumInput}
            value={odabraniDatum}
            onChange={e => setOdabraniDatum(e.target.value)}
          />
          <p style={styles.odabraniDatum}>{formatDatum(odabraniDatum + 'T12:00:00')}</p>
        </div>

        {filtrirani.length === 0 ? (
          <div style={styles.prazno}>
            <p style={styles.praznoIkona}>📭</p>
            <p>Nema časova za ovaj datum.</p>
          </div>
        ) : (
          <div style={styles.lista}>
            {filtrirani.map(cas => {
              const kandidat = getKorisnik(cas.kandidat);
              const instruktor = getKorisnik(cas.instruktor);
              return (
                <div key={cas.id} style={styles.casCard}>
                  <div style={styles.vrijemeKolona}>
                    <div style={styles.vrijemeTekst}>{formatVrijeme(cas.datum_vreme)}</div>
                    <div style={styles.trajanje}>{cas.trajanje_min} min</div>
                  </div>
                  <div style={styles.linija}></div>
                  <div style={styles.casInfo}>
                    <div style={styles.casHeader}>
                      <span style={styles.casTip}>
                        {cas.tip === 'voznja' ? '🚗 Vožnja' : '📚 Teorija'}
                      </span>
                      <span style={{...styles.casStatus, color: getStatusBoja(cas.status)}}>
                        ● {cas.status}
                      </span>
                    </div>
                    {kandidat && (
                      <p style={styles.casOsoba}>
                        👤 Kandidat: <span style={styles.casOsobaIme}>{kandidat.first_name} {kandidat.last_name}</span>
                      </p>
                    )}
                    {instruktor && (
                      <p style={styles.casOsoba}>
                        👨‍🏫 Instruktor: <span style={styles.casOsobaIme}>{instruktor.first_name} {instruktor.last_name}</span>
                      </p>
                    )}
                    {cas.napomena && (
                      <p style={styles.casNapomena}>📝 {cas.napomena}</p>
                    )}
                  </div>
                </div>
              );
            })}
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
    fontSize: '24px',
    marginBottom: '24px',
  },
  datumWrap: {
    marginBottom: '32px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },
  datumInput: {
    padding: '12px',
    backgroundColor: '#1a1a1a',
    border: '1px solid #f0c040',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '16px',
    cursor: 'pointer',
  },
  odabraniDatum: {
    color: '#888',
    fontSize: '14px',
    textTransform: 'capitalize',
  },
  prazno: {
    textAlign: 'center',
    padding: '64px',
    color: '#888',
  },
  praznoIkona: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  lista: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  casCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    backgroundColor: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    padding: '20px',
  },
  vrijemeKolona: {
    textAlign: 'center',
    minWidth: '60px',
  },
  vrijemeTekst: {
    color: '#f0c040',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  trajanje: {
    color: '#888',
    fontSize: '11px',
    marginTop: '4px',
  },
  linija: {
    width: '2px',
    backgroundColor: '#2a2a2a',
    alignSelf: 'stretch',
    minHeight: '40px',
  },
  casInfo: {
    flex: 1,
  },
  casHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  casTip: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '15px',
  },
  casStatus: {
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  casOsoba: {
    color: '#888',
    fontSize: '13px',
    marginBottom: '4px',
  },
  casOsobaIme: {
    color: '#cccccc',
    fontWeight: 'bold',
  },
  casNapomena: {
    color: '#888',
    fontSize: '12px',
    fontStyle: 'italic',
    marginTop: '8px',
  },
};