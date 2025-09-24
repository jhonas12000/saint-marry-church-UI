export type Role =
  | "ADMIN"
  | "MEMBER"
  | "CHAIRPERSON"
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

export type Member = {
  id: number;
  firstName: string;
  lastName: string;
  telephone: string;
  email: string;
  address?: string;
  monthlyPayment?: number;
  medhaneAlemPledge?: number;
};

export type Child = {
  name: string;
  birthDate: string; // "YYYY-MM-DD"
  gender: string;
};

export type MemberDTO = {
  id: number;
  firstName: string;
  lastName: string;
  telephone: string;
  email: string;
  address?: string | null;

  // these two are the important ones for your underlined expression:
  monthlyPayment?: number | null;
  medhaneAlemPledge?: number | null;

  // you render these too:
  memberSince?: string | null; // "YYYY-MM-DD" or string per your backend

  spouseFirstName?: string | null;
  spouseLastName?: string | null;
  spouseTelephone?: string | null;

  children?: Child[]; // you map over this
};