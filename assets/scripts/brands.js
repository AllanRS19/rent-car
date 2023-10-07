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
const infoDataContainer = document.querySelector('.info-data');

let selectedImage = "";
let formCompleted = false;
let imageFileSelected = false;
let formAction = "create";
let editBrandBtn;
let deleteBrandBtn;
let cardSelectedId = "";

if (document.querySelector('.card.brand-card')) {

    document.querySelectorAll('.delete-brand').forEach(delBtn => delBtn.addEventListener('click', function() {
        deleteBrand(this);
    }));

    document.querySelectorAll('.edit-brand').forEach(editBtn => editBtn.addEventListener('click', function() {
        editBrand(this);
    }));

}

addBrandBtn.onclick = () => {
    formAction = "create";
    overlay.classList.add('active')
};

closeOverlayIcon.addEventListener('click', () => {
    if (previewImageArea.querySelector('img'))
        previewImageArea.querySelector('img').remove();

    formMessageContainer.classList.remove('active');
    formMessageText.textContent = "";
    brandForm.reset();
    imageFileSelected = false;
    imageInputFile.value = '';
    selectedImage = "";
    previewImageArea.classList.remove('active');
    if (previewImageArea.querySelector('img')) previewImageArea.querySelector('img');
    document.querySelector('.form-container-top h3').textContent = "Añadir Marca de Vehículo";
    submitFormBtn.textContent = "Añadir Marca";
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

function editBrand(selectedEditBtn) {

    formAction = "edit";

    const cardElement = selectedEditBtn.parentElement.parentElement.parentElement;
    const cardElementId = cardElement.id;

    const brandName = cardElement.querySelector('.card-content-title').textContent;
    const brandDescription = cardElement.querySelector('.card-content-description').textContent;
    const brandState = cardElement.querySelector('.card-status span').textContent;

    document.querySelector('.form-container-top h3').textContent = "Editar Marca de Vehículo";
    submitFormBtn.textContent = "Editar Marca";

    brandForm.querySelector('input').value = brandName;
    brandForm.querySelector('textarea').value = brandDescription;

    if (brandState == "Disponible") brandForm.querySelector('select').selectedIndex = 1;
    else if (brandState == "No disponible") brandForm.querySelector('select').selectedIndex = 2;

    overlay.classList.add('active');

    cardSelectedId = cardElementId;

    console.log(cardSelectedId);

    brandForm.onsubmit = function (e) {
        submitBrandForm();
    }

}

function deleteBrand(selectedDeleteBtn) {

    const selectedCardElement = selectedDeleteBtn.parentElement.parentElement.parentElement;
    const selectedCardElementId = selectedCardElement.id;
    
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "../server/procedures.php", true);
    xhr.onload = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const serverResponse = xhr.response;
                if (serverResponse == "brand_deleted") selectedCardElement.remove();
                else console.log("Hubo un error al procesar la solicitud: ", serverResponse);
            }
        }
    }
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send("brandFormAction=delete" + "&brand_id_to_delete=" + selectedCardElementId);

}

