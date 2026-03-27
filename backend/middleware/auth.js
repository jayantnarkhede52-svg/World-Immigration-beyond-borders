const crypto = require('crypto');

/**
 * Simple admin auth middleware
 * Uses ADMIN_PASSWORD from .env to generate/verify tokens
 */
function generateToken(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

function adminAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    const validToken = generateToken(process.env.ADMIN_PASSWORD || 'admin123');

    if (token !== validToken) {
        return res.status(401).json({ error: 'Invalid authentication token' });
    }

    next();
}

module.exports = { adminAuth, generateToken };
