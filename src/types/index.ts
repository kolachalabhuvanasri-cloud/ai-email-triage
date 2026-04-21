export type AuthUser = {
  id: number;
  name: string;
  email: string;
};

export type Transaction = {
  id: number;
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  transaction_date: string;
  notes: string;
  receipt_path?: string | null;
  is_recurring: boolean;
  recurring_day?: number | null;
  split_with: string[];
};

export type Budget = {
  id: number;
  category: string;
  month: string;
  amount: number;
};

export type Dashboard = {
  summary: { balance: number; income: number; expenses: number };
  category_spending: Record<string, number>;
  monthly_trend: Record<string, number>;
  budget_alerts: Array<{ category: string; budget: number; used: number; message: string }>;
  insight: string;
};
