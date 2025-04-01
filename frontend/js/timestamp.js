document.addEventListener("DOMContentLoaded", function () {
    const timezoneSelect = document.getElementById("timezone-select");
    const timezoneSearch = document.getElementById("timezone-search");
    const defaultTimezone = "Asia/Bangkok";
    const timezones = Intl.supportedValuesOf("timeZone");

    function populateTimezones(filter = "") {
        timezoneSelect.innerHTML = "";
        timezones.forEach(tz => {
            if (tz.toLowerCase().includes(filter.toLowerCase())) {
                let option = document.createElement("option");
                option.value = tz;
                option.textContent = tz;
                timezoneSelect.appendChild(option);
            }
        });
    }

    // Load tất cả timezone và đặt mặc định là "Asia/Ho_Chi_Minh"
    populateTimezones();
    timezoneSelect.value = defaultTimezone;

    // Lọc timezone khi nhập vào ô tìm kiếm
    timezoneSearch.addEventListener("input", function () {
        populateTimezones(this.value);
    });

    // Cập nhật timestamp hiện tại mỗi giây
    function updateCurrentTimestamp() {
        document.getElementById("current-timestamp").textContent = Math.floor(Date.now() / 1000);
    }
    updateCurrentTimestamp();
    setInterval(updateCurrentTimestamp, 1000);
});

function convertTimestamp() {
    const timestamp = parseInt(document.getElementById("timestamp-input").value) || Math.floor(Date.now() / 1000);
    const selectedTimezone = document.getElementById("timezone-select").value;

    if (isNaN(timestamp)) {
        document.getElementById("timestamp-output").textContent = "Invalid timestamp!";
        return;
    }

    const date = new Date(timestamp * 1000);
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        timeZone: selectedTimezone,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(date);

    document.getElementById("timestamp-output").textContent = formattedDate;
}
