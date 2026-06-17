export default function Slider({ min, max, vrijednost, onChange, label, boja }) {
  const procenat = ((vrijednost - min) / (max - min)) * 100;

  return (
    <div style={styles.container}>
      {label && (
        <div style={styles.labelRow}>
          <span style={styles.label}>{label}</span>
          <span style={{...styles.vrijednost, color: boja || '#f0c040'}}>
            {vrijednost}
          </span>
        </div>
      )}
      <div style={styles.sliderWrap}>
        <input
          type="range"
          min={min}
          max={max}
          value={vrijednost}
          onChange={e => onChange(Number(e.target.value))}
          style={{
            ...styles.slider,
            background: `linear-gradient(to right, ${boja || '#f0c040'} ${procenat}%, #2a2a2a ${procenat}%)`,
          }}
        />
      </div>
      <div style={styles.minMax}>
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    marginBottom: '16px',
  },
  labelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  label: {
    color: '#888',
    fontSize: '13px',
  },
  vrijednost: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  sliderWrap: {
    width: '100%',
  },
  slider: {
    width: '100%',
    height: '6px',
    borderRadius: '3px',
    outline: 'none',
    border: 'none',
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
  },
  minMax: {
    display: 'flex',
    justifyContent: 'space-between',
    color: '#555',
    fontSize: '11px',
    marginTop: '4px',
  },
};