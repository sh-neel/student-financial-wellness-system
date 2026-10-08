import { useEffect, useState } from "react";
import api from "../services/api";
import StatCard from "../components/StatCard";
import ExternalApiWidget from "../components/ExternalApiWidget";

const money = value => `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await api.get("/wellness/summary");
      setData(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load dashboard");
    }
  };

  useEffect(() => { load(); }, []);

  if (error) return <div className="container py-5"><div className="alert alert-danger">{error}</div></div>;
  if (!data) return <div className="page-loader">Loading dashboard...</div>;

  const progress = Math.min(data.budgetPercent, 100);
  const progressType = data.budgetPercent >= 100 ? "danger" : data.budgetPercent >= 80 ? "warning" : "success";

  return (
    <div className="container py-4">
      <header className="mb-4">
        <p className="text-primary fw-semibold mb-1">FINANCIAL WELLNESS DASHBOARD</p>
        <h1 className="display-6 fw-bold">Your money at a glance</h1>
        <p className="text-muted">Month: {data.month}</p>
      </header>

      <section className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3"><StatCard title="Total Income" value={money(data.totalIncome)} icon="bi-arrow-down-left" tone="success" /></div>
        <div className="col-sm-6 col-xl-3"><StatCard title="Total Expenses" value={money(data.totalExpenses)} icon="bi-arrow-up-right" tone="danger" /></div>
        <div className="col-sm-6 col-xl-3"><StatCard title="Savings" value={money(data.savings)} icon="bi-piggy-bank" tone="primary" /></div>
        <div className="col-sm-6 col-xl-3"><StatCard title="Wellness Score" value={`${data.wellnessScore}/100`} icon="bi-heart-pulse" tone="warning" subtitle="Custom financial health algorithm" /></div>
      </section>

      <section className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h5>Monthly Budget</h5>
                  <p className="text-muted mb-2">{data.budgetLimit ? `${money(data.totalExpenses)} of ${money(data.budgetLimit)} used` : "Set a budget to activate tracking"}</p>
                </div>
                <strong>{data.budgetPercent}%</strong>
              </div>
              <div className="progress progress-lg">
                <div className={`progress-bar bg-${progressType}`} style={{ width: `${progress}%` }} />
              </div>
              {data.budgetPercent >= 80 && <div className={`alert alert-${data.budgetPercent >= 100 ? "danger" : "warning"} mt-3 mb-0`}>Spending has reached the {data.budgetPercent >= 100 ? "budget limit" : "80% alert threshold"}.</div>}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5>Smart Recommendations</h5>
              {data.recommendations.map((r, i) => <div key={i} className="alert alert-light border mb-2"><i className="bi bi-lightbulb me-2 text-warning" />{r}</div>)}
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5>Spending by Category</h5>
              {data.categories.length === 0 ? <p className="text-muted">No expenses recorded this month.</p> : data.categories.map(c => (
                <div key={c._id} className="mb-3">
                  <div className="d-flex justify-content-between small"><span>{c._id}</span><strong>{money(c.total)}</strong></div>
                  <div className="progress"><div className="progress-bar" style={{ width: `${Math.min((c.total / Math.max(data.totalExpenses, 1)) * 100, 100)}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <ExternalApiWidget />
        </div>
      </section>
    </div>
  );
}
