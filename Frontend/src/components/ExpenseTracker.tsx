import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Filter, IndianRupee, PieChart, TrendingDown, TrendingUp, X, Check, Save } from 'lucide-react';
import toast from 'react-hot-toast';

interface Expense {
  _id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
}

interface Analysis {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  utilizationPercentage: number;
  categoryBreakdown: Record<string, number>;
}

const CATEGORIES = ['Transport', 'Hotel', 'Food', 'Activities', 'Shopping', 'Other'];

export const ExpenseTracker = ({ tripId }: { tripId: string }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    category: 'Other',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchExpenses();
    fetchAnalysis();
  }, [tripId]);

  const fetchExpenses = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/expenses/${tripId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      toast.error('Failed to load expenses');
    }
  };

  const fetchAnalysis = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/expenses/analysis/${tripId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      console.error('Failed to load analysis');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}/api/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, tripId })
      });

      if (!res.ok) throw new Error('Failed to add expense');

      toast.success('Expense added successfully');
      setIsAdding(false);
      setFormData({
        category: 'Other',
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0]
      });
      fetchExpenses();
      fetchAnalysis();
    } catch (err) {
      toast.error('Failed to add expense');
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    try {
      const res = await fetch(`${apiUrl}/api/expenses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Expense deleted');
      fetchExpenses();
      fetchAnalysis();
    } catch (err) {
      toast.error('Failed to delete expense');
    }
  };

  const startEdit = (expense: Expense) => {
    setEditingId(expense._id);
    setFormData({
      category: expense.category,
      description: expense.description,
      amount: expense.amount.toString(),
      date: expense.date.split('T')[0]
    });
  };

  const handleUpdateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}/api/expenses/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Update failed');
      toast.success('Expense updated');
      setEditingId(null);
      fetchExpenses();
      fetchAnalysis();
    } catch (err) {
      toast.error('Failed to update expense');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading Expense Tracker...</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 mb-2">
            <IndianRupee className="w-4 h-4" />
            <span className="text-sm font-medium">Total Spent</span>
          </div>
          <div className="text-2xl font-bold">₹{analysis?.totalSpent.toLocaleString()}</div>
          <div className="mt-2 text-xs text-zinc-400">Total Budget: ₹{analysis?.totalBudget.toLocaleString()}</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 mb-2">
            <TrendingDown className="w-4 h-4" />
            <span className="text-sm font-medium">Remaining</span>
          </div>
          <div className={`text-2xl font-bold ${(analysis?.remainingBudget || 0) < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
            ₹{analysis?.remainingBudget.toLocaleString()}
          </div>
          <div className="mt-2 w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${(analysis?.utilizationPercentage || 0) > 90 ? 'bg-red-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min(analysis?.utilizationPercentage || 0, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400 mb-2">
            <PieChart className="w-4 h-4" />
            <span className="text-sm font-medium">Utilization</span>
          </div>
          <div className="text-2xl font-bold">{analysis?.utilizationPercentage.toFixed(1)}%</div>
          <div className="mt-2 text-xs text-zinc-400">of planned budget used</div>
        </div>
      </div>

      {/* Expense Form & Actions */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Trip Expenses</h3>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-xl text-sm font-bold hover:opacity-80 transition-opacity"
          >
            <Plus className="w-4 h-4" /> Add Expense
          </button>
        )}
      </div>

      {(isAdding || editingId) && (
        <form onSubmit={editingId ? handleUpdateExpense : handleAddExpense} className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 grid grid-cols-1 md:grid-cols-4 gap-4 animate-in zoom-in-95 duration-200">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-500 uppercase">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 text-sm focus:ring-2 ring-black/5"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-500 uppercase">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="e.g. Dinner at Beach"
              className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 text-sm focus:ring-2 ring-black/5"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-500 uppercase">Amount (₹)</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              placeholder="0.00"
              className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 text-sm focus:ring-2 ring-black/5"
              required
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="flex-1 bg-black dark:bg-white text-white dark:text-black p-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> {editingId ? 'Update' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => { setIsAdding(false); setEditingId(null); }}
              className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* Expense List */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
        {expenses.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            <div className="bg-zinc-100 dark:bg-zinc-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-6 h-6" />
            </div>
            <p>No expenses recorded yet for this trip.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {expenses.map((expense) => (
                  <tr key={expense._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4 text-sm whitespace-nowrap">{new Date(expense.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold uppercase">
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{expense.description}</td>
                    <td className="px-6 py-4 text-sm font-bold">₹{expense.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => startEdit(expense)} className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors text-zinc-400 hover:text-blue-500">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteExpense(expense._id)} className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors text-zinc-400 hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
