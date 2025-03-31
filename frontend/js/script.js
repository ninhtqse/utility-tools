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
