import { useEffect, useState } from "react";
import api from "../services/api";

export default function BudgetManager() {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [budgets, setBudgets] = useState([]);
  const [form, setForm] = useState({ month: currentMonth, limit: "", savingsTarget: "", notes: "" });
  const [message, setMessage] = useState("");

  const load = async () => {
    const res = await api.get("/budgets");
    setBudgets(res.data.data);
  };

  useEffect(() => { load(); }, []);

  const submit = async e => {
    e.preventDefault();
    try {
      await api.post("/budgets", form);
      setMessage("Budget saved.");
      setForm({ month: currentMonth, limit: "", savingsTarget: "", notes: "" });
      load();
    } catch (err) { setMessage(err.response?.data?.message || "Could not save budget"); }
  };

  const remove = async id => { if (confirm("Delete this budget?")) { await api.delete(`/budgets/${id}`); load(); } };

  return (
    <div className="container py-4">
      <p className="text-primary fw-semibold mb-1">SMART BUDGETING</p><h1 className="h2 fw-bold mb-4">Monthly Budgets & Goals</h1>
      {message && <div className="alert alert-info">{message}</div>}
      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm"><div className="card-body">
            <h5>Set Monthly Budget</h5>
            <form onSubmit={submit}>
              <label className="form-label">Month</label><input className="form-control" type="month" required value={form.month} onChange={e => setForm({...form, month:e.target.value})} />
              <label className="form-label mt-3">Expense Limit (₹)</label><input className="form-control" type="number" min="0.01" required value={form.limit} onChange={e => setForm({...form, limit:e.target.value})} />
              <label className="form-label mt-3">Savings Target (₹)</label><input className="form-control" type="number" min="0" value={form.savingsTarget} onChange={e => setForm({...form, savingsTarget:e.target.value})} />
              <label className="form-label mt-3">Notes</label><textarea className="form-control" value={form.notes} onChange={e => setForm({...form, notes:e.target.value})} />
              <button className="btn btn-primary w-100 mt-3">Save Budget</button>
            </form>
          </div></div>
        </div>
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm"><div className="card-body">
            <h5>Saved Budgets</h5>
            {budgets.map(b => <div className="budget-row border rounded p-3 mb-2" key={b._id}><div className="d-flex justify-content-between"><strong>{b.month}</strong><button className="btn btn-sm btn-outline-danger" onClick={() => remove(b._id)}>Delete</button></div><div className="mt-2">Limit: <strong>₹{Number(b.limit).toLocaleString("en-IN")}</strong> • Savings target: ₹{Number(b.savingsTarget || 0).toLocaleString("en-IN")}</div></div>)}
            {!budgets.length && <p className="text-muted">No budgets set.</p>}
          </div></div>
        </div>
      </div>
    </div>
  );
}