function submitBrandForm() {
    
    console.log(formAction);

    if (formAction == "create") cardSelectedId = "";

    if (formAction == "edit") imageFileSelected = true;

    console.log(cardSelectedId);

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

        formMessageContainer.classList.remove('active');
        formMessageText.textContent = "";

        submitFormBtn.innerHTML = `<div class="loader"></div>`;

        const brandName = brandForm.querySelector('input.brand-name');
        const brandDescription = brandForm.querySelector('textarea.brand-description');
        const formSelectedOption = formFields[2].selectedIndex == 1 ? "Disponible" : "No disponible"

        let xhr = new XMLHttpRequest();
        xhr.open("POST", "../server/procedures.php", true);
        xhr.onload = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {

                    const data = xhr.response;

                    try {

                        const serverResponse = JSON.parse(data);

                        if (serverResponse.brand_add_status == "success") {

                            let cardTemplate = 
                            `
                            <div class="card brand-card" style="background: url('../assets/imgs/uploads/brands/${serverResponse.brand_image_path_name}') no-repeat center center/cover;" id="${serverResponse.brand_unique_id}">
                                <div class="card-content">
                                    <div class="card-status ${formFields[2].selectedIndex == 1 ? "available" : "not-available"}">
                                        <span>${formSelectedOption}</span>
                                    </div>
                                    <h4 class="card-content-title">${brandName.value}</h4>
                                    <p class="card-content-description">${brandDescription.value}</p>
                                    <div class="card-action-btns">
                                        <button class="edit-brand">Editar</button>
                                        <button class="delete-brand">Eliminar</button>
                                    </div>
                                </div>
                            </div>
                            `;

                            setTimeout(() => {

                                let tmpInfoDataContent = infoDataContainer.innerHTML;

                                submitFormBtn.innerHTML = "¡Marca Añadida!";
                                submitFormBtn.style.opacity = ".6";

                                if (formSelectedOption == "Disponible") {
                                    infoDataContainer.innerHTML = cardTemplate;
                                    infoDataContainer.innerHTML += tmpInfoDataContent;
                                }
                                else
                                    infoDataContainer.innerHTML += cardTemplate;

                                setTimeout(() => {

                                    closeOverlayIcon.click();

                                    submitFormBtn.innerHTML = "Añadir Marca";
                                    submitFormBtn.style.opacity = "1";

                                    deleteBrandBtn = document.querySelectorAll('.delete-brand');

                                    deleteBrandBtn.forEach(delFuelBtn => delFuelBtn.addEventListener('click', function () {
                                        deleteBrand(this);
                                    }));

                                    editBrandBtn = document.querySelectorAll('.edit-brand')

                                    editBrandBtn.forEach(editBtn => editBtn.addEventListener('click', function() {
                                        editBrand(this);
                                    }));

                                }, 1000);

                            }, 2000);

                        } else if (serverResponse.brand_update_status == "success") {
                            
                            setTimeout(() => {

                                submitFormBtn.innerHTML = "¡Marca Editada!";
                                submitFormBtn.style.opacity = ".6";

                                const currentEditedCard = document.getElementById(cardSelectedId);

                                console.log(currentEditedCard, " ", cardSelectedId);

                                if (serverResponse.new_brand_image_path_name) {
                                    currentEditedCard.style = `background: url('../assets/imgs/uploads/brands/${serverResponse.new_brand_image_path_name}') no-repeat center center/cover;`;
                                }

                                if (formFields[2].selectedIndex == 1) {
                                    currentEditedCard.querySelector('.card-status').classList.remove('not-available');
                                    currentEditedCard.querySelector('.card-status').classList.add('available');
                                } else if (formFields[2].selectedIndex == 2) {
                                    currentEditedCard.querySelector('.card-status').classList.add('not-available');
                                    currentEditedCard.querySelector('.card-status').classList.remove('available');
                                }

                                currentEditedCard.querySelector('.card-status span').textContent = formFields[2].selectedIndex == 1 ? "Disponible" : "No disponible";
                                currentEditedCard.querySelector('.card-content-title').textContent = brandForm.querySelector('input').value;
                                currentEditedCard.querySelector('.card-content-description').textContent = brandForm.querySelector('textarea').value;

                                setTimeout(() => {

                                    submitFormBtn.style.opacity = "1";
                                    formAction = "create";

                                    deleteVehicleTypeBtns = document.querySelectorAll('.delete-btn');

                                    deleteVehicleTypeBtns.forEach(delFuelBtn => delFuelBtn.addEventListener('click', function () {
                                        deleteBrand(this);
                                    }));

                                    closeOverlayIcon.click();

                                }, 1000);

                            }, 2000);

                        }

                    } catch (e) {

                        setTimeout(() => {

                            formMessageContainer.classList.add('active');
                            formMessageText.textContent = data;

                            if (formAction == "create")
                                submitFormBtn.innerHTML = "Añadir Combustible";
                            else if (formAction == "edit")
                                submitFormBtn.innerHTML = "Editar Combustible";

                        }, 2000);

                    }

                }
            }
        }

        let formData = new FormData(brandForm);
        formData.append("brandFormAction", formAction);
        formData.append("brandImageFile", selectedImage);
        formData.append("brand_state", formSelectedOption);

        if (formAction == "edit") formData.append("brand_id", cardSelectedId);

        xhr.send(formData);

    } else {

        formMessageContainer.classList.add('active');
        formMessageText.textContent = "Debes seleccionar un archivo y/o completar los campos";

    }

}