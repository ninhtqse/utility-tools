async function fetchUUID() {
    const res = await fetch('https://api-utility.ninhtqse.site/uuid');
    const data = await res.json();
    document.getElementById('uuid').innerText = data.uuid;
}

function fetchFingerprint() {
    import('https://openfpcdn.io/fingerprintjs/v3')
        .then(({ default: FingerprintJS }) => FingerprintJS.load())
        .then(fp => fp.get())
        .then(result => {
            document.getElementById('fingerprint').innerText = result.visitorId;
        })
        .catch(error => {
            console.error('FingerprintJS error:', error);
            document.getElementById('fingerprint').innerText = 'Error generating fingerprint';
        });
}