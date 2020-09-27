const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/employee', require('./routes/api/employee/employee'));
app.use('/api/employer', require('./routes/api/employer/employer'));
app.use(
  '/api/employee-profile',
  require('./routes/api/employee/employee-profile')
);
app.use(
  '/api/employer-profile',
  require('./routes/api/employer/employer-profile')
);
app.use('/api/job-post', require('./routes/api/job-post'));
app.use('/api/employee-auth', require('./routes/api/employee/employee-auth'));
app.use('/api/employer-auth', require('./routes/api/employer/employer-auth'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
