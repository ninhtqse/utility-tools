// Reference: https://10015.io/tools/case-converter

function openTab(evt, tabName) {
    // Remove active class from all nav items
    const navItems = document.getElementsByClassName("nav-item");
    for (let i = 0; i < navItems.length; i++) {
        navItems[i].classList.remove("active");
    }

    // Add active class to clicked nav item
    evt.currentTarget.classList.add("active");

    // Hide all tab content
    const tabContents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove("active");
    }

    // Show the selected tab content
    document.getElementById(tabName).classList.add("active");
}


document.addEventListener("DOMContentLoaded", function () {
    // Tìm tất cả các thẻ <pre> có class "output"
    document.querySelectorAll("pre.output").forEach(pre => {
        // Tạo nút copy
        let copyBtn = document.createElement("button");
        copyBtn.className = "copy-btn";
        copyBtn.innerHTML = "📋";
        copyBtn.onclick = function () {
            copyToClipboard(pre, copyBtn);
        };

        // Thêm nút vào trong div bọc thẻ <pre>
        let wrapper = document.createElement("div");
        wrapper.className = "copy-container";
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);
        wrapper.appendChild(copyBtn);
    });
});

// Hàm copy nội dung từ <pre> vào clipboard
function copyToClipboard(preElement, button) {
    let text = preElement.innerText;
    navigator.clipboard.writeText(text).then(() => {
        button.innerText = "✅";
        setTimeout(() => (button.innerText = "📋"), 1500);
    }).catch(err => console.error("Copy failed:", err));
}

function copySingleToClipboard(element, text) {
    navigator.clipboard.writeText(text).then(() => {
        const message = element.querySelector(".copied-message");

        // Hiển thị thông báo bằng cách thay đổi display
        message.style.display = "inline";

        // Ẩn lại sau 1.5 giây
        setTimeout(() => {
            message.style.display = "none";
        }, 1500);
    }).catch(err => {
        console.error("Failed to copy: ", err);
    });
}

function updateClock(id, timeZone, location) {
    const options = { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: timeZone };
    document.getElementById(id).innerText = `${location}: ${new Date().toLocaleString('en-US', options)}`;
}

function updateClocks() {
    updateClock('clock-vn', 'Asia/Ho_Chi_Minh', 'Vietnam');
    updateClock('clock-jp', 'Asia/Tokyo', 'Japan');
    updateClock('clock-us', 'America/Chicago', 'Chicago, USA');
}

setInterval(updateClocks, 1000);
updateClocks();