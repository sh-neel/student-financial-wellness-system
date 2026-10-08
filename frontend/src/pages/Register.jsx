import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const initial = { name: "", email: "", password: "", studentId: "", course: "", captchaAnswer: "" };

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [captcha, setCaptcha] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadCaptcha = async () => {
    const res = await api.get("/auth/captcha");
    setCaptcha(res.data.captcha);
    setForm(f => ({ ...f, captchaAnswer: "" }));
  };

  useEffect(() => { loadCaptcha(); }, []);

  const submit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register({ ...form, captchaId: captcha.id });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      loadCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="card auth-card register-card border-0 shadow-lg">
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
            <div className="brand-circle"><i className="bi bi-person-plus" /></div>
            <h1 className="h3 mt-3">Create student account</h1>
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={submit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Full Name</label>
                <input className="form-control" required minLength="2" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Student ID</label>
                <input className="form-control" value={form.studentId} onChange={e => setForm({...form, studentId: e.target.value})} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input className="form-control" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Course</label>
                <input className="form-control" placeholder="Computer Engineering" value={form.course} onChange={e => setForm({...form, course: e.target.value})} />
              </div>
              <div className="col-12">
                <label className="form-label">Password</label>
                <input className="form-control" type="password" required minLength="6" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
              </div>
              <div className="col-12">
                <div className="captcha-box">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold">CAPTCHA: {captcha?.question || "Loading..."}</span>
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={loadCaptcha}>New</button>
                  </div>
                  <input className="form-control mt-2" type="number" required placeholder="Enter answer" value={form.captchaAnswer} onChange={e => setForm({...form, captchaAnswer: e.target.value})} />
                </div>
              </div>
            </div>
            <button className="btn btn-primary w-100 mt-4" disabled={loading}>{loading ? "Creating..." : "Create Account"}</button>
          </form>
          <p className="text-center mt-4 mb-0">Already registered? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
}
