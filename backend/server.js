const express = require('express');
const app = express();
const PORT = process.env.PORT;

console.log("PORT from environment:", PORT);

if (!PORT) {
    console.error("FATAL: No PORT environment variable set!");
    process.exit(1);
}

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'OK', port: PORT });
});

app.get('/', (req, res) => {
    res.send(`Server is running on port ${PORT}`);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`✅ Listening on 0.0.0.0:${PORT}`);
});
