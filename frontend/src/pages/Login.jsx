import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="card auth-card border-0 shadow-lg">
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
            <div className="brand-circle"><i className="bi bi-wallet2" /></div>
            <h1 className="h3 mt-3">Welcome back</h1>
            <p className="text-muted">Manage your student finances smarter.</p>
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={submit}>
            <label className="form-label">Email</label>
            <input className="form-control mb-3" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            <label className="form-label">Password</label>
            <input className="form-control mb-3" type="password" required minLength="6" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            <button className="btn btn-primary w-100" disabled={loading}>{loading ? "Signing in..." : "Login"}</button>
          </form>
          <p className="text-center mt-4 mb-0">New student? <Link to="/register">Create an account</Link></p>
        </div>
      </div>
    </div>
  );
}
