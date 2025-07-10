async function hashSHA256() {
    const text = document.getElementById('sha256-input').value;
    const res = await fetch('https://api-utility.ninhtqse.site/sha256', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text
        })
    });
    const data = await res.json();
    document.getElementById('sha256-output').innerText = data.hash;
}

async function hashMD5() {
    const password = document.getElementById('md5-input').value;
    const res = await fetch('https://api-utility.ninhtqse.site/md5', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            password
        })
    });
    const data = await res.json();
    document.getElementById('md5-output').innerText = data.hash;
}

async function hashBcrypt() {
    const password = document.getElementById('bcrypt-input').value;
    const res = await fetch('https://api-utility.ninhtqse.site/bcrypt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            password
        })
    });
    const data = await res.json();
    document.getElementById('bcrypt-output').innerText = data.hash;
}

function encodeBase64() {
    const text = document.getElementById("base64-input").value;
    fetch("https://api-utility.ninhtqse.site/base64/encode", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text
            })
        })
        .then(response => response.json())
        .then(data => document.getElementById("base64-output").innerText = data.encoded)
        .catch(error => console.error("Error encoding Base64:", error));
}

function decodeBase64() {
    const text = document.getElementById("base64-input").value;
    fetch("https://api-utility.ninhtqse.site/base64/decode", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                text
            })
        })
        .then(response => response.json())
        .then(data => document.getElementById("base64-output").innerText = data.decoded)
        .catch(error => console.error("Error decoding Base64:", error));
}

function encodeJWT() {
    try {
        const payloadInput = document.getElementById("jwtPayload").value;
        const secret = document.getElementById("jwtSecret").value;

        if (!payloadInput || !secret) {
            alert("Enter payload and secret key!");
            return;
        }

        let payload = JSON.parse(payloadInput);
        payload.iat = Math.floor(Date.now() / 1000); // Thêm iat (issued at)

        const header = { alg: "HS256", typ: "JWT" };
        const encodedJWT = KJUR.jws.JWS.sign("HS256", JSON.stringify(header), JSON.stringify(payload), secret);

        document.getElementById("jwtEncoded").innerText = encodedJWT;
    } catch (error) {
        alert("Invalid payload format!");
    }
}

function encodeURL() {
    const input = document.getElementById('url-input').value;
    if (!input) {
        alert('Please enter a URL');
        return;
    }
    const encoded = encodeURIComponent(input);
    document.getElementById('url-output').textContent = encoded;
}

function decodeURL() {
    const input = document.getElementById('url-input').value;
    if (!input) {
        alert('Please enter an encoded URL');
        return;
    }
    try {
        const decoded = decodeURIComponent(input);
        document.getElementById('url-output').textContent = decoded;
    } catch (error) {
        alert('Invalid encoded URL');
    }
}

// --- UI handler for EncryptPkcs7 Hash ---
async function hashEncryptPkcs7() {
    const accessKey = document.getElementById('encryptPkcs7-input').value;
    if (!accessKey) {
        alert('Please enter secret key');
        return;
    }
    const output = document.getElementById('encryptPkcs7-output');
    output.innerText = 'Encoding...';
    try {
        const res = await fetch('http://localhost:3000/encrypt-pkcs7', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accessKey })
        });
        const data = await res.json();
        if (data.result) {
            output.innerText = data.result;
        } else {
            output.innerText = 'Error: ' + (data.error || 'Not determined');
        }
    } catch (err) {
        output.innerText = 'Server connection error';
    }
}