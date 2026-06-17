import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Combobox from '../components/Combobox';
import Slider from '../components/Slider';
import RadioGroup from '../components/RadioGroup';
import Checkbox from '../components/Checkbox';
import Toast, { useToast } from '../components/Toast';

export default function ZakaziCas() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [instruktori, setInstruktori] = useState([]);
  const [kandidati, setKandidati] = useState([]);
  const [vozila, setVozila] = useState([]);
  const [prihvatioUslove, setPrihvatioUslove] = useState(false);
  const [form, setForm] = useState({
    instruktor: '',
    kandidat: '',
    tip: 'voznja',
    datum_vreme: '',
    trajanje_min: 60,
    napomena: '',
    vozilo: '',
  });
  const { toasti, dodajToast, ukloniToast } = useToast();

  useEffect(() => {
    api.get('/auth/instruktori/')
      .then(r => setInstruktori(r.data))
      .catch(() => {});
    api.get('/auth/korisnici/')
      .then(r => setKandidati(r.data.filter(k => k.role === 'kandidat')))
      .catch(() => {});
    api.get('/vozila/')
      .then(r => setVozila(r.data.filter(v => v.status === 'dostupan')))
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/casovi/', {
        ...form,
        kandidat: user?.role === 'instruktor' ? form.kandidat : user?.id,
        instruktor: user?.role === 'instruktor' ? user?.id : form.instruktor,
        status: 'zakazan',
      });
      dodajToast('Čas uspješno zakazan!', 'uspjeh');
      setTimeout(() => navigate(user?.role === 'instruktor' ? '/instruktor' : '/kalendar'), 2000);
    } catch {
      dodajToast('Greška pri zakazivanju časa.', 'greska');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={{...styles.logo, cursor: 'pointer'}} onClick={() => navigate(user?.role === 'instruktor' ? '/instruktor' : '/dashboard')}>
          <span style={styles.logoIcon}>🚗</span>
          <span style={styles.logoText}>DrivePro</span>
        </div>
        <div style={styles.headerRight}>
          <button style={styles.backBtn} onClick={() => navigate(user?.role === 'instruktor' ? '/instruktor' : '/dashboard')}>← Nazad</button>
          <button style={styles.logoutBtn} onClick={handleLogout}>Odjavi se</button>
        </div>
      </div>

      <div style={styles.content}>
        <h2 style={styles.title}>📅 Zakaži čas</h2>

        <div style={styles.card}>
          <form onSubmit={handleSubmit}>

            {user?.role === 'instruktor' ? (
              <div style={styles.field}>
                <label style={styles.label}>Kandidat</label>
                <Combobox
                  opcije={kandidati.map(k => ({
                    value: k.id,
                    label: `${k.first_name} ${k.last_name} (@${k.username})`
                  }))}
                  vrijednost={form.kandidat}
                  onChange={val => setForm({...form, kandidat: val})}
                  placeholder="Pretraži kandidata..."
                />
              </div>
            ) : (
              <div style={styles.field}>
                <label style={styles.label}>Instruktor</label>
                <Combobox
                  opcije={instruktori.map(i => ({
                    value: i.id,
                    label: `${i.first_name} ${i.last_name} (@${i.username})`
                  }))}
                  vrijednost={form.instruktor}
                  onChange={val => setForm({...form, instruktor: val})}
                  placeholder="Pretraži instruktora..."
                />
              </div>
            )}

            <div style={styles.field}>
              <RadioGroup
                label="Tip časa"
                vrijednost={form.tip}
                onChange={val => setForm({...form, tip: val})}
                opcije={[
                  { value: 'voznja', label: 'Vožnja', ikona: '🚗', opis: 'Praktična obuka vožnje' },
                  { value: 'teorija', label: 'Teorija', ikona: '📚', opis: 'Teorijska nastava' },
                ]}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Datum i vrijeme</label>
              <input
                style={styles.input}
                type="datetime-local"
                name="datum_vreme"
                value={form.datum_vreme}
                onChange={handleChange}
                required
              />
            </div>

            <div style={styles.field}>
              <Slider
                label="Trajanje časa (minuta)"
                min={30}
                max={120}
                vrijednost={form.trajanje_min}
                onChange={val => setForm({...form, trajanje_min: val})}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Vozilo (opciono)</label>
              <Combobox
                opcije={vozila.map(v => ({
                  value: v.id,
                  label: `${v.model} — ${v.tip_menjaca} (${v.kategorija})`
                }))}
                vrijednost={form.vozilo}
                onChange={val => setForm({...form, vozilo: val})}
                placeholder="Izaberi vozilo..."
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Napomena (opciono)</label>
              <textarea
                style={{...styles.input, height: '80px', resize: 'vertical'}}
                name="napomena"
                value={form.napomena}
                onChange={handleChange}
                placeholder="Unesite napomenu..."
              />
            </div>

            <Checkbox
              oznacen={prihvatioUslove}
              onChange={setPrihvatioUslove}
              label="Prihvatam uslove zakazivanja"
              opis="Čas se može otkazati najkasnije 24h unaprijed"
            />

            <button
              style={{
                ...styles.button,
                opacity: prihvatioUslove ? 1 : 0.5,
                cursor: prihvatioUslove ? 'pointer' : 'not-allowed',
              }}
              type="submit"
              disabled={!prihvatioUslove}
            >
              Zakaži čas
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
    maxWidth: '500px',
    overflow: 'visible',
  },
  field: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    color: '#888',
    fontSize: '13px',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#2a2a2a',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '14px',
    boxSizing: 'border-box',
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
    marginTop: '8px',
  },
};