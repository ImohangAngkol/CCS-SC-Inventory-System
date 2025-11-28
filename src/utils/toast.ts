export type ToastType = 'success' | 'error' | 'info';
export interface ToastMsg {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  createdAt: number;
  durationMs?: number;
}

type Listener = (toasts: ToastMsg[]) => void;

const queue: ToastMsg[] = [];
let listeners: Listener[] = [];

export const ToastBus = {
  subscribe(fn: Listener) {
    listeners.push(fn);
    fn(queue);
    return () => {
      listeners = listeners.filter(l => l !== fn);
    };
  },
  push(msg: Omit<ToastMsg, 'id' | 'createdAt'>) {
    const toast: ToastMsg = { id: crypto.randomUUID(), createdAt: Date.now(), durationMs: msg.durationMs ?? 3500, ...msg };
    queue.push(toast);
    listeners.forEach(l => l([...queue]));
    setTimeout(() => {
      const idx = queue.findIndex(t => t.id === toast.id);
      if (idx >= 0) {
        queue.splice(idx, 1);
        listeners.forEach(l => l([...queue]));
      }
    }, toast.durationMs);
  },
  clear() {
    queue.splice(0, queue.length);
    listeners.forEach(l => l([...queue]));
  }
};

export const toastSuccess = (title: string, message?: string) => ToastBus.push({ type: 'success', title, message });
export const toastError = (title: string, message?: string) => ToastBus.push({ type: 'error', title, message });
export const toastInfo = (title: string, message?: string) => ToastBus.push({ type: 'info', title, message });
