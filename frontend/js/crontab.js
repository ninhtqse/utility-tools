async function convertCrontab() {
    const cronInput = document.getElementById('crontab-input').value;
    const res = await fetch('https://api-utility.ninhtqse.site/crontab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cron: cronInput })
    });
    const data = await res.json();
    document.getElementById('crontab-output').innerText = data.success ? data.humanReadable : 'Invalid crontab';
}

function updateCronDisplay(cronExpression) {
    const parts = cronExpression.split(' ');
    if (parts.length !== 5) return;

    const [minute, hour, dayMonth, month, dayWeek] = parts;
    
    // Update values
    document.querySelectorAll('.cron-part .cron-value').forEach((el, index) => {
        el.textContent = parts[index];
    });

    // Update description
    const nextDate = getNextCronDate(cronExpression);
    if (nextDate) {
        document.querySelector('.cron-header').textContent = `"${getHumanReadableCron(cronExpression)}"`;
        document.querySelector('.cron-next-run').textContent = `next at ${formatDate(nextDate)}`;
    }
}

function getNextCronDate(cronExpression) {
    try {
        const now = new Date();
        let next = now;
        const [minute, hour, dayMonth, month, dayWeek] = cronExpression.split(' ');
        
        // Simple implementation for specific time (like "5 4 * * *")
        next.setDate(next.getDate() + 1); // Move to next day
        next.setHours(parseInt(hour));
        next.setMinutes(parseInt(minute));
        next.setSeconds(0);
        next.setMilliseconds(0);
        
        return next;
    } catch (error) {
        console.error('Error calculating next date:', error);
        return null;
    }
}

function formatDate(date) {
    return date.toISOString().replace('T', ' ').slice(0, 19);
}

function getHumanReadableCron(cronExpression) {
    const parts = cronExpression.split(' ');
    if (parts.length !== 5) return 'Invalid cron expression';

    const [minute, hour] = parts;
    return `At ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}.`;
}

// Initialize with default cron expression
document.addEventListener('DOMContentLoaded', () => {
    updateCronDisplay('5 4 * * *');
});