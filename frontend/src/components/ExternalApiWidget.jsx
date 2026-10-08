import { useState } from "react";

const currencies = ["USD", "INR", "EUR", "GBP", "AUD", "CAD", "JPY", "AED"];

export default function ExternalApiWidget() {
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const convert = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch(`https://api.frankfurter.app/latest?amount=${encodeURIComponent(amount)}&from=${from}&to=${to}`);
      if (!response.ok) throw new Error("Currency service unavailable");
      const data = await response.json();
      setResult(data.rates[to]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body">
        <h5 className="card-title"><i className="bi bi-currency-exchange me-2" />Live Currency Converter</h5>
        <p className="text-muted small">Uses the public Frankfurter REST API.</p>
        <form onSubmit={convert}>
          <div className="row g-2">
            <div className="col-12 col-md-4">
              <label className="form-label">Amount</label>
              <input className="form-control" type="number" min="0.01" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} />
            </div>
            <div className="col-6 col-md-4">
              <label className="form-label">From</label>
              <select className="form-select" value={from} onChange={e => setFrom(e.target.value)}>
                {currencies.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="col-6 col-md-4">
              <label className="form-label">To</label>
              <select className="form-select" value={to} onChange={e => setTo(e.target.value)}>
                {currencies.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <button className="btn btn-primary mt-3" disabled={loading}>{loading ? "Converting..." : "Convert"}</button>
        </form>
        {result !== null && <div className="alert alert-success mt-3 mb-0"><strong>{amount} {from} = {Number(result).toFixed(2)} {to}</strong></div>}
        {error && <div className="alert alert-danger mt-3 mb-0">{error}</div>}
      </div>
    </div>
  );
}
