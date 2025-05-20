import React from 'react';

function ExpenseStats({ expenses }) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const average = (total / 30).toFixed(2);
  const top3 = [...expenses].sort((a, b) => b.amount - a.amount).slice(0, 3);

  return (
    <div>
      <h3>Total: ${total.toFixed(2)}</h3>
      <h3>Average Daily Expense: ${average}</h3>
      <h3>Top 3 Expenses:</h3>
      <ol>
        {top3.map((e, i) => (
          <li key={i}>{e.name}: ${e.amount.toFixed(2)}</li>
        ))}
      </ol>
    </div>
  );
}

export default ExpenseStats;
