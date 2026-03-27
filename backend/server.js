const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
const orderRoutes = require('./routes/orders');
const inquiryRoutes = require('./routes/inquiries');
const leadRoutes = require('./routes/leads');
const adminRoutes = require('./routes/admin');

app.use('/api/orders', orderRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/admin', adminRoutes);

// Serve admin panel
const path = require('path');
app.use('/admin', express.static(path.join(__dirname, '..', 'admin')));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'World Immigration Beyond Borders Backend is running' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
