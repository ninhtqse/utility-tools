const express = require('express');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');
const FingerprintJS = require('@fingerprintjs/fingerprintjs');
const cronstrue = require('cronstrue');
const axios = require("axios");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Decode & Format JSON
app.post('/json', (req, res) => {
    try {
        const formattedJson = JSON.stringify(JSON.parse(req.body.json), null, 4);
        res.json({ success: true, formattedJson });
    } catch (error) {
        res.json({ success: false, error: 'Invalid JSON' });
    }
});

// Generate UUID
app.get('/uuid', (req, res) => {
    res.json({ uuid: uuidv4() });
});

// Generate FingerprintJS
app.get('/fingerprint', async (req, res) => {
    try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        res.json({ fingerprint: result.visitorId });
    } catch (error) {
        res.status(500).json({ error: 'Error generating fingerprint' });
    }
});

// Convert crontab to readable format
app.post('/crontab', (req, res) => {
    try {
        const humanReadable = cronstrue.toString(req.body.cron);
        res.json({ success: true, humanReadable });
    } catch (error) {
        res.json({ success: false, error: 'Invalid crontab' });
    }
});

// Generate SHA-256 Hash
app.post('/sha256', (req, res) => {
    const hash = crypto.createHash('sha256').update(req.body.text).digest('hex');
    res.json({ hash });
});

// Generate Bcrypt Password Hash
app.post('/bcrypt', async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    res.json({ hash });
});

// Generate md5 Hash
app.post('/md5', (req, res) => {
    const hash = crypto.createHash('md5').update(req.body.password).digest('hex');
    res.json({ hash });
});

app.post('/base64/encode', (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });
    const encoded = Buffer.from(text).toString('base64');
    res.json({ encoded });
});

app.post('/base64/decode', (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });
    try {
        const decoded = Buffer.from(text, 'base64').toString('utf-8');
        res.json({ decoded });
    } catch (error) {
        res.status(400).json({ error: 'Invalid Base64 input' });
    }
});

app.post("/ip/ipapi", async (req, res) => {
    const { ip_address } = req.body;

    if (!ip_address) {
        return res.status(400).json({ error: "IP Address is required" });
    }

    try {
        const apiKey = '9b308a1f4af49a2d';
        const url = `https://api.ipapi.is?q=${ip_address}&key=${apiKey}`;

        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching IP data:", error.message);
        res.status(500).json({ error: "Failed to fetch IP information" });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
