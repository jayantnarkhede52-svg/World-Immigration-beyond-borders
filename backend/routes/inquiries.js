const express = require('express');
const Inquiry = require('../models/Inquiry');
const { adminAuth } = require('../middleware/auth');
const { sendInquiryNotification } = require('../utils/notifier');

const router = express.Router();

/**
 * POST /api/inquiries
 * Create a new inquiry from the contact form
 */
router.post('/', async (req, res) => {
    try {
        const { name, email, interest, message } = req.body;

        // Validate required fields
        if (!name || !email || !interest || !message) {
            return res.status(400).json({ error: 'All fields are required (name, email, interest, message)' });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Please provide a valid email address' });
        }

        const inquiry = new Inquiry({ name, email, interest, message });
        await inquiry.save();

        // Send Telegram notification
        await sendInquiryNotification(inquiry);

        res.status(201).json({
            success: true,
            message: 'Your message has been received! We will get back to you within 24 hours.',
            inquiryId: inquiry._id
        });
    } catch (error) {
        console.error('Inquiry creation error:', error);
        res.status(500).json({ error: 'Failed to submit inquiry. Please try again.' });
    }
});

/**
 * GET /api/inquiries
 * List all inquiries (admin only)
 */
router.get('/', adminAuth, async (req, res) => {
    try {
        const { status, page = 1, limit = 50 } = req.query;
        const filter = status ? { status } : {};

        const inquiries = await Inquiry.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Inquiry.countDocuments(filter);

        res.json({
            success: true,
            inquiries,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error('Fetch inquiries error:', error);
        res.status(500).json({ error: 'Failed to fetch inquiries' });
    }
});

/**
 * PATCH /api/inquiries/:id/status
 * Update inquiry status (admin only)
 */
router.patch('/:id/status', adminAuth, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['new', 'contacted', 'resolved'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
        }

        const inquiry = await Inquiry.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!inquiry) {
            return res.status(404).json({ error: 'Inquiry not found' });
        }

        res.json({ success: true, inquiry });
    } catch (error) {
        console.error('Update inquiry error:', error);
        res.status(500).json({ error: 'Failed to update inquiry' });
    }
});

/**
 * DELETE /api/inquiries/:id
 * Delete an inquiry (admin only)
 */
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
        if (!inquiry) {
            return res.status(404).json({ error: 'Inquiry not found' });
        }
        res.json({ success: true, message: 'Inquiry deleted' });
    } catch (error) {
        console.error('Delete inquiry error:', error);
        res.status(500).json({ error: 'Failed to delete inquiry' });
    }
});

module.exports = router;
