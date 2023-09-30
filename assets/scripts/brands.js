const selectPreviewImage = document.querySelector('.select-preview-img');
const imageInputFile = document.getElementById('img-file');
const previewImageArea = document.querySelector('.preview-img-area');

selectPreviewImage.addEventListener('click', function() {
    imageInputFile.click();
})

imageInputFile.addEventListener('change', function() {
    
    const selectedImage = this.files[0];
    
    if (selectedImage.size > 2000000) {

        const fileReader = new FileReader();

        fileReader.onload = () => {
            const allImages = previewImageArea.querySelectorAll('img');
            allImages.forEach(img => img.remove());
            const imgURL = fileReader.result;
            const imgTemplate = document.createElement('img');
            imgTemplate.src = imgURL;
            previewImageArea.appendChild(imgTemplate);
            previewImageArea.classList.add('active');
            previewImageArea.dataset.img = selectedImage.name;
        }
        fileReader.readAsDataURL(selectedImage);

    }

});