async function getIpInfo() {
    const ipInput = document.getElementById('ip-input').value;
    const res = await fetch('http://localhost:3000/ip/ipapi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip_address: ipInput })
    });
    const data = await res.json();

    const format = await fetch('https://api-utility.ninhtqse.site/json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ json: JSON.stringify(data) })
    });
    const jsonData = await format.json();
    document.getElementById('ip-output').innerText = jsonData.success ? jsonData.formattedJson : 'Invalid JSON';
}