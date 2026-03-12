const express = require('express');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const Order = require('../models/Order');
const { sendAgentNotification } = require('../utils/notifier');

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

/**
 * POST /api/orders/create
 * Creates a Razorpay order and saves a pending order in DB
 */
router.post('/create', async (req, res) => {
    try {
        const { customerName, email, phone, visaType, packageName, amount } = req.body;

        // Validate required fields
        if (!customerName || !email || !phone || !visaType || !packageName || !amount) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Create Razorpay order (amount in paise)
        const razorpayOrder = await razorpay.orders.create({
            amount: amount, // already in paise from frontend
            currency: 'INR',
            receipt: `order_${Date.now()}`,
            notes: {
                visaType,
                packageName,
                customerName,
                email
            }
        });

        // Save order in database
        const order = new Order({
            customerName,
            email,
            phone,
            visaType,
            packageName,
            amount,
            razorpayOrderId: razorpayOrder.id,
            status: 'created'
        });
        await order.save();

        res.json({
            success: true,
            orderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            dbOrderId: order._id
        });
    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

/**
 * POST /api/orders/verify
 * Verifies Razorpay payment signature, updates order, notifies agent
 */
router.post('/verify', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = req.body;

        // Verify signature
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (generatedSignature !== razorpay_signature) {
            // Update order as failed
            await Order.findByIdAndUpdate(dbOrderId, { status: 'failed' });
            return res.status(400).json({ error: 'Payment verification failed' });
        }

        // Update order as paid
        const order = await Order.findByIdAndUpdate(dbOrderId, {
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            status: 'paid'
        }, { new: true });

        // Send notification to agent (Telegram)
        await sendAgentNotification(order);

        res.json({
            success: true,
            message: 'Payment verified successfully!',
            order: {
                id: order._id,
                visaType: order.visaType,
                packageName: order.packageName,
                status: order.status
            }
        });
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({ error: 'Payment verification failed' });
    }
});

/**
 * GET /api/orders
 * List all orders (for admin dashboard later)
 */
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

module.exports = router;
