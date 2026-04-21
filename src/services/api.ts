import type { AuthUser, Budget, Dashboard, Transaction } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

const getToken = () => localStorage.getItem("expense_token");

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers ?? undefined);
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(errorData.detail ?? "Request failed");
  }
  return response.json() as Promise<T>;
}

export const api = {
  signup: (payload: { name: string; email: string; password: string }) =>
    request<{ access_token: string; user: AuthUser }>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (payload: { email: string; password: string }) =>
    request<{ access_token: string; user: AuthUser }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  me: () => request<AuthUser>("/api/auth/me"),

  listTransactions: (params: { search?: string; category?: string; tx_type?: string; month?: string }) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => value && query.set(key, value));
    return request<Transaction[]>(`/api/transactions?${query.toString()}`);
  },

  createTransaction: (payload: Omit<Transaction, "id" | "receipt_path">) =>
    request<{ message: string; id: number }>("/api/transactions", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateTransaction: (id: number, payload: Partial<Transaction>) =>
    request<{ message: string }>(`/api/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  deleteTransaction: (id: number) => request<{ message: string }>(`/api/transactions/${id}`, { method: "DELETE" }),

  uploadReceipt: async (id: number, file: File) => {
    const form = new FormData();
    form.append("file", file);
    return request<{ message: string; path: string }>(`/api/transactions/${id}/receipt`, { method: "POST", body: form });
  },

  listBudgets: (month: string) => request<Budget[]>(`/api/budgets?month=${month}`),

  saveBudget: (payload: { category: string; month: string; amount: number }) =>
    request<{ message: string }>("/api/budgets", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  dashboard: (month: string) => request<Dashboard>(`/api/dashboard?month=${month}`),

  assistant: (query: string, month: string) =>
    request<{ answer: string }>(`/api/assistant?query=${encodeURIComponent(query)}&month=${month}`),
};
