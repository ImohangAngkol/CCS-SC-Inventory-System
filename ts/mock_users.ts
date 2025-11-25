export type Role = "student" | "officer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  course?: string;
  year?: number;
}

export const MOCK_USERS: User[] = [
  { id: "USR-001", name: "Andrew Santos", email: "andrew@school.edu", role: "student", course: "BSIT", year: 3 },
  { id: "USR-002", name: "Lara Mendoza", email: "lara@school.edu", role: "student", course: "BSEd", year: 2 },
  { id: "USR-003", name: "Miguel Cruz", email: "miguel@school.edu", role: "officer" },
  { id: "USR-004", name: "Priya Gomez", email: "priya@school.edu", role: "officer" },
  { id: "USR-005", name: "Admin User", email: "admin@school.edu", role: "admin" },
];
