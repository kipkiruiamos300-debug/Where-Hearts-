const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});

app.get('/', (req, res) => {
    res.json({ message: 'Server is running!' });
});

app.post('/api/send-telegram', (req, res) => {
    console.log('Received:', req.body);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
