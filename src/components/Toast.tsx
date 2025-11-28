import type { ToastMsg } from '../utils/toast';

export default function Toast({ toast }: { toast: ToastMsg }) {
  return (
    <div className={`toast ${toast.type}`}>
      <strong>{toast.title}</strong>
      {toast.message && <div style={{ marginTop: 4 }}>{toast.message}</div>}
    </div>
  );
}
