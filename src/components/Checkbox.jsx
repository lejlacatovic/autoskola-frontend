export default function Checkbox({ oznacen, onChange, label, opis }) {
  return (
    <div style={styles.container} onClick={() => onChange(!oznacen)}>
      <div style={{
        ...styles.kvadrat,
        borderColor: oznacen ? '#f0c040' : '#555',
        backgroundColor: oznacen ? '#f0c040' : 'transparent',
      }}>
        {oznacen && <span style={styles.kvacica}>✓</span>}
      </div>
      <div>
        <span style={{
          ...styles.label,
          color: oznacen ? '#f0c040' : '#cccccc',
        }}>
          {label}
        </span>
        {opis && <p style={styles.opis}>{opis}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#2a2a2a',
    borderRadius: '8px',
    cursor: 'pointer',
    border: '1px solid #333',
    marginBottom: '8px',
    transition: 'border-color 0.2s',
  },
  kvadrat: {
    width: '20px',
    height: '20px',
    borderRadius: '4px',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.2s',
  },
  kvacica: {
    color: '#000000',
    fontSize: '13px',
    fontWeight: 'bold',
  },
  label: {
    fontSize: '14px',
    fontWeight: 'bold',
  },
  opis: {
    color: '#888',
    fontSize: '12px',
    marginTop: '2px',
  },
};