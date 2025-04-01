// Reference: https://10015.io/tools/case-converter

function openTab(event, tabId) {
    document.querySelectorAll(".tab-content").forEach(tab => {
        tab.classList.remove("active");
    });
    document.querySelectorAll(".tab-button").forEach(button => {
        button.classList.remove("active");
    });

    document.getElementById(tabId).classList.add("active");
    event.currentTarget.classList.add("active");
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