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

function encodeJSON() {
    const textInput = document.getElementById('json-encode-input').value;
    try {
        const encodedJson = JSON.stringify(JSON.parse(textInput));
        document.getElementById('json-encode-output').innerText = encodedJson;
    } catch (error) {
        document.getElementById('json-encode-output').innerText = 'Invalid input for JSON encoding';
    }
}