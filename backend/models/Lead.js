const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        trim: true,
        default: ''
    },
    destination: {
        type: String,
        required: [true, 'Destination is required'],
        trim: true
    },
    source: {
        type: String,
        trim: true,
        default: 'website'
    },
    status: {
        type: String,
        enum: ['new', 'contacted', 'converted'],
        default: 'new'
    }
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
