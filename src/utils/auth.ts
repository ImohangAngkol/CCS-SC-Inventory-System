import LS from './localStorage';
import type { Role, User } from '../types/User';

const SESSION_KEY = 'scis_session';

export interface Session {
  token: string;
  role: Role;
  user: User;
}

export const auth = {
  getSession(): Session | null {
    return LS.get<Session | null>(SESSION_KEY, null);
  },
  login(role: Role, email: string, name: string): Session {
    // Mock user lookup/creation handled by mockApi.registerUser
    const session: Session = {
      token: crypto.randomUUID(),
      role,
      user: { id: crypto.randomUUID(), name, email, role, status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    };
    LS.set(SESSION_KEY, session);
    return session;
  },
  logout() {
    LS.remove(SESSION_KEY);
  }
};
