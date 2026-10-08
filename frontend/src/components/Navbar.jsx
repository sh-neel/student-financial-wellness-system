import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const signOut = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-primary navbar-dark sticky-top shadow-sm">
      <div className="container">
        <NavLink className="navbar-brand fw-bold" to="/">
          <i className="bi bi-wallet2 me-2" />FinWell Student
        </NavLink>
        <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <div className="navbar-nav me-auto">
            <NavLink className="nav-link" to="/">Dashboard</NavLink>
            <NavLink className="nav-link" to="/expenses">Expenses</NavLink>
            <NavLink className="nav-link" to="/income">Income</NavLink>
            <NavLink className="nav-link" to="/budgets">Budgets</NavLink>
          </div>
          <div className="d-flex align-items-center gap-3 text-white">
            <span className="small d-none d-md-inline">Hi, {user?.name}</span>
            <button className="btn btn-outline-light btn-sm" onClick={signOut}>Logout</button>
          </div>
        </div>
      </div>
    </nav>
  );
}
