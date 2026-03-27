const express = require('express');
const Lead = require('../models/Lead');
const { adminAuth } = require('../middleware/auth');
const { sendLeadNotification } = require('../utils/notifier');

const router = express.Router();

/**
 * POST /api/leads
 * Capture a new lead from CTA forms
 */
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, destination, source } = req.body;

        // Validate required fields
        if (!name || !email || !destination) {
            return res.status(400).json({ error: 'Name, email, and destination are required' });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Please provide a valid email address' });
        }

        const lead = new Lead({
            name,
            email,
            phone: phone || '',
            destination,
            source: source || 'website'
        });
        await lead.save();

        // Send Telegram notification
        await sendLeadNotification(lead);

        res.status(201).json({
            success: true,
            message: 'Thank you! Our team will contact you shortly.',
            leadId: lead._id
        });
    } catch (error) {
        console.error('Lead capture error:', error);
        res.status(500).json({ error: 'Failed to submit. Please try again.' });
    }
});

/**
 * GET /api/leads
 * List all leads (admin only)
 */
router.get('/', adminAuth, async (req, res) => {
    try {
        const { status, page = 1, limit = 50 } = req.query;
        const filter = status ? { status } : {};

        const leads = await Lead.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Lead.countDocuments(filter);

        res.json({
            success: true,
            leads,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error('Fetch leads error:', error);
        res.status(500).json({ error: 'Failed to fetch leads' });
    }
});

/**
 * PATCH /api/leads/:id/status
 * Update lead status (admin only)
 */
router.patch('/:id/status', adminAuth, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['new', 'contacted', 'converted'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
        }

        const lead = await Lead.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!lead) {
            return res.status(404).json({ error: 'Lead not found' });
        }

        res.json({ success: true, lead });
    } catch (error) {
        console.error('Update lead error:', error);
        res.status(500).json({ error: 'Failed to update lead' });
    }
});

/**
 * DELETE /api/leads/:id
 * Delete a lead (admin only)
 */
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const lead = await Lead.findByIdAndDelete(req.params.id);
        if (!lead) {
            return res.status(404).json({ error: 'Lead not found' });
        }
        res.json({ success: true, message: 'Lead deleted' });
    } catch (error) {
        console.error('Delete lead error:', error);
        res.status(500).json({ error: 'Failed to delete lead' });
    }
});

module.exports = router;
