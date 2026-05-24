const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is alive!' });
});

app.get('/', (req, res) => {
    res.json({ status: 'OK', message: 'Where Hearts Meet API is running!' });
});

app.post('/api/send-telegram', (req, res) => {
    const data = req.body;
    console.log('Received:', data);
    res.json({ success: true, received: data });
});

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`✅ Health check: http://localhost:${PORT}/health`);
});
