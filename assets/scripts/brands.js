const overlay = document.querySelector('.overlay');
const closeOverlayIcon = document.querySelector('.close-overlay-icon');
const formMessageContainer = document.querySelector('.form-message-container');
const formMessageText = document.querySelector('.form-alert-message');
const selectPreviewImage = document.querySelector('.select-preview-img');
const imageInputFile = document.getElementById('img-file');
const previewImageArea = document.querySelector('.preview-img-area');
const brandForm = document.querySelector('.brand-form');
const submitFormBtn = document.querySelector('.submit-brand-btn');
const addBrandBtn = document.getElementById('add-brand-btn');

let selectedImage = "";
let formCompleted = false;
let imageFileSelected = false;

addBrandBtn.onclick = () => overlay.classList.add('active');

closeOverlayIcon.addEventListener('click', () => {
    if (previewImageArea.querySelector('img'))
        previewImageArea.querySelector('img').remove();

    formMessageContainer.classList.remove('active');
    formMessageText.textContent = "";
    brandForm.reset();
    overlay.classList.remove('active');
});

selectPreviewImage.addEventListener('click', function () {
    imageInputFile.click();
})

imageInputFile.addEventListener('change', function () {

    selectedImage = this.files[0];

    if (selectedImage.size < 2000000) {

        formMessageText.textContent = "";
        formMessageContainer.classList.remove('active');

        imageFileSelected = true;

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

    } else {

        imageFileSelected = false;

        formMessageText.textContent = "El tamaño del archivo seleccionado es mayor a 2 MB";
        formMessageContainer.classList.add('active');

    }

});

submitFormBtn.addEventListener('click', () => {
    submitBrandForm();
});

function submitBrandForm() {

    let formFields = brandForm.querySelectorAll('input, textarea, select');

    for (cont = 0; cont < formFields.length; cont++) {
        if (formFields[cont].tagName != "SELECT") {
            if (formFields[cont].value == "") {
                formCompleted = false;
                cont = formFields.length;
            } else {
                formCompleted = true;
            }
        } else {
            if (formFields[cont].selectedIndex == 0) {
                formCompleted = false;
                cont = formFields.length;
            } else {
                formCompleted = true;
            }
        }
    }

    if (formCompleted && imageFileSelected) {
        
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "../server/procedures.php", true);
        xhr.onload = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    const serverResponse = xhr.response;
                }
            }
        }
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send();

    } else {

        formMessageContainer.classList.add('active');
        formMessageText.textContent = "Debes seleccionar un archivo y/o completar los campos";
        
    }

}