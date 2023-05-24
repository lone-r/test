window.addEventListener('DOMContentLoaded', (event) => {
    const uploadContainer = document.getElementById('uploadContainer');
    const uploadForm = document.getElementById('uploadForm');
    const fileInput = document.getElementById('fileInput');
    const fileLabel = document.getElementById('fileLabel');
    const progressBar = document.getElementById('progressBar');
    const statusContainer = document.getElementById('statusContainer');
    const statusText = document.getElementById('statusText');
    const resultContainer = document.getElementById('resultContainer');
    const resultText = document.getElementById('resultText');
    const modifiedVideo = document.getElementById('modifiedVideo');

    uploadForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const file = fileInput.files[0];
        if (file) {
            uploadContainer.style.display = 'none';
            statusContainer.style.display = 'block';
            statusText.textContent = 'Uploading...';

            uploadFile(file);
        }
    });

    function uploadFile(file) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/upload', true);

        xhr.upload.onprogress = (event) => {
            const progress = (event.loaded / event.total) * 100;
            progressBar.style.width = `${progress}%`;
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                // File upload success
                console.log('File uploaded successfully!');
                const response = JSON.parse(xhr.responseText);
                const videoUrl = response.videoUrl;
                addWatermark(videoUrl);
            } else {
                // File upload failed
                console.error('File upload failed!');
                statusText.textContent = 'Upload Failed!';
            }
        };

        xhr.onerror = () => {
            console.error('An error occurred during the file upload!');
            statusText.textContent = 'Upload Error!';
        };

        const formData = new FormData();
        formData.append('file', file);
        xhr.send(formData);
    }

    function addWatermark(videoUrl) {
        const video = document.createElement('video');
        video.src = videoUrl;

        video.onloadedmetadata = () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);

            ctx.font = 'bold 50px Arial';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fillText('Awesome time', 20, 50);

            const modifiedVideoUrl = canvas.toDataURL();
            modifiedVideo.src = modifiedVideoUrl;

            resultContainer.style.display = 'block';
            resultText.textContent = 'Video Modification Complete!';
            openNewWindow(modifiedVideoUrl);
        };
    }

    function openNewWindow(videoUrl) {
        const newWindow = window.open('', '_blank');
        newWindow.document.body.style.margin = '0';
        newWindow.document.body.style.overflow = 'hidden';
        newWindow.document.title = 'Modified Video';
        const video = newWindow.document.createElement('video');
        video.src = videoUrl;
        video.controls = true;
        video.autoplay = true;
        video.style.width = '100%';
        video.style.height = '100%';
        newWindow.document.body.appendChild(video);
    }
});
