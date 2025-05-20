import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ExpenseStats from './components/ExpenseStats';

function App() {
  const [expenses, setExpenses] = useState([]);

  // Загрузка расходов при монтировании компонента
  useEffect(() => {
    axios.get('http://localhost:4000/api/expenses')
      .then((res) => setExpenses(res.data))
      .catch((err) => console.error('Failed to fetch expenses:', err));
  }, []);

  // Добавление новой траты
  const addExpense = (expense) => {
    axios.post('http://localhost:4000/api/expenses', expense)
      .then((res) => {
        setExpenses(prev => [...prev, res.data]);
      })
      .catch((err) => console.error('Failed to add expense:', err));
  };

  const deleteExpense = (id) => {
    axios.delete(`http://localhost:4000/api/expenses/${id}`)
      .then(() => {
        setExpenses(prev => prev.filter(e => e._id !== id));
      })
      .catch(err => console.error('Failed to delete expense:', err));
  };
  

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h1>Expense Calculator</h1>
      <ExpenseForm onAdd={addExpense} />
      <ExpenseStats expenses={expenses} />
      <ExpenseList expenses={expenses} onDelete={deleteExpense} />
    </div>
  );
}

export default App;
