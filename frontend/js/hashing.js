async function hashSHA256() {
    const text = document.getElementById('sha256-input').value;
    const res = await fetch('https://api-utility.ninhtqse.site/sha256', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
    });
    const data = await res.json();
    document.getElementById('sha256-output').innerText = data.hash;
}

async function hashMD5() {
    const password = document.getElementById('md5-input').value;
    const res = await fetch('https://api-utility.ninhtqse.site/md5', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
    });
    const data = await res.json();
    document.getElementById('md5-output').innerText = data.hash;
}

async function hashBcrypt() {
    const password = document.getElementById('bcrypt-input').value;
    const res = await fetch('https://api-utility.ninhtqse.site/bcrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
    });
    const data = await res.json();
    document.getElementById('bcrypt-output').innerText = data.hash;
}

function encodeBase64() {
    const text = document.getElementById("base64-input").value;
    fetch("https://api-utility.ninhtqse.site/base64/encode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
    })
        .then(response => response.json())
        .then(data => document.getElementById("base64-output").innerText = data.encoded)
        .catch(error => console.error("Error encoding Base64:", error));
}

function decodeBase64() {
    const text = document.getElementById("base64-input").value;
    fetch("https://api-utility.ninhtqse.site/base64/decode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
    })
        .then(response => response.json())
        .then(data => document.getElementById("base64-output").innerText = data.decoded)
        .catch(error => console.error("Error decoding Base64:", error));
}
