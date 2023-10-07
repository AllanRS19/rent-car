const overlay = document.querySelector('.overlay');
const closeOverlayIcon = document.querySelector('.close-overlay-icon');
const formMessageContainer = document.querySelector('.form-message-container');
const formMessageText = document.querySelector('.form-alert-message');
const selectPreviewImage = document.querySelector('.select-preview-img');
const imageInputFile = document.getElementById('img-file');
const previewImageArea = document.querySelector('.preview-img-area');
const vehModelForm = document.querySelector('.veh-model-form');
const submitFormBtn = document.querySelector('.submit-veh-model-btn');
const addVehModelBtn = document.getElementById('add-veh-model-btn');
const infoDataContainer = document.querySelector('.info-data');

let selectedImage = "";
let formCompleted = false;
let imageFileSelected = false;
let formAction = "create";
let editVehModelBtn;
let deleteVehModelBtn;
let cardSelectedId = "";

if (document.querySelector('.card.veh-model-card')) {

    document.querySelectorAll('.delete-veh-model').forEach(delBtn => delBtn.addEventListener('click', function () {
        deleteVehModel(this);
    }));

    document.querySelectorAll('.edit-veh-model').forEach(editBtn => editBtn.addEventListener('click', function () {
        editVehModel(this);
    }));

}

addVehModelBtn.onclick = () => {
    formAction = "create";
    overlay.classList.add('active')
};

closeOverlayIcon.addEventListener('click', () => {
    if (previewImageArea.querySelector('img'))
        previewImageArea.querySelector('img').remove();

    formMessageContainer.classList.remove('active');
    formMessageText.textContent = "";
    vehModelForm.reset();
    imageFileSelected = false;
    imageInputFile.value = '';
    selectedImage = "";
    previewImageArea.classList.remove('active');
    if (previewImageArea.querySelector('img')) previewImageArea.querySelector('img');
    document.querySelector('.form-container-top h3').textContent = "Añadir Modelo de Vehículo";
    submitFormBtn.textContent = "Añadir Modelo";
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
    submitVehModelForm();
});

function editVehModel(selectedEditBtn) {

    formAction = "edit";

    const cardElement = selectedEditBtn.parentElement.parentElement.parentElement;
    const cardElementId = cardElement.id;

    const vehModelName = cardElement.querySelector('.card-content-title').textContent;
    const vehModelDescription = cardElement.querySelector('.card-content-description').textContent;
    const vehModelState = cardElement.querySelector('.card-status span').textContent;
    const vehModelBrandClasses = cardElement.parentElement.classList;
    const vehModelBrandSelect = document.querySelector('select.veh-model-brand');

    let vehModelBrand;

    if (vehModelBrandClasses.length == 4) {
        vehModelBrand = vehModelBrandClasses[2] + " " + vehModelBrandClasses[3];
    } else {
        vehModelBrand = vehModelBrandClasses[2];
    }

    document.querySelector('.form-container-top h3').textContent = "Editar Modelo de Vehículo";
    submitFormBtn.textContent = "Editar Modelo";

    vehModelForm.querySelector('input').value = vehModelName;
    vehModelForm.querySelector('textarea').value = vehModelDescription;

    for (let cont = 0; cont < vehModelBrandSelect.options.length; cont++) {
        if (vehModelBrandSelect.options[cont].text == vehModelBrand) {
            vehModelBrandSelect.options[cont].selected = true;
            break;
        }
    }

    if (vehModelState == "Disponible") vehModelForm.querySelector('select.veh-model-state').selectedIndex = 1;
    else if (vehModelState == "No disponible") vehModelForm.querySelector('select.veh-model-state').selectedIndex = 2;

    overlay.classList.add('active');

    cardSelectedId = cardElementId;

    console.log(cardSelectedId);

    vehModelForm.onsubmit = function (e) {
        submitBrandForm();
    }

}

