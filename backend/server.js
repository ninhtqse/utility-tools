const express = require('express');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');
const FingerprintJS = require('@fingerprintjs/fingerprintjs');
const cronstrue = require('cronstrue');
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Create visitors directory if it doesn't exist
const visitorsDir = path.join(__dirname, 'visitors');
if (!fs.existsSync(visitorsDir)) {
    fs.mkdirSync(visitorsDir);
}

// Create visitors.json file if it doesn't exist
const visitorsFile = path.join(visitorsDir, 'visitors.json');
if (!fs.existsSync(visitorsFile)) {
    fs.writeFileSync(visitorsFile, JSON.stringify([]));
}

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

// Minify JSON
app.post('/json/minify', (req, res) => {
    try {
        const minifiedJson = JSON.stringify(JSON.parse(req.body.json));
        res.json({ success: true, minifiedJson });
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

app.post("/run-code", async (req, res) => {
    try {
        const { code, language } = req.body;
        
        // Map language to JDoodle language codes
        const languageMap = {
            'php': { code: 'php', version: '0' },
            'javascript': { code: 'nodejs', version: '4' },
            'python': { code: 'python3', version: '4' },
            'java': { code: 'java', version: '4' },
            'cpp': { code: 'cpp', version: '5' },
            'csharp': { code: 'csharp', version: '4' },
            'ruby': { code: 'ruby', version: '4' },
            'go': { code: 'go', version: '4' },
            'rust': { code: 'rust', version: '4' },
            'swift': { code: 'swift', version: '4' }
        };

        const langConfig = languageMap[language];
        if (!langConfig) {
            return res.status(400).json({ error: 'Unsupported programming language' });
        }

        const response = await axios.post('https://api.jdoodle.com/v1/execute', {
            script: code,
            language: langConfig.code,
            versionIndex: langConfig.version,
            clientId: "a4be9abaecf138bb3af6c382660c2ad3",
            clientSecret: "ee9f8250e3840fac4d6ea0643fb2987d9ce8c03ab6b7cf7f7af7628876cf7b5"
        });

        res.json(response.data);
    } catch (error) {
        console.error('Code execution error:', error);
        res.status(500).json({ error: "Failed to execute code" });
    }
});

// Track visitor
app.post('/track-visitor', (req, res) => {
    try {
        const { ip, userAgent, page, api, fingerprint } = req.body;
        const timestamp = new Date().toISOString();
        
        // Read existing visitors
        let visitors = [];
        try {
            const fileContent = fs.readFileSync(visitorsFile, 'utf8');
            visitors = JSON.parse(fileContent);
        } catch (error) {
            console.error('Error reading visitors file:', error);
            // If file doesn't exist or is invalid, start with empty array
            visitors = [];
        }
        
        // Add new visitor
        visitors.push({
            ip: ip || 'Unknown',
            userAgent: userAgent || 'Unknown',
            page: page || 'Unknown',
            api: api || 'None',
            fingerprint: fingerprint || 'Unknown',
            timestamp: timestamp
        });
        
        // Write back to file
        fs.writeFileSync(visitorsFile, JSON.stringify(visitors, null, 2));
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error tracking visitor:', error);
        res.status(500).json({ error: 'Failed to track visitor' });
    }
});

// Get visitors statistics
app.get('/visitors', (req, res) => {
    try {
        const visitors = JSON.parse(fs.readFileSync(visitorsFile, 'utf8'));
        res.json(visitors);
    } catch (error) {
        console.error('Error getting visitors:', error);
        res.status(500).json({ error: 'Failed to get visitors' });
    }
});

app.post('/encrypt-pkcs7', (req, res) => {
    try {
        const { accessKey } = req.body;
        if (!accessKey) {
            return res.status(400).json({ error: 'accessKey are required' });
        }

        function getCurrentUTCTimeString() {
            const now = new Date();
            const pad = n => n.toString().padStart(2, '0');
            const month = pad(now.getUTCMonth() + 1);
            const day = pad(now.getUTCDate());
            const year = now.getUTCFullYear();
            let hour = now.getUTCHours();
            const minute = pad(now.getUTCMinutes());
            const second = pad(now.getUTCSeconds());
            const ampm = hour >= 12 ? 'PM' : 'AM';
            hour = hour % 12;
            if (hour === 0) hour = 12;
            hour = pad(hour);
            return `${month}/${day}/${year} ${hour}:${minute}:${second} ${ampm}`;
        }

        const dateNow = getCurrentUTCTimeString();
        const md5 = crypto.createHash('md5').update(accessKey, 'utf8').digest();
        const key = Buffer.concat([md5, md5.slice(0, 8)]); // 24 bytes
        const cipher = crypto.createCipheriv('des-ede3', key, null);
        cipher.setAutoPadding(true);
        let encrypted = cipher.update(dateNow, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        const result = Buffer.from(`${accessKey}:${encrypted}`).toString('base64');
        res.json({ result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Encryption failed' });
    }
});

app.get('/p2p', async (req, res) => {
    try {
        const response = await axios.post('https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search', {
            fiat: "VND",
            page: 1,
            rows: 10,
            tradeType: "BUY",
            asset: "USDT",
            countries: [],
            proMerchantAds: false,
            shieldMerchantAds: false,
            filterType: "tradable",
            periods: [],
            additionalKycVerifyFilter: 0,
            publisherType: "merchant",
            payTypes: [],
            classifies: [
                "mass",
                "profession",
                "fiat_trade"
            ],
            tradedWith: false,
            followed: false,
            transAmount: 5000000
        });
        res.json({
            price: response.data.data?.[1].adv.price
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get p2p' });
    }
});


app.get('/sliver', async (req, res) => {
    try {
        const url = 'https://giabac.vn/SilverInfo/FilterData';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body: 'filterType=%23pills-profile'
        });

        const html = await response.text();

        const $ = cheerio.load(html);

        const buyPrice = $("#priceDiv .text-red").text().trim();

        const sellPrice = $("#priceDiv .text-green").text().trim();

        res.json({
            buy: buyPrice,
            sell: sellPrice,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get sliver' });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
