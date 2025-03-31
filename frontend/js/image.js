let originalImage = new Image();

document.getElementById('imageInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            originalImage.onload = function () {
                // Cập nhật kích thước gốc
                document.getElementById('originalSize').innerText = `Original Size: ${originalImage.width} x ${originalImage.height}`;
            };
            originalImage.src = e.target.result;
            document.getElementById('preview').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

function resizeImage() {
    const width = parseInt(document.getElementById('widthInput').value);
    const height = parseInt(document.getElementById('heightInput').value);
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    if (!originalImage.src) {
        alert("Please upload an image first!");
        return;
    }

    if (!width || !height) {
        alert("Please enter valid width and height!");
        return;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(originalImage, 0, 0, width, height);

    // Hiển thị ảnh sau khi resize
    const resizedImage = canvas.toDataURL("image/png");
    document.getElementById('preview').src = resizedImage;

    // Cập nhật link download
    const downloadLink = document.getElementById('downloadLink');
    downloadLink.href = resizedImage;
    downloadLink.style.display = "block";
    downloadLink.innerText = "Download Resized Image";
}
