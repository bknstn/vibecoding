import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './ExpenseList.css'; // добавим CSS-анимацию

function ExpenseList({ expenses, onDelete }) {
  return (
    <TransitionGroup component="ul">
      {expenses.map((e) => (
        <CSSTransition key={e._id} timeout={300} classNames="fade">
          <li>
            {e.name}: ${e.amount.toFixed(2)} ({e.date})
            <button onClick={() => onDelete(e._id)} style={{ marginLeft: '10px' }}>
              <span role="img" aria-label="Delete expense">❌</span>
            </button>
          </li>
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
}

export default ExpenseList;

