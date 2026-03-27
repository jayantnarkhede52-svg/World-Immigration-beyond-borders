/**
 * Free Agent Notification via Telegram Bot
 * 
 * Setup Instructions:
 * 1. Open Telegram, search for @BotFather
 * 2. Send /newbot and follow the steps to create your bot
 * 3. Copy the bot token → paste in .env as TELEGRAM_BOT_TOKEN
 * 4. Search for @userinfobot on Telegram, send /start to get your chat_id
 * 5. Paste your chat_id in .env as TELEGRAM_CHAT_ID
 * 6. IMPORTANT: Start a conversation with your new bot first (send it /start)
 */

async function sendTelegramMessage(message) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId || token === 'your_telegram_bot_token_here') {
        console.log('⚠️  Telegram not configured. Skipping notification.');
        return false;
    }

    try {
        const url = `https://api.telegram.org/bot${token}/sendMessage`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        const data = await response.json();
        if (data.ok) {
            console.log('✅ Telegram notification sent');
            return true;
        } else {
            console.error('❌ Telegram API error:', data.description);
            return false;
        }
    } catch (error) {
        console.error('❌ Failed to send Telegram notification:', error.message);
        return false;
    }
}

async function sendAgentNotification(orderDetails) {
    const message = `
🎉 *NEW PURCHASE ALERT!*

👤 *Customer:* ${orderDetails.customerName}
📧 *Email:* ${orderDetails.email}
📱 *Phone:* ${orderDetails.phone}

🌍 *Visa:* ${orderDetails.visaType}
📦 *Package:* ${orderDetails.packageName}
💰 *Amount:* ₹${(orderDetails.amount / 100).toLocaleString('en-IN')}

🆔 *Payment ID:* ${orderDetails.razorpayPaymentId}
📅 *Time:* ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
    `.trim();

    console.log('📋 Order details:', JSON.stringify(orderDetails, null, 2));
    return sendTelegramMessage(message);
}

async function sendInquiryNotification(inquiry) {
    const message = `
📩 *NEW INQUIRY RECEIVED!*

👤 *Name:* ${inquiry.name}
📧 *Email:* ${inquiry.email}
📋 *Interest:* ${inquiry.interest}

💬 *Message:*
${inquiry.message}

📅 *Time:* ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
    `.trim();

    console.log('📋 Inquiry details:', JSON.stringify(inquiry, null, 2));
    return sendTelegramMessage(message);
}

async function sendLeadNotification(lead) {
    const message = `
🔔 *NEW LEAD CAPTURED!*

👤 *Name:* ${lead.name}
📧 *Email:* ${lead.email}
📱 *Phone:* ${lead.phone || 'Not provided'}
🌍 *Destination:* ${lead.destination}
📍 *Source:* ${lead.source || 'website'}

📅 *Time:* ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
    `.trim();

    console.log('📋 Lead details:', JSON.stringify(lead, null, 2));
    return sendTelegramMessage(message);
}

module.exports = { sendAgentNotification, sendInquiryNotification, sendLeadNotification };
