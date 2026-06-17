import { useState, useEffect } from 'react';

export function useToast() {
  const [toasti, setToasti] = useState([]);

  const dodajToast = (poruka, tip = 'uspjeh') => {
    const id = Date.now();
    setToasti(prev => [...prev, { id, poruka, tip }]);
    setTimeout(() => {
      setToasti(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const ukloniToast = (id) => {
    setToasti(prev => prev.filter(t => t.id !== id));
  };

  return { toasti, dodajToast, ukloniToast };
}

export default function Toast({ toasti, ukloniToast }) {
  return (
    <div style={styles.container}>
      {toasti.map(toast => (
        <div
          key={toast.id}
          style={{
            ...styles.toast,
            backgroundColor: toast.tip === 'uspjeh' ? '#1a2a1a' : 
                           toast.tip === 'greska' ? '#2a1a1a' : '#1a1a2a',
            borderColor: toast.tip === 'uspjeh' ? '#44ff88' : 
                        toast.tip === 'greska' ? '#ff4444' : '#f0c040',
          }}
        >
          <span style={styles.ikona}>
            {toast.tip === 'uspjeh' ? '✅' : 
             toast.tip === 'greska' ? '❌' : 'ℹ️'}
          </span>
          <span style={{
            ...styles.poruka,
            color: toast.tip === 'uspjeh' ? '#44ff88' : 
                   toast.tip === 'greska' ? '#ff4444' : '#f0c040',
          }}>
            {toast.poruka}
          </span>
          <button
            style={styles.zatvoriBtn}
            onClick={() => ukloniToast(toast.id)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    zIndex: 99999,
  },
  toast: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 18px',
    borderRadius: '10px',
    border: '1px solid',
    minWidth: '280px',
    maxWidth: '400px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
    animation: 'slideIn 0.3s ease',
  },
  ikona: {
    fontSize: '18px',
    flexShrink: 0,
  },
  poruka: {
    fontSize: '14px',
    flex: 1,
  },
  zatvoriBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#888',
    cursor: 'pointer',
    fontSize: '14px',
    padding: '2px 6px',
    flexShrink: 0,
  },
};