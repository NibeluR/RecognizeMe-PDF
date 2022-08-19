function ValidateSize(file) {
    const FileSize = file.files[0].size / 1024 / 1024;
    if (FileSize > 5) {
        alert('🔴File size exceeds 5 MB. Please choose a different file!');
        document.getElementById('formFile').value = null;
    }
}
