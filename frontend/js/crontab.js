async function convertCrontab() {
    const cronInput = document.getElementById('crontab-input').value;
    const res = await fetch('http://localhost:3000/crontab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cron: cronInput })
    });
    const data = await res.json();
    document.getElementById('crontab-output').innerText = data.success ? data.humanReadable : 'Invalid crontab';
}