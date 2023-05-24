window.addEventListener('DOMContentLoaded', (event) => {
    const uploadForm = document.getElementById('uploadForm');
    const fileInput = document.getElementById('fileInput');
    const progressBar = document.getElementById('progressBar');
    const resultSection = document.getElementById('result');
    const modifiedVideo = document.getElementById('modifiedVideo');
    const downloadLink = document.getElementById('downloadLink');

    uploadForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const file = fileInput.files[0];
        if (file) {
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
            }
        };

        xhr.onerror = () => {
            console.error('An error occurred during the file upload!');
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

            resultSection.style.display = 'block';
            modifiedVideo.play();
            downloadLink.style.display = 'block';
            downloadLink.href = modifiedVideoUrl;
            downloadLink.download = 'modified-video.mp4';
        };
    }
});
