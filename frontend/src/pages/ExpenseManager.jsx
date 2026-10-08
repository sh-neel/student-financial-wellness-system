import { useEffect, useState } from "react";
import { useExpenses } from "../context/ExpenseContext";
import { saveDraft, getDrafts, clearDrafts } from "../services/storage";

const blank = { title: "", amount: "", category: "Food", date: new Date().toISOString().slice(0, 10), notes: "" };
const categories = ["Tuition", "Rent", "Food", "Books", "Transport", "Entertainment", "Healthcare", "Shopping", "Utilities", "Other"];

export default function ExpenseManager() {
  const { expenses, loading, fetchExpenses, addExpense, updateExpense, deleteExpense } = useExpenses();
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [filters, setFilters] = useState({ search: "", category: "", sort: "date", order: "desc" });
  const [message, setMessage] = useState("");
  const [draftCount, setDraftCount] = useState(getDrafts().length);

  useEffect(() => { fetchExpenses(filters); }, [fetchExpenses, filters]);

  const submit = async e => {
    e.preventDefault();
    try {
      if (editing) await updateExpense(editing, form);
      else await addExpense(form);
      setForm(blank);
      setEditing(null);
      setMessage("Expense saved successfully.");
      fetchExpenses(filters);
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not save expense.");
    }
  };

  const edit = item => setForm({
    title: item.title, amount: item.amount, category: item.category,
    date: new Date(item.date).toISOString().slice(0, 10), notes: item.notes || ""
  }) || setEditing(item._id);

  const draft = () => {
    saveDraft(form);
    setDraftCount(getDrafts().length);
    setMessage("Draft saved to browser LocalStorage.");
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
        <div><p className="text-primary fw-semibold mb-1">CRUD + QUERY PARAMETERS</p><h1 className="h2 fw-bold">Expense Manager</h1></div>
        <span className="badge text-bg-secondary">{draftCount} offline draft(s)</span>
      </div>

      {message && <div className="alert alert-info">{message}</div>}

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5>{editing ? "Edit Expense" : "Add Expense"}</h5>
              <form onSubmit={submit}>
                <label className="form-label mt-2">Title</label>
                <input className="form-control" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                <label className="form-label mt-2">Amount (₹)</label>
                <input className="form-control" required type="number" min="0.01" step="0.01" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} />
                <label className="form-label mt-2">Category</label>
                <select className="form-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>{categories.map(c => <option key={c}>{c}</option>)}</select>
                <label className="form-label mt-2">Date</label>
                <input className="form-control" required type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                <label className="form-label mt-2">Notes</label>
                <textarea className="form-control" rows="3" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
                <div className="d-flex gap-2 mt-3">
                  <button className="btn btn-primary flex-grow-1">{editing ? "Update" : "Add Expense"}</button>
                  <button type="button" className="btn btn-outline-secondary" onClick={draft}>Save Draft</button>
                </div>
                {editing && <button type="button" className="btn btn-link mt-2" onClick={() => { setEditing(null); setForm(blank); }}>Cancel edit</button>}
              </form>
              {draftCount > 0 && <button className="btn btn-sm btn-outline-danger mt-3" onClick={() => { clearDrafts(); setDraftCount(0); }}>Clear offline drafts</button>}
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="row g-2 mb-3">
                <div className="col-md-5"><input className="form-control" placeholder="Search title/category..." value={filters.search} onChange={e => setFilters({...filters, search: e.target.value})} /></div>
                <div className="col-md-3"><select className="form-select" value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})}><option value="">All categories</option>{categories.map(c => <option key={c}>{c}</option>)}</select></div>
                <div className="col-md-2"><select className="form-select" value={filters.sort} onChange={e => setFilters({...filters, sort: e.target.value})}><option value="date">Date</option><option value="amount">Amount</option><option value="title">Title</option><option value="category">Category</option></select></div>
                <div className="col-md-2"><select className="form-select" value={filters.order} onChange={e => setFilters({...filters, order: e.target.value})}><option value="desc">↓ Desc</option><option value="asc">↑ Asc</option></select></div>
              </div>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead><tr><th>Title</th><th>Category</th><th>Date</th><th>Amount</th><th>Actions</th></tr></thead>
                  <tbody>
                    {loading ? <tr><td colSpan="5">Loading...</td></tr> : expenses.length === 0 ? <tr><td colSpan="5" className="text-muted">No expenses found.</td></tr> : expenses.map(item => (
                      <tr key={item._id}>
                        <td><strong>{item.title}</strong><div className="small text-muted">{item.notes}</div></td>
                        <td><span className="badge text-bg-light">{item.category}</span></td>
                        <td>{new Date(item.date).toLocaleDateString()}</td>
                        <td className="fw-semibold">₹{Number(item.amount).toLocaleString("en-IN")}</td>
                        <td className="text-nowrap">
                          <button className="btn btn-sm btn-outline-primary me-1" onClick={() => edit(item)}><i className="bi bi-pencil" /></button>
                          <button className="btn btn-sm btn-outline-danger" onClick={async () => { if (confirm("Delete this expense?")) await deleteExpense(item._id); }}><i className="bi bi-trash" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="small text-muted">Server-side filtering, sorting and pagination are supported by the API query parameters.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
