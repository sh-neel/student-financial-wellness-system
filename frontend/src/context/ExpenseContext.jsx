import { createContext, useContext, useCallback, useState } from "react";
import api from "../services/api";

const ExpenseContext = createContext(null);

export function ExpenseProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchExpenses = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const res = await api.get("/expenses", { params });
      setExpenses(res.data.data);
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const addExpense = async payload => {
    const res = await api.post("/expenses", payload);
    setExpenses(prev => [res.data.data, ...prev]);
    return res.data.data;
  };

  const updateExpense = async (id, payload) => {
    const res = await api.put(`/expenses/${id}`, payload);
    setExpenses(prev => prev.map(item => item._id === id ? res.data.data : item));
    return res.data.data;
  };

  const deleteExpense = async id => {
    await api.delete(`/expenses/${id}`);
    setExpenses(prev => prev.filter(item => item._id !== id));
  };

  return (
    <ExpenseContext.Provider value={{ expenses, loading, fetchExpenses, addExpense, updateExpense, deleteExpense }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export const useExpenses = () => useContext(ExpenseContext);
