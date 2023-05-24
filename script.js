window.addEventListener('DOMContentLoaded', (event) => {
    const uploadForm = document.getElementById('uploadForm');
    const fileInput = document.getElementById('fileInput');
    const progressBar = document.getElementById('progressBar');

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
});
