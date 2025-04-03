// Drag and drop functionality
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('imageInput');
const previewContainer = document.getElementById('imagePreviewContainer');
const preview = document.getElementById('preview');
const originalSize = document.getElementById('originalSize');
const widthInput = document.getElementById('widthInput');
const heightInput = document.getElementById('heightInput');
const maintainAspect = document.getElementById('maintainAspect');
const downloadLink = document.getElementById('downloadLink');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let originalImage = null;

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
});

// Highlight drop zone when dragging over it
['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, unhighlight, false);
});

// Handle dropped files
dropZone.addEventListener('drop', handleDrop, false);

// Handle click to upload
dropZone.addEventListener('click', () => fileInput.click());

// Handle file selection
fileInput.addEventListener('change', handleFileSelect);

// Handle maintain aspect ratio checkbox
maintainAspect.addEventListener('change', () => {
    if (maintainAspect.checked && originalImage) {
        const ratio = originalImage.width / originalImage.height;
        const newWidth = parseInt(widthInput.value);
        heightInput.value = Math.round(newWidth / ratio);
    }
});

// Handle width input change
widthInput.addEventListener('input', () => {
    if (maintainAspect.checked && originalImage) {
        const ratio = originalImage.width / originalImage.height;
        const newWidth = parseInt(widthInput.value);
        heightInput.value = Math.round(newWidth / ratio);
    }
});

// Handle height input change
heightInput.addEventListener('input', () => {
    if (maintainAspect.checked && originalImage) {
        const ratio = originalImage.width / originalImage.height;
        const newHeight = parseInt(heightInput.value);
        widthInput.value = Math.round(newHeight * ratio);
    }
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight(e) {
    dropZone.classList.add('dragover');
}

function unhighlight(e) {
    dropZone.classList.remove('dragover');
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

function handleFileSelect(e) {
    const files = e.target.files;
    handleFiles(files);
}

function handleFiles(files) {
    if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                originalImage = new Image();
                originalImage.onload = function() {
                    // Set original size info
                    originalSize.textContent = `${originalImage.width} x ${originalImage.height} pixels`;
                    
                    // Set initial dimensions
                    widthInput.value = originalImage.width;
                    heightInput.value = originalImage.height;
                    
                    // Show preview
                    preview.src = e.target.result;
                    previewContainer.style.display = 'block';
                    dropZone.style.display = 'none';
                };
                originalImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please upload an image file.');
        }
    }
}

function closePreview() {
    previewContainer.style.display = 'none';
    dropZone.style.display = 'block';
    originalImage = null;
    preview.src = '';
    downloadLink.style.display = 'none';
}

function resizeImage() {
    if (!originalImage) return;

    const newWidth = parseInt(widthInput.value);
    const newHeight = parseInt(heightInput.value);

    if (newWidth < 10 || newHeight < 10) {
        alert('Dimensions must be at least 10 pixels.');
        return;
    }

    // Set canvas dimensions
    canvas.width = newWidth;
    canvas.height = newHeight;

    // Draw resized image
    ctx.drawImage(originalImage, 0, 0, newWidth, newHeight);

    // Update preview
    preview.src = canvas.toDataURL('image/png');
    
    // Show download button
    downloadLink.href = canvas.toDataURL('image/png');
    downloadLink.download = 'resized-image.png';
    downloadLink.style.display = 'inline-flex';
}
