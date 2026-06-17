import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>🚗</span>
          <span style={styles.logoText}>DrivePro</span>
        </div>
        <div style={styles.headerBtns}>
          <button style={styles.loginBtn} onClick={() => navigate('/login')}>
            Prijava
          </button>
          <button style={styles.registerBtn} onClick={() => navigate('/register')}>
            Registracija
          </button>
        </div>
      </div>

      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroBadge}>🏆 #1 Auto škola u regionu</div>
        <h1 style={styles.heroTitle}>
          Naučite voziti sa <span style={styles.heroAccent}>DrivePro</span>
        </h1>
        <p style={styles.heroSub}>
          Profesionalni instruktori, moderna vozila i fleksibilno zakazivanje časova.
          Vaša bezbjednost je naš prioritet!
        </p>
        <div style={styles.heroBtns}>
          <button style={styles.heroCta} onClick={() => navigate('/register')}>
            Počnite danas 🚀
          </button>
          <button style={styles.heroSecondary} onClick={() => navigate('/login')}>
            Već imate nalog? Prijavite se
          </button>
        </div>
      </div>

      {/* Statistike */}
      <div style={styles.stats}>
        <div style={styles.statCard}>
          <div style={styles.statBroj}>15+</div>
          <div style={styles.statLabel}>Godine iskustva</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statBroj}>2000+</div>
          <div style={styles.statLabel}>Položenih kandidata</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statBroj}>98%</div>
          <div style={styles.statLabel}>Stopa prolaznosti</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statBroj}>10+</div>
          <div style={styles.statLabel}>Modernih vozila</div>
        </div>
      </div>

      {/* Usluge */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Šta nudimo?</h2>
        <div style={styles.grid}>
          <div style={styles.card}>
            <div style={styles.cardIcon}>🚗</div>
            <h3 style={styles.cardTitle}>Obuka vožnje</h3>
            <p style={styles.cardText}>
              Profesionalni instruktori sa višegodišnjim iskustvom. 
              Individualni pristup svakom kandidatu.
            </p>
          </div>
          <div style={styles.card}>
            <div style={styles.cardIcon}>📚</div>
            <h3 style={styles.cardTitle}>Teorijska nastava</h3>
            <p style={styles.cardText}>
              Moderna predavaonica sa interaktivnim materijalima. 
              Pripremite se za teorijski ispit sa lakoćom.
            </p>
          </div>
          <div style={styles.card}>
            <div style={styles.cardIcon}>📅</div>
            <h3 style={styles.cardTitle}>Online zakazivanje</h3>
            <p style={styles.cardText}>
              Zakažite čas u bilo koje vrijeme putem naše aplikacije. 
              Fleksibilno radno vrijeme 7 dana u sedmici.
            </p>
          </div>
          <div style={styles.card}>
            <div style={styles.cardIcon}>📈</div>
            <h3 style={styles.cardTitle}>Praćenje napretka</h3>
            <p style={styles.cardText}>
              Pratite svoj napredak u realnom vremenu. 
              Uvijek znajte koliko vam ostaje do polaganja.
            </p>
          </div>
          <div style={styles.card}>
            <div style={styles.cardIcon}>🚙</div>
            <h3 style={styles.cardTitle}>Moderna vozila</h3>
            <p style={styles.cardText}>
              Vozni park sa najnovijim modelima. 
              Manualni i automatski mjenjač dostupni.
            </p>
          </div>
          <div style={styles.card}>
            <div style={styles.cardIcon}>⭐</div>
            <h3 style={styles.cardTitle}>Ocjenjivanje</h3>
            <p style={styles.cardText}>
              Ocijenite svog instruktora i pomozite nam da se 
              stalno unapređujemo.
            </p>
          </div>
        </div>
      </div>

      {/* Radno vrijeme */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Radno vrijeme</h2>
        <div style={styles.radnoCard}>
          <div style={styles.radnoRow}>
            <span style={styles.radnoDan}>Ponedjeljak — Petak</span>
            <span style={styles.radnoVrijeme}>08:00 — 20:00</span>
          </div>
          <div style={styles.radnoRow}>
            <span style={styles.radnoDan}>Subota</span>
            <span style={styles.radnoVrijeme}>09:00 — 17:00</span>
          </div>
          <div style={styles.radnoRow}>
            <span style={styles.radnoDan}>Nedjelja</span>
            <span style={styles.radnoVrijeme}>10:00 — 14:00</span>
          </div>
        </div>
      </div>

      {/* Kontakt */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Kontakt</h2>
        <div style={styles.grid}>
          <div style={styles.kontaktCard}>
            <span style={styles.kontaktIcon}>📍</span>
            <div>
              <div style={styles.kontaktNaslov}>Adresa</div>
              <div style={styles.kontaktInfo}>Ulica bb, Tutin</div>
            </div>
          </div>
          <div style={styles.kontaktCard}>
            <span style={styles.kontaktIcon}>📞</span>
            <div>
              <div style={styles.kontaktNaslov}>Telefon</div>
              <div style={styles.kontaktInfo}>+387 61 123 456</div>
            </div>
          </div>
          <div style={styles.kontaktCard}>
            <span style={styles.kontaktIcon}>✉️</span>
            <div>
              <div style={styles.kontaktNaslov}>Email</div>
              <div style={styles.kontaktInfo}>info@drivepro.rs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <p style={styles.footerText}>© 2026 DrivePro Auto Škola. Sva prava zadržana.</p>
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
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
  },
  logoIcon: { fontSize: '28px' },
  logoText: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#f0c040',
  },
  headerBtns: {
    display: 'flex',
    gap: '12px',
  },
  loginBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #f0c040',
    color: '#f0c040',
    padding: '8px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  registerBtn: {
    backgroundColor: '#f0c040',
    border: 'none',
    color: '#000000',
    padding: '8px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  hero: {
    textAlign: 'center',
    padding: '80px 32px',
    background: 'linear-gradient(180deg, #111111 0%, #0a0a0a 100%)',
  },
  heroBadge: {
    display: 'inline-block',
    backgroundColor: '#f0c04022',
    color: '#f0c040',
    border: '1px solid #f0c040',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    marginBottom: '24px',
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '16px',
    lineHeight: 1.2,
  },
  heroAccent: {
    color: '#f0c040',
  },
  heroSub: {
    color: '#888',
    fontSize: '18px',
    maxWidth: '600px',
    margin: '0 auto 32px',
    lineHeight: 1.6,
  },
  heroBtns: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  heroCta: {
    backgroundColor: '#f0c040',
    color: '#000000',
    border: 'none',
    padding: '14px 32px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  heroSecondary: {
    backgroundColor: 'transparent',
    color: '#888',
    border: '1px solid #333',
    padding: '14px 32px',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '0',
    borderTop: '1px solid #222',
    borderBottom: '1px solid #222',
  },
  statCard: {
    padding: '40px 20px',
    textAlign: 'center',
    borderRight: '1px solid #222',
  },
  statBroj: {
    fontSize: '40px',
    fontWeight: 'bold',
    color: '#f0c040',
    marginBottom: '8px',
  },
  statLabel: {
    color: '#888',
    fontSize: '14px',
  },
  section: {
    padding: '64px 32px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  sectionTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: '40px',
    textAlign: 'center',
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
    transition: 'border-color 0.3s',
  },
  cardIcon: {
    fontSize: '36px',
    marginBottom: '16px',
  },
  cardTitle: {
    color: '#f0c040',
    fontSize: '18px',
    marginBottom: '12px',
  },
  cardText: {
    color: '#888',
    fontSize: '14px',
    lineHeight: 1.6,
  },
  radnoCard: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    padding: '24px',
    maxWidth: '500px',
    margin: '0 auto',
  },
  radnoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid #2a2a2a',
  },
  radnoDan: {
    color: '#cccccc',
    fontSize: '15px',
  },
  radnoVrijeme: {
    color: '#f0c040',
    fontSize: '15px',
    fontWeight: 'bold',
  },
  kontaktCard: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #2a2a2a',
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  kontaktIcon: {
    fontSize: '32px',
  },
  kontaktNaslov: {
    color: '#888',
    fontSize: '13px',
    marginBottom: '4px',
  },
  kontaktInfo: {
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  footer: {
    borderTop: '1px solid #222',
    padding: '24px 32px',
    textAlign: 'center',
  },
  footerText: {
    color: '#888',
    fontSize: '13px',
  },
};