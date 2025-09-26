const express = require('express');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
