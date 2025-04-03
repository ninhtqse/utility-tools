async function fetchUUID() {
    const res = await fetch('https://api-utility.ninhtqse.site/uuid');
    const data = await res.json();
    document.getElementById('uuid').innerText = data.uuid;
}

async function fetchFingerprint() {
    const output = document.getElementById('fingerprint');
    try {
        // Create a simple fingerprint based on browser information
        const browserInfo = {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            colorDepth: window.screen.colorDepth,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        
        // Convert browser info to string and hash it
        const browserInfoStr = JSON.stringify(browserInfo);
        const fingerprint = await hashString(browserInfoStr);
        output.innerText = fingerprint;
    } catch (error) {
        console.error('Fingerprint error:', error);
        output.innerText = 'Error generating fingerprint';
    }
}

// Helper function to hash a string
async function hashString(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    // Only take first 16 characters (8 bytes) of the hash
    return hashArray.slice(0, 8).map(b => b.toString(16).padStart(2, '0')).join('');
}