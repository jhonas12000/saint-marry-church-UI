export interface Member {
  id: number;
  name: string;
  status: string;
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
