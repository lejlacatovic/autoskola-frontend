import { useState } from 'react';

export default function Tabs({ tabovi, defaultTab }) {
  const [aktivni, setAktivni] = useState(defaultTab || tabovi[0]?.id);

  const aktivniTab = tabovi.find(t => t.id === aktivni);

  return (
    <div style={styles.container}>
      <div style={styles.tabBar}>
        {tabovi.map(tab => (
          <button
            key={tab.id}
            style={{
              ...styles.tab,
              backgroundColor: aktivni === tab.id ? '#f0c040' : 'transparent',
              color: aktivni === tab.id ? '#000000' : '#888',
              borderBottom: aktivni === tab.id ? '2px solid #f0c040' : '2px solid transparent',
            }}
            onClick={() => setAktivni(tab.id)}
          >
            {tab.ikona && <span style={styles.ikona}>{tab.ikona}</span>}
            {tab.naziv}
          </button>
        ))}
      </div>
      <div style={styles.sadrzaj}>
        {aktivniTab?.sadrzaj}
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
  },
  tabBar: {
    display: 'flex',
    borderBottom: '1px solid #2a2a2a',
    marginBottom: '24px',
    gap: '4px',
  },
  tab: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px 8px 0 0',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s',
  },
  ikona: {
    fontSize: '16px',
  },
  sadrzaj: {
    width: '100%',
  },
};