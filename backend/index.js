const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/route');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Auth API running 🚀');
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
