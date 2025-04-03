async function formatJSON() {
    const jsonInput = document.getElementById('json-input').value;
    const res = await fetch('https://api-utility.ninhtqse.site/json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ json: jsonInput })
    });
    const data = await res.json();
    document.getElementById('json-output').innerText = data.success ? data.formattedJson : 'Invalid JSON';
}

async function minifyJSON() {
    const jsonInput = document.getElementById('json-input').value;
    const res = await fetch('http://localhost:3000/json/minify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ json: jsonInput })
    });
    const data = await res.json();
    document.getElementById('json-output').innerText = data.success ? data.minifiedJson : 'Invalid JSON';
}

function encodeJSON() {
    const jsonInput = document.getElementById('json-input').value;
    try {
        // Convert text to JSON string by escaping special characters
        const encodedJson = JSON.stringify(jsonInput);
        document.getElementById('json-output').innerText = encodedJson;
    } catch (error) {
        document.getElementById('json-output').innerText = 'Invalid input for JSON encoding';
    }
}