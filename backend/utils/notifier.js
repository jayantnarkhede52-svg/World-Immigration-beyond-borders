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

async function sendAgentNotification(orderDetails) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId || token === 'your_telegram_bot_token_here') {
        console.log('⚠️  Telegram not configured. Skipping notification.');
        console.log('📋 Order details:', JSON.stringify(orderDetails, null, 2));
        return;
    }

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
            console.log('✅ Telegram notification sent to agent');
        } else {
            console.error('❌ Telegram API error:', data.description);
        }
    } catch (error) {
        console.error('❌ Failed to send Telegram notification:', error.message);
    }
}

module.exports = { sendAgentNotification };
