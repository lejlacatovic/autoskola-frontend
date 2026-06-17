import { useState, useRef, useEffect } from 'react';

export default function Combobox({ opcije, vrijednost, onChange, placeholder }) {
  const [otvoren, setOtvoren] = useState(false);
  const [pretraga, setPretraga] = useState('');
  const ref = useRef(null);

  const filtrirane = opcije.filter(o =>
    o.label.toLowerCase().includes(pretraga.toLowerCase())
  );

  const odabranaOpcija = opcije.find(o => o.value === vrijednost);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOtvoren(false);
        setPretraga('');
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleOdabir = (opcija) => {
    onChange(opcija.value);
    setOtvoren(false);
    setPretraga('');
  };

  return (
    <div ref={ref} style={styles.container}>
      <div
        style={{
          ...styles.input,
          borderColor: otvoren ? '#f0c040' : '#333',
        }}
        onClick={() => setOtvoren(!otvoren)}
      >
        {otvoren ? (
          <input
            style={styles.inputPretraga}
            placeholder="🔍 Pretraži..."
            value={pretraga}
            onChange={e => setPretraga(e.target.value)}
            autoFocus
            onClick={e => e.stopPropagation()}
          />
        ) : (
          <span style={odabranaOpcija ? styles.odabrano : styles.placeholder}>
            {odabranaOpcija ? odabranaOpcija.label : placeholder || 'Izaberi...'}
          </span>
        )}
        <span style={{...styles.strelica, transform: otvoren ? 'rotate(180deg)' : 'rotate(0deg)'}}>
          ▼
        </span>
      </div>

      {otvoren && (
        <div style={styles.dropdown}>
          <div style={styles.lista}>
            {filtrirane.length === 0 ? (
              <div style={styles.prazno}>Nema rezultata</div>
            ) : (
              filtrirane.map(opcija => (
                <div
                  key={opcija.value}
                  style={{
                    ...styles.stavka,
                    backgroundColor: opcija.value === vrijednost ? '#f0c04022' : 'transparent',
                    color: opcija.value === vrijednost ? '#f0c040' : '#ffffff',
                  }}
                  onClick={() => handleOdabir(opcija)}
                >
                  {opcija.label}
                  {opcija.value === vrijednost && <span style={styles.check}>✓</span>}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    zIndex: 100,
  },
  input: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#2a2a2a',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  odabrano: {
    color: '#ffffff',
  },
  placeholder: {
    color: '#888',
  },
  strelica: {
    color: '#888',
    fontSize: '11px',
    transition: 'transform 0.2s',
  },
  dropdown: {
    position: 'absolute',
    top: '48px',
    left: 0,
    right: 0,
    backgroundColor: '#1a1a1a',
    border: '1px solid #f0c040',
    borderRadius: '8px',
    zIndex: 1000,
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
  },
  pretraga: {
    width: '100%',
    padding: '10px 12px',
    backgroundColor: '#2a2a2a',
    border: 'none',
    borderBottom: '1px solid #333',
    color: '#ffffff',
    fontSize: '13px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  lista: {
    maxHeight: '200px',
    overflowY: 'auto',
  },
  stavka: {
    padding: '10px 12px',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'background-color 0.15s',
  },
  check: {
    color: '#f0c040',
    fontWeight: 'bold',
  },
  prazno: {
    padding: '12px',
    color: '#888',
    fontSize: '13px',
    textAlign: 'center',
  },
  inputPretraga: {
    flex: 1,
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
  },
};