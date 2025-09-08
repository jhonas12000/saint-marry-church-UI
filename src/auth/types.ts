export type Role =
  | "ADMIN"
  | "MEMBER"
  | "CHAIRMAN"
  | "FINANCE_MANAGER"
  | "EDUCATION_LEAD"
  | "SECRETARY";

export interface AuthResponse {
  token: string;
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  roles: Role[];
}

export interface AuthUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  roles: Role[];
}