function deleteVehModel(selectedDeleteBtn) {

    const selectedCardElement = selectedDeleteBtn.parentElement.parentElement.parentElement;
    const selectedCardElementId = selectedCardElement.id;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "../server/procedures.php", true);
    xhr.onload = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const serverResponse = xhr.response;
                if (serverResponse == "veh_model_deleted") selectedCardElement.remove();
                else console.log("Hubo un error al procesar la solicitud: ", serverResponse);
            }
        }
    }
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send("vehModelFormAction=delete" + "&veh_model_id_to_delete=" + selectedCardElementId);

}

function submitVehModelForm() {

    console.log(formAction);

    if (formAction == "create") cardSelectedId = "";

    if (formAction == "edit") imageFileSelected = true;

    console.log(cardSelectedId);

    let formFields = vehModelForm.querySelectorAll('input, textarea, select');

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

        const vehModelName = vehModelForm.querySelector('input.veh-model-name');
        // console.log(vehModelName);
        const vehModelDescription = vehModelForm.querySelector('textarea.veh-model-description');
        // console.log(vehModelDescription);
        const formBrandSelectedOption = formFields[2].options[formFields[2].selectedIndex].text;
        // console.log(formBrandSelectedOption);
        const formStateSelectedOption = formFields[3].selectedIndex == 1 ? "Disponible" : "No disponible";
        // console.log(formStateSelectedOption);

        let xhr = new XMLHttpRequest();
        xhr.open("POST", "../server/procedures.php", true);
        xhr.onload = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {

                    const data = xhr.response;

                    console.log(data);

                    try {

                        const serverResponse = JSON.parse(data);

                        if (serverResponse.veh_model_add_status == "success") {

                            let cardTemplate =
                                `
                            <div class="card veh-model-card" style="background: url('../assets/imgs/uploads/vehicle-models/${serverResponse.veh_model_image_path}') no-repeat center center/cover;" id="${serverResponse.veh_model_unique_id}">
                                <div class="card-content">
                                    <div class="card-status ${formStateSelectedOption == "Disponible" ? "available" : "not-available"}">
                                        <span>${formStateSelectedOption}</span>
                                    </div>
                                    <h4 class="card-content-title">${vehModelName.value}</h4>
                                    <p class="card-content-description">${vehModelDescription.value}</p>
                                    <div class="card-action-btns">
                                        <button class="edit-veh-model">Editar</button>
                                        <button class="delete-veh-model">Eliminar</button>
                                    </div>
                                </div>
                            </div>
                            `;

                            setTimeout(() => {

                                let infoDataModelContainer = document.querySelector('.info-data.' + formBrandSelectedOption);

                                let tmpInfoDataContent = infoDataModelContainer.innerHTML;

                                submitFormBtn.innerHTML = "¡Modelo Añadido!";
                                submitFormBtn.style.opacity = ".6";

                                if (formStateSelectedOption == "Disponible") {
                                    infoDataModelContainer.innerHTML = cardTemplate;
                                    infoDataModelContainer.innerHTML += tmpInfoDataContent;
                                }
                                else
                                    infoDataModelContainer.innerHTML += cardTemplate;

                                setTimeout(() => {

                                    closeOverlayIcon.click();

                                    submitFormBtn.innerHTML = "Añadir Modelo";
                                    submitFormBtn.style.opacity = "1";

                                    deleteVehModelBtn = document.querySelectorAll('.delete-veh-model');

                                    deleteVehModelBtn.forEach(delFuelBtn => delFuelBtn.addEventListener('click', function () {
                                        deleteVehModel(this);
                                    }));

                                    editVehModelBtn = document.querySelectorAll('.edit-veh-model')

                                    editVehModelBtn.forEach(editBtn => editBtn.addEventListener('click', function () {
                                        editVehModel(this);
                                    }));

                                }, 1000);

                            }, 2000);

                        } else if (serverResponse.veh_model_update_status == "success") {

                            setTimeout(() => {

                                const currentEditedCard = document.getElementById(cardSelectedId);

                                console.log(currentEditedCard, " ", cardSelectedId);

                                if (currentEditedCard.parentElement.classList.contains(formBrandSelectedOption)) {

                                    if (serverResponse.veh_model_image_path) {
                                        currentEditedCard.style = `background: url('../assets/imgs/uploads/vehicle-models/${serverResponse.veh_model_image_path}') no-repeat center center/cover;`;
                                    }
    
                                    if (formStateSelectedOption == "Disponible") {
                                        currentEditedCard.querySelector('.card-status').classList.remove('not-available');
                                        currentEditedCard.querySelector('.card-status').classList.add('available');
                                    } else if (formStateSelectedOption == "No disponible") {
                                        currentEditedCard.querySelector('.card-status').classList.add('not-available');
                                        currentEditedCard.querySelector('.card-status').classList.remove('available');
                                    }
    
                                    currentEditedCard.querySelector('.card-status span').textContent = formStateSelectedOption;
                                    currentEditedCard.querySelector('.card-content-title').textContent = vehModelForm.querySelector('input').value;
                                    currentEditedCard.querySelector('.card-content-description').textContent = vehModelForm.querySelector('textarea').value;

                                } else {

                                    let cardTemplate =
                                    `
                                    <div class="card veh-model-card" style="background: url('../assets/imgs/uploads/vehicle-models/${serverResponse.veh_model_image_path}') no-repeat center center/cover;" id="${cardSelectedId}">
                                        <div class="card-content">
                                            <div class="card-status ${formStateSelectedOption == "Disponible" ? "available" : "not-available"}">
                                                <span>${formStateSelectedOption}</span>
                                            </div>
                                            <h4 class="card-content-title">${vehModelName.value}</h4>
                                            <p class="card-content-description">${vehModelDescription.value}</p>
                                            <div class="card-action-btns">
                                                <button class="edit-veh-model">Editar</button>
                                                <button class="delete-veh-model">Eliminar</button>
                                            </div>
                                        </div>
                                    </div>
                                    `;

                                    currentEditedCard.remove();

                                    let infoDataModelContainer = document.querySelector('.info-data.' + formBrandSelectedOption);

                                    let tmpInfoDataContent = infoDataModelContainer.innerHTML;

                                    if (formStateSelectedOption == "Disponible") {
                                        infoDataModelContainer.innerHTML = cardTemplate;
                                        infoDataModelContainer.innerHTML += tmpInfoDataContent;
                                    }
                                    else
                                        infoDataModelContainer.innerHTML += cardTemplate;

                                }

                                submitFormBtn.innerHTML = "¡Marca Editada!";
                                submitFormBtn.style.opacity = ".6";

                                setTimeout(() => {

                                    submitFormBtn.style.opacity = "1";
                                    formAction = "create";

                                    editVehModelBtn = document.querySelectorAll('.edit-veh-model')

                                    editVehModelBtn.forEach(editBtn => editBtn.addEventListener('click', function () {
                                        editVehModel(this);
                                    }));

                                    deleteVehModelBtn = document.querySelectorAll('.delete-veh-btn');

                                    deleteVehModelBtn.forEach(delFuelBtn => delFuelBtn.addEventListener('click', function () {
                                        deleteVehModelBtn(this);
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
                                submitFormBtn.innerHTML = "Añadir Modelo";
                            else if (formAction == "edit")
                                submitFormBtn.innerHTML = "Editar Modelo";

                        }, 2000);

                    }

                }
            }
        }

        let formData = new FormData(vehModelForm);
        formData.append("vehModelFormAction", formAction);
        formData.append("vehModelImageFile", selectedImage);
        formData.append("veh_model_state", formStateSelectedOption);
        formData.append("veh_model_brand", formBrandSelectedOption);

        if (formAction == "edit") formData.append("veh_model_id", cardSelectedId);

        xhr.send(formData);

    } else {

        formMessageContainer.classList.add('active');
        formMessageText.textContent = "Debes seleccionar un archivo y/o completar los campos";

    }

}