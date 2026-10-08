import { useEffect, useState } from "react";
import api from "../services/api";

const categories = ["Scholarship", "Part-time Job", "Allowance", "Freelance", "Gift", "Investment", "Other"];
const blank = { source: "", amount: "", category: "Allowance", date: new Date().toISOString().slice(0, 10), notes: "" };

export default function IncomeManager() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");

  const load = async () => {
    const res = await api.get("/income", { params: { sort: "date", order: "desc", limit: 100 } });
    setItems(res.data.data);
  };

  useEffect(() => { load(); }, []);

  const submit = async e => {
    e.preventDefault();
    try {
      if (editing) await api.put(`/income/${editing}`, form);
      else await api.post("/income", form);
      setForm(blank); setEditing(null); setMessage("Income saved successfully."); load();
    } catch (err) { setMessage(err.response?.data?.message || "Unable to save income"); }
  };

  return (
    <div className="container py-4">
      <p className="text-primary fw-semibold mb-1">INCOME CRUD</p><h1 className="h2 fw-bold mb-4">Income Manager</h1>
      {message && <div className="alert alert-info">{message}</div>}
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm"><div className="card-body">
            <h5>{editing ? "Edit Income" : "Add Income"}</h5>
            <form onSubmit={submit}>
              <label className="form-label">Source</label><input className="form-control" required value={form.source} onChange={e => setForm({...form, source: e.target.value})} />
              <label className="form-label mt-2">Amount (₹)</label><input className="form-control" required type="number" min="0.01" step="0.01" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} />
              <label className="form-label mt-2">Category</label><select className="form-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>{categories.map(c => <option key={c}>{c}</option>)}</select>
              <label className="form-label mt-2">Date</label><input className="form-control" type="date" required value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
              <label className="form-label mt-2">Notes</label><textarea className="form-control" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
              <button className="btn btn-success w-100 mt-3">{editing ? "Update Income" : "Add Income"}</button>
              {editing && <button type="button" className="btn btn-link w-100" onClick={() => {setEditing(null); setForm(blank);}}>Cancel</button>}
            </form>
          </div></div>
        </div>
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm"><div className="card-body table-responsive">
            <table className="table"><thead><tr><th>Source</th><th>Category</th><th>Date</th><th>Amount</th><th /></tr></thead>
            <tbody>{items.map(item => <tr key={item._id}><td>{item.source}</td><td>{item.category}</td><td>{new Date(item.date).toLocaleDateString()}</td><td className="fw-bold text-success">₹{Number(item.amount).toLocaleString("en-IN")}</td><td><button className="btn btn-sm btn-outline-primary me-1" onClick={() => {setEditing(item._id); setForm({source:item.source, amount:item.amount, category:item.category, date:new Date(item.date).toISOString().slice(0,10), notes:item.notes||""});}}>Edit</button><button className="btn btn-sm btn-outline-danger" onClick={async () => {if(confirm("Delete income?")){await api.delete(`/income/${item._id}`);load();}}}>Delete</button></td></tr>)}</tbody></table>
            {!items.length && <p className="text-muted">No income records yet.</p>}
          </div></div>
        </div>
      </div>
    </div>
  );
}
