import api from "../api/api"; 

export interface PizzaContribution {
  id: number;
  firstName: string;
  lastName: string;
  email?: string | null;
  telephone: string;
  amount: number;
  paymentDate: string; // yyyy-mm-dd
}

export async function listAllContributions(): Promise<PizzaContribution[]> {
  const { data } = await api.get<PizzaContribution[]>("/api/pizza-contributions");
  return data;
}