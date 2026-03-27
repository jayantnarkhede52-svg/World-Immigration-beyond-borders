const express = require('express');
const { adminAuth, generateToken } = require('../middleware/auth');
const Inquiry = require('../models/Inquiry');
const Lead = require('../models/Lead');
const Order = require('../models/Order');

const router = express.Router();

/**
 * POST /api/admin/login
 * Validate admin password and return token
 */
router.post('/login', (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }

        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

        if (password !== adminPassword) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = generateToken(adminPassword);

        res.json({
            success: true,
            token,
            message: 'Login successful'
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

/**
 * GET /api/admin/stats
 * Dashboard statistics (admin only)
 */
router.get('/stats', adminAuth, async (req, res) => {
    try {
        // Get today's start timestamp
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const [
            totalInquiries,
            newInquiries,
            todayInquiries,
            totalLeads,
            newLeads,
            todayLeads,
            totalOrders,
            paidOrders
        ] = await Promise.all([
            Inquiry.countDocuments(),
            Inquiry.countDocuments({ status: 'new' }),
            Inquiry.countDocuments({ createdAt: { $gte: todayStart } }),
            Lead.countDocuments(),
            Lead.countDocuments({ status: 'new' }),
            Lead.countDocuments({ createdAt: { $gte: todayStart } }),
            Order.countDocuments(),
            Order.countDocuments({ status: 'paid' })
        ]);

        res.json({
            success: true,
            stats: {
                inquiries: { total: totalInquiries, new: newInquiries, today: todayInquiries },
                leads: { total: totalLeads, new: newLeads, today: todayLeads },
                orders: { total: totalOrders, paid: paidOrders }
            }
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

module.exports = router;
