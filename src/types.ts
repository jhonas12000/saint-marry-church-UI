export interface Member {
  id: number;
  firstName: string;
  lastName: string;
  telephone: string;
  email: string;
  address: string;
  monthlyPayment?: number;
  medhaneAlemPledge?: number;
  memberSince: string;
  spouseFirstName?: string;
  spouseLastName?: string;
  spouseTelephone?: string;
  children?: Child[];
}

export interface Finance {
  income: number;
  expenses: number;
  balance: number;
}

export interface Teacher {
  id: number;
  name: string;
  subject: string;
}

export interface Student {
  id: number;
  name: string;
  age: number;
  class: string;
}
export interface Child {
  id?: number;
  name: string;
  birthDate: string;   // "YYYY-MM-DD"
  gender: string;
}
export interface Payment {
  id: number;
  amount: number;
  monthPaid: string;
  paymentDate: string; // "YYYY-MM-DD"
}

export interface MemberFormData {
  id?: number;
  firstName: string;
  lastName: string;
  telephone: string;
  email: string;
  address: string;
  spouseFirstName: string;
  spouseLastName: string;
  spouseTelephone: string;
  children: Child[];
  monthlyPayment: string;
  medhaneAlemPledge: string;
  memberSince: string;
}

export interface MemberDTO {
  id: number;
  firstName: string;
  lastName: string;
  telephone: string;
  email: string;
  address: string;
  monthlyPayment?: number;
  memberSince: string;
  spouseFirstName?: string;
  spouseLastName?: string;
  spouseTelephone?: string;
  children?: Child[];
}