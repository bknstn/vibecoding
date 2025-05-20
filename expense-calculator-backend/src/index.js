const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/expenses', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const expenseSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  date: String,
});

const Expense = mongoose.model('Expense', expenseSchema);

// Получить все расходы
app.get('/api/expenses', async (req, res) => {
  const expenses = await Expense.find().sort({ date: -1 });
  res.json(expenses);
});

// Добавить расход
app.post('/api/expenses', async (req, res) => {
  const { name, amount, date } = req.body;
  const newExpense = new Expense({ name, amount, date });
  await newExpense.save();
  res.status(201).json(newExpense);
});

// Удалить расход
app.delete('/api/expenses/:id', async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
