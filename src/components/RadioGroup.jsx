export default function RadioGroup({ opcije, vrijednost, onChange, label }) {
  return (
    <div style={styles.container}>
      {label && <p style={styles.label}>{label}</p>}
      <div style={styles.grupa}>
        {opcije.map(opcija => (
          <div
            key={opcija.value}
            style={styles.opcija}
            onClick={() => onChange(opcija.value)}
          >
            <div style={{
              ...styles.krug,
              borderColor: vrijednost === opcija.value ? '#f0c040' : '#555',
            }}>
              {vrijednost === opcija.value && (
                <div style={styles.krugUnutra} />
              )}
            </div>
            <div>
              <span style={{
                ...styles.opcijaLabel,
                color: vrijednost === opcija.value ? '#f0c040' : '#cccccc',
              }}>
                {opcija.ikona && <span style={styles.ikona}>{opcija.ikona}</span>}
                {opcija.label}
              </span>
              {opcija.opis && (
                <p style={styles.opis}>{opcija.opis}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    marginBottom: '16px',
  },
  label: {
    color: '#888',
    fontSize: '13px',
    marginBottom: '10px',
  },
  grupa: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  opcija: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#2a2a2a',
    borderRadius: '8px',
    cursor: 'pointer',
    border: '1px solid #333',
    transition: 'border-color 0.2s',
  },
  krug: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'border-color 0.2s',
  },
  krugUnutra: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: '#f0c040',
  },
  opcijaLabel: {
    fontSize: '14px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  ikona: {
    fontSize: '16px',
  },
  opis: {
    color: '#888',
    fontSize: '12px',
    marginTop: '2px',
  },
};