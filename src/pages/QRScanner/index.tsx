import { useState } from 'react';
import { toastSuccess, toastError } from '../../utils/toast';

export default function QRScannerPage() {
  const [input, setInput] = useState('');

  const scan = () => {
    if (!input.trim()) return toastError('Scan failed', 'No QR data');
    // Simulate QR: itemId|action
    const [itemId, action] = input.split('|');
    if (!itemId || !action) return toastError('Invalid QR', 'Expected format: itemId|borrow or itemId|return');
    toastSuccess('QR scanned', `Action: ${action} on ${itemId}`);
  };

  return (
    <div className="container">
      <h2>QR scanner (mock)</h2>
      <div className="card">
        <input className="input" placeholder="Enter mock QR: item-id|borrow" value={input} onChange={e => setInput(e.target.value)} />
        <div className="inline" style={{ marginTop: '0.5rem' }}>
          <button className="btn" onClick={scan}>Scan</button>
          <button className="btn secondary" onClick={() => setInput('item-laptop-1|borrow')}>Sample</button>
        </div>
      </div>
    </div>
  );
}
