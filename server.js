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
app.use('/api/availability', require('./routes/api/employee/availability'));
app.use('/api/restaurant', require('./routes/api/employer/restaurant'));
app.use('/api/job-posts', require('./routes/api/employer/job-posts'));
app.use('/api/employee-auth', require('./routes/api/employee/employee-auth'));
app.use('/api/employer-auth', require('./routes/api/employer/employer-auth'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
