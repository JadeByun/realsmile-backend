const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/employees', require('./routes/api/employees'));
app.use('/api/employers', require('./routes/api/employers'));
app.use('/api/employee-profile', require('./routes/api/employee-profile'));
app.use('/api/employer-profile', require('./routes/api/employer-profile'));
app.use('/api/job-posts', require('./routes/api/job-posts'));
app.use('/api/auth', require('./routes/api/auth'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
