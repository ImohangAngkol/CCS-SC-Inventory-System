import { useEffect, useState } from 'react';
import Toast from './Toast';
import { ToastBus } from '../utils/toast';
import '../styles/toast.css';

export default function ToastContainer() {
  const [toasts, setToasts] = useState(() => [] as ReturnType<typeof Array.from>);
  useEffect(() => ToastBus.subscribe(setToasts), []);
  return (
    <div className="toast-container">
      {toasts.map((t: any) => <Toast key={t.id} toast={t} />)}
    </div>
  );
}
