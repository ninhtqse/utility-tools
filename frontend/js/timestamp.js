// Initialize Select2 for timezone selection
$(document).ready(function() {
    const timezones = moment.tz.names().map(tz => ({
        id: tz,
        text: `${tz.replace(/_/g, ' ')} (${moment.tz(tz).format('Z')})`
    }));

    $('#timezone-select').select2({
        data: timezones,
        placeholder: 'Select a timezone',
        allowClear: false,
        width: '100%',
        dropdownParent: $('#timestamp-tools')
    });

    // Set default timezone to Chicago
    $('#timezone-select').val('America/Chicago').trigger('change');
});

function convertTimestamp() {
    const timestamp = document.getElementById('timestamp-input').value;
    const timezone = document.getElementById('timezone-select').value;
    
    if (!timestamp) {
        document.getElementById('timestamp-output').textContent = 'Please enter a timestamp';
        return;
    }

    const date = moment.unix(timestamp);
    const convertedDate = date.tz(timezone);
    
    document.getElementById('timestamp-output').textContent = convertedDate.format('YYYY-MM-DD HH:mm:ss z');
}

// Update current timestamp
function updateCurrentTimestamp() {
    const timezone = document.getElementById('timezone-select').value;
    const now = moment().tz(timezone);
    document.getElementById('current-timestamp').textContent = now.unix();
}

// Update current timestamp every second
setInterval(updateCurrentTimestamp, 1000);
updateCurrentTimestamp();
