import { useEffect, useMemo, useState } from "react";
import { api } from "@/services/api";
import type { AuthUser, Budget, Dashboard, Transaction } from "@/types";

const CATEGORIES = ["food", "travel", "bills", "shopping", "health", "subscriptions", "salary", "other"];

type Page = "dashboard" | "transactions" | "budgets" | "assistant";

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [page, setPage] = useState<Page>("dashboard");
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [error, setError] = useState("");

  const [authForm, setAuthForm] = useState({ name: "", email: "demo@tracker.app", password: "demo1234" });
  const [form, setForm] = useState({
    title: "",
    amount: 0,
    type: "expense" as "income" | "expense",
    category: "food",
    transaction_date: new Date().toISOString().slice(0, 10),
    notes: "",
    is_recurring: false,
    recurring_day: 1,
    split_with: "",
  });

  const [filters, setFilters] = useState({ search: "", category: "", tx_type: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [budgetForm, setBudgetForm] = useState({ category: "food", amount: 0 });
  const [assistantQuery, setAssistantQuery] = useState("How much did I spend this month?");
  const [assistantAnswer, setAssistantAnswer] = useState("");

  const pieStyle = useMemo(() => {
    const data = dashboard?.category_spending ?? {};
    const entries = Object.entries(data);
    const total = entries.reduce((acc, [, value]) => acc + value, 0);
    if (!total) return "conic-gradient(#d1d5db 0 100%)";

    const palette = ["#4f46e5", "#0891b2", "#16a34a", "#f59e0b", "#ec4899", "#6d28d9"];
    let offset = 0;
    const segments = entries.map(([, value], index) => {
      const pct = (value / total) * 100;
      const part = `${palette[index % palette.length]} ${offset}% ${offset + pct}%`;
      offset += pct;
      return part;
    });
    return `conic-gradient(${segments.join(",")})`;
  }, [dashboard]);

  const loadAll = async () => {
    const [txs, budgetRows, dash] = await Promise.all([
      api.listTransactions({ ...filters, month }),
      api.listBudgets(month),
      api.dashboard(month),
    ]);
    setTransactions(txs);
    setBudgets(budgetRows);
    setDashboard(dash);
  };

  useEffect(() => {
    const token = localStorage.getItem("expense_token");
    const savedTheme = localStorage.getItem("expense_theme") as "light" | "dark" | null;
    if (savedTheme) setTheme(savedTheme);
    if (token) {
      api.me().then(setUser).catch(() => localStorage.removeItem("expense_token"));
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadAll().catch((e: Error) => setError(e.message));
    }
  }, [user, month]);

  const submitAuth = async () => {
    try {
      setError("");
      const response =
        mode === "login"
          ? await api.login({ email: authForm.email, password: authForm.password })
          : await api.signup(authForm);
      localStorage.setItem("expense_token", response.access_token);
      setUser(response.user);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const saveTransaction = async () => {
    const payload = {
      ...form,
      split_with: form.split_with ? form.split_with.split(",").map((p) => p.trim()) : [],
      recurring_day: form.is_recurring ? Number(form.recurring_day) : null,
    };

    try {
      if (editingId) {
        await api.updateTransaction(editingId, payload);
      } else {
        await api.createTransaction(payload);
      }
      setEditingId(null);
      setForm({
        title: "",
        amount: 0,
        type: "expense",
        category: "food",
        transaction_date: new Date().toISOString().slice(0, 10),
        notes: "",
        is_recurring: false,
        recurring_day: 1,
        split_with: "",
      });
      await loadAll();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const onEdit = (tx: Transaction) => {
    setEditingId(tx.id);
    setForm({
      title: tx.title,
      amount: tx.amount,
      type: tx.type,
      category: tx.category,
      transaction_date: tx.transaction_date,
      notes: tx.notes,
      is_recurring: tx.is_recurring,
      recurring_day: tx.recurring_day ?? 1,
      split_with: tx.split_with.join(", "),
    });
    setPage("transactions");
  };

  const onDelete = async (id: number) => {
    await api.deleteTransaction(id);
    await loadAll();
  };

  const saveBudget = async () => {
    await api.saveBudget({ category: budgetForm.category, month, amount: Number(budgetForm.amount) });
    setBudgetForm({ category: "food", amount: 0 });
    await loadAll();
  };

  const askAssistant = async () => {
    const response = await api.assistant(assistantQuery, month);
    setAssistantAnswer(response.answer);
  };

  const logout = () => {
    localStorage.removeItem("expense_token");
    setUser(null);
  };

  if (!user) {
    return (
      <div className={`app-shell ${theme}`}>
        <div className="auth-card">
          <h1>Personal Expense Tracker</h1>
          <p>Beginner-friendly full-stack app with pro dashboard features.</p>
          <div className="row">
            <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Login</button>
            <button className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>Signup</button>
            <button onClick={() => {
              const next = theme === "light" ? "dark" : "light";
              setTheme(next);
              localStorage.setItem("expense_theme", next);
            }}>🌓</button>
          </div>
          {mode === "signup" && (
            <input placeholder="Name" value={authForm.name} onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })} />
          )}
          <input placeholder="Email" value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} />
          <input
            placeholder="Password"
            type="password"
            value={authForm.password}
            onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
          />
          <button onClick={submitAuth}>{mode === "login" ? "Sign in" : "Create account"}</button>
          {error && <p className="error">{error}</p>}
          <small>Demo: demo@tracker.app / demo1234</small>
        </div>
      </div>
    );
  }

  return (
    <div className={`app-shell ${theme}`}>
      <aside className="sidebar">
        <h2>ExpenseFlow</h2>
        {(["dashboard", "transactions", "budgets", "assistant"] as Page[]).map((item) => (
          <button key={item} className={page === item ? "active" : ""} onClick={() => setPage(item)}>
            {item}
          </button>
        ))}
        <button onClick={() => {
          const next = theme === "light" ? "dark" : "light";
          setTheme(next);
          localStorage.setItem("expense_theme", next);
        }}>Toggle dark mode</button>
        <button onClick={logout}>Logout</button>
      </aside>
      <main className="main">
        <header className="toolbar">
          <h1>Hello, {user.name}</h1>
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
        </header>

        {dashboard && page === "dashboard" && (
          <section>
            <div className="cards">
              <article className="card"><h3>Balance</h3><p>${dashboard.summary.balance.toFixed(2)}</p></article>
              <article className="card"><h3>Income</h3><p>${dashboard.summary.income.toFixed(2)}</p></article>
              <article className="card"><h3>Expenses</h3><p>${dashboard.summary.expenses.toFixed(2)}</p></article>
            </div>

            <div className="grid-two">
              <article className="card">
                <h3>Category Pie</h3>
                <div className="pie" style={{ background: pieStyle }} />
                {Object.entries(dashboard.category_spending).map(([k, v]) => <p key={k}>{k}: ${v.toFixed(2)}</p>)}
              </article>
              <article className="card">
                <h3>Monthly Trend</h3>
                {Object.entries(dashboard.monthly_trend).map(([m, value]) => (
                  <div className="bar-row" key={m}>
                    <span>{m}</span>
                    <div className="bar" style={{ width: `${Math.min(value / 20, 100)}%` }} />
                    <span>${value.toFixed(0)}</span>
                  </div>
                ))}
              </article>
            </div>
            <article className="card">
              <h3>Smart Insight</h3>
              <p>{dashboard.insight}</p>
              {dashboard.budget_alerts.map((alert) => <p className="error" key={alert.category}>{alert.message}</p>)}
            </article>
          </section>
        )}

        {page === "transactions" && (
          <section>
            <article className="card">
              <h3>{editingId ? "Edit" : "Add"} Transaction</h3>
              <div className="form-grid">
                <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                <input type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} />
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "income" | "expense" })}>
                  <option value="expense">Expense</option><option value="income">Income</option>
                </select>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((cat) => <option key={cat}>{cat}</option>)}
                </select>
                <input type="date" value={form.transaction_date} onChange={(e) => setForm({ ...form, transaction_date: e.target.value })} />
                <input placeholder="Split with (comma names)" value={form.split_with} onChange={(e) => setForm({ ...form, split_with: e.target.value })} />
                <label><input type="checkbox" checked={form.is_recurring} onChange={(e) => setForm({ ...form, is_recurring: e.target.checked })} />Recurring monthly</label>
                {form.is_recurring && <input type="number" min={1} max={28} value={form.recurring_day} onChange={(e) => setForm({ ...form, recurring_day: Number(e.target.value) })} />}
                <textarea placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
              <button onClick={saveTransaction}>{editingId ? "Update" : "Add"} transaction</button>
            </article>

            <article className="card">
              <h3>Search & Filter</h3>
              <div className="row">
                <input placeholder="Search title" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
                <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
                  <option value="">All categories</option>{CATEGORIES.map((cat) => <option key={cat}>{cat}</option>)}
                </select>
                <select value={filters.tx_type} onChange={(e) => setFilters({ ...filters, tx_type: e.target.value })}>
                  <option value="">Both</option><option value="expense">Expense</option><option value="income">Income</option>
                </select>
                <button onClick={loadAll}>Apply</button>
              </div>
              <div className="table">
                {transactions.map((tx) => (
                  <div key={tx.id} className="table-row">
                    <div>
                      <strong>{tx.title}</strong>
                      <p>{tx.category} • {tx.transaction_date}</p>
                      {tx.split_with.length > 0 && <p>Split: {tx.split_with.join(", ")}</p>}
                    </div>
                    <p className={tx.type === "expense" ? "error" : "success"}>{tx.type === "expense" ? "-" : "+"}${tx.amount.toFixed(2)}</p>
                    <div className="row">
                      <button onClick={() => onEdit(tx)}>Edit</button>
                      <button onClick={() => onDelete(tx.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>
        )}

        {page === "budgets" && (
          <section className="card">
            <h3>Budget management</h3>
            <div className="row">
              <select value={budgetForm.category} onChange={(e) => setBudgetForm({ ...budgetForm, category: e.target.value })}>
                {CATEGORIES.filter((c) => c !== "salary").map((cat) => <option key={cat}>{cat}</option>)}
              </select>
              <input type="number" placeholder="Budget amount" value={budgetForm.amount} onChange={(e) => setBudgetForm({ ...budgetForm, amount: Number(e.target.value) })} />
              <button onClick={saveBudget}>Save budget</button>
            </div>
            {budgets.map((budget) => (
              <p key={budget.id}>{budget.category} ({budget.month}): ${budget.amount.toFixed(2)}</p>
            ))}
          </section>
        )}

        {page === "assistant" && (
          <section className="card">
            <h3>AI Assistant</h3>
            <p>Try: "How much did I spend this month?" or "Where can I save money?"</p>
            <div className="row">
              <input value={assistantQuery} onChange={(e) => setAssistantQuery(e.target.value)} />
              <button onClick={askAssistant}>Ask</button>
            </div>
            {assistantAnswer && <p><strong>Answer:</strong> {assistantAnswer}</p>}
          </section>
        )}
      </main>
    </div>
  );
}
