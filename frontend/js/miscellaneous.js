function generatePassword() {
    const length = document.getElementById("password-length").value;
    const includeLower = document.getElementById("include-lower").checked;
    const includeUpper = document.getElementById("include-upper").checked;
    const includeNumbers = document.getElementById("include-numbers").checked;
    const includeSymbols = document.getElementById("include-symbols").checked;

    let lowerChars = "abcdefghijklmnopqrstuvwxyz";
    let upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let numberChars = "0123456789";
    let symbolChars = "!@#$%^&*()+-=?_";

    let charPool = "";

    if (includeLower) charPool += lowerChars;
    if (includeUpper) charPool += upperChars;
    if (includeNumbers) charPool += numberChars;
    if (includeSymbols) charPool += symbolChars;

    if (charPool.length === 0) {
        document.getElementById("password-output").innerText = "Select at least one character type.";
        return;
    }

    let password = "";
    for (let i = 0; i < length; i++) {
        password += charPool[Math.floor(Math.random() * charPool.length)];
    }

    document.getElementById("password-output").innerText = password;
    evaluatePasswordStrength(password);
}

function evaluatePasswordStrength(password) {
    let strength = 0;
    if (password.length >= 12) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;

    let strengthText = ["Very Weak", "Weak", "Moderate", "Strong", "Very Strong"];

    strength = Math.min(strength, strengthText.length - 1);

    document.getElementById("password-strength").innerText = `${strengthText[strength]}`;
}

function generateQRCode() {
    let qrText = document.getElementById("qr-input").value;
    let qrContainer = document.getElementById("qr-output");

    qrContainer.innerHTML = "";

    if (qrText.trim() === "") {
        qrContainer.innerHTML = "<p style='color: red;'>Please enter text or URL to generate QR code.</p>";
        return;
    }

    new QRCode(qrContainer, {
        text: qrText,
        width: 200,
        height: 200
    });
}

function downloadQRCode() {
    let qrContainer = document.getElementById("qr-output").querySelector("img");

    if (!qrContainer) {
        alert("No QR Code found! Generate one first.");
        return;
    }

    let qrURL = qrContainer.src;
    let a = document.createElement("a");
    a.href = qrURL;
    a.download = "qrcode.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
