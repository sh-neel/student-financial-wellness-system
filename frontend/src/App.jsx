import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ExpenseManager from "./pages/ExpenseManager";
import IncomeManager from "./pages/IncomeManager";
import BudgetManager from "./pages/BudgetManager";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loader">Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}
      <main className="main-content">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/expenses" element={<ProtectedRoute><ExpenseManager /></ProtectedRoute>} />
          <Route path="/income" element={<ProtectedRoute><IncomeManager /></ProtectedRoute>} />
          <Route path="/budgets" element={<ProtectedRoute><BudgetManager /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {user && <Footer />}
    </>
  );
}
