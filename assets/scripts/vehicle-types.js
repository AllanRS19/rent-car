const overlay = document.querySelector('.overlay'),
    closeOverlayBtn = document.querySelector('.close-overlay-icon'),
    vehicleTypeForm = document.querySelector('.overlay form'),
    vehicleTypeFormMessage = document.querySelector('.overlay form .form-message'),
    vehicleTypeFormMessageText = document.querySelector('.overlay form .form-message p'),
    addVehicleTypeContainerTop = document.querySelector('.add-vehicle-type-form-container-top h2'),
    vehicleTypeFormSubmitBtn = document.querySelector('.overlay form button'),
    addFeatureBtn = document.querySelector('.add-feature-btn'),
    infoDataContainer = document.querySelector('.info-data');

let deleteVehicleTypeBtns, editVehicleTypeBtns, formAction = "create";

if (infoDataContainer.querySelector('.card.vehicle-type')) {

    deleteVehicleTypeBtns = document.querySelectorAll('.delete-vehicle-type-btn');

    deleteVehicleTypeBtns.forEach(delFuelBtn => delFuelBtn.addEventListener('click', function () {
        deleteVehicleTypeBtn(this);
    }));

    editVehicleTypeBtns = document.querySelectorAll('.edit-vehicle-type-btn');

    editVehicleTypeBtns.forEach(edtFuelBtn => edtFuelBtn.addEventListener('click', function () {
        editVehicleTypeBtn(this);
    }));

}

function deleteVehicleTypeBtn(selfBtn) {

    const cardId = selfBtn.parentElement.parentElement.id;

    let xhr = new XMLHttpRequest();

    xhr.open("POST", "../server/procedures.php", true);

    xhr.onload = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const serverResponse = xhr.response;
                if (serverResponse == "vehicle_type_deleted") selfBtn.parentElement.parentElement.remove();
                else console.log('No se pudo eliminar: ', serverResponse);
            }
        }
    }
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send("vehicle_type_action=delete" + "&vehicle_type_id_to_delete=" + cardId);
}

function editVehicleTypeBtn(selfBtn) {

    console.log(selfBtn);

    formAction = "edit";

    const parentElement = selfBtn.parentElement.parentElement;

    const vehicleTypeName = parentElement.querySelector('.card-content-title').textContent;
    const vehicleTypeDescription = parentElement.querySelector('.card-content-description').textContent;
    const vehicleTypeState = parentElement.querySelector('.card-top-status span').textContent;
    
    addVehicleTypeContainerTop.textContent = "Editar Tipo de Combustible";
    vehicleTypeFormSubmitBtn.textContent = "Editar Combustible";

    vehicleTypeForm.querySelector('input').value = vehicleTypeName;
    vehicleTypeForm.querySelector('textarea').value = vehicleTypeDescription.trim();

    if (vehicleTypeState == "Disponible") vehicleTypeForm.querySelector('select').selectedIndex = 1;
    else if (vehicleTypeState == "No disponible") vehicleTypeForm.querySelector('select').selectedIndex = 2;

    overlay.classList.add('active');

    console.log(parentElement);
    console.log(parentElement.id);

    if (formAction == "edit") {
        vehicleTypeForm.onsubmit = function (e) {
            e.preventDefault();
            submitVehicleTypeForm(vehicleTypeForm, formAction, parentElement.id);
        }
    }
    else return;

}

addFeatureBtn.onclick = () => overlay.classList.add('active');

closeOverlayBtn.onclick = () => {
    overlay.classList.remove('active');
    vehicleTypeFormMessage.classList.remove('active');
    vehicleTypeForm.reset();
    addVehicleTypeContainerTop.textContent = "Añadir Tipo de Vehículo";
    vehicleTypeFormSubmitBtn.textContent = "Añadir Tipo de Vehículo";
    formAction = "create";
};

function submitVehicleTypeForm(selfForm, formActionReceived, cardId) {

    if (formActionReceived == "create") cardId = "none";

    let formComplete = false;

    let formFields = selfForm.querySelectorAll('input, textarea, select');

    for (cont = 0; cont < formFields.length; cont++) {
        if (formFields[cont].tagName != "SELECT") {
            if (formFields[cont].value == "") {
                formComplete = false;
                cont = formFields.length;
            } else {
                formComplete = true;
            }
        } else {
            if (formFields[cont].selectedIndex == 0) {
                formComplete = false;
                cont = formFields.length;
            } else {
                formComplete = true;
            }
        }
    }

    if (formComplete) {

        vehicleTypeFormMessage.classList.remove('active');

        let formSelectedOption = formFields[2].selectedIndex == 1 ? "Disponible" : "No disponible"

        vehicleTypeFormSubmitBtn.innerHTML = `<div class="loader"></div>`;

        let xhr = new XMLHttpRequest();

        xhr.open("POST", "../server/procedures.php", true);

        xhr.onload = () => {

            if (xhr.readyState === XMLHttpRequest.DONE) {

                if (xhr.status === 200) {

                    const data = xhr.response;

                    try {

                        const serverResponse = JSON.parse(data);

                        if (serverResponse.vehicle_type_add_status == "success") {

                            let cardTemplate =
                                `
                                <div class="card fuel-type" id="${serverResponse.vehicle_type_unique_id}">
                                    <div class="card-options-overlay">
                                        <button class="edit-vehicle-type-btn">Editar</button>
                                        <button class="delete-vehicle-type-btn">Eliminar</button>
                                    </div>
                                    <div class="card-background-img vehicle-types-background-img"></div>
                                    <div class="card-top">
                                        <div class="card-top-status ${formFields[2].selectedIndex == 1 ? "available" : "not-available"}">
                                            <span>${formSelectedOption}</span>
                                        </div>
                                    </div>
                                    <div class="card-content">
                                        <div class="icon-box">
                                            <i class='bx bx-car'></i>
                                        </div>
                                        <h4 class="card-content-title">${selfForm.querySelector('input.vehicle-type-name').value}</h4>
                                        <p class="card-content-description">${selfForm.querySelector('textarea.vehicle-type-description').value}</p>
                                    </div>
                                </div>
                            `;

                            setTimeout(() => {

                                let tmpInfoDataContent = infoDataContainer.innerHTML;

                                vehicleTypeFormSubmitBtn.innerHTML = "¡Tipo de Vehículo Añadido!";
                                vehicleTypeFormSubmitBtn.style.opacity = ".6";

                                if (formSelectedOption == "Disponible") {
                                    infoDataContainer.innerHTML = cardTemplate;
                                    infoDataContainer.innerHTML += tmpInfoDataContent;
                                }
                                else
                                    infoDataContainer.innerHTML += cardTemplate;

                                setTimeout(() => {

                                    overlay.classList.remove('active');
                                    vehicleTypeFormSubmitBtn.innerHTML = "Añadir Combustible";
                                    vehicleTypeFormSubmitBtn.style.opacity = "1";
                                    vehicleTypeForm.reset();

                                    deleteVehicleTypeBtns = document.querySelectorAll('.delete-vehicle-type-btn');

                                    deleteVehicleTypeBtns.forEach(delFuelBtn => delFuelBtn.addEventListener('click', function () {
                                        deleteVehicleTypeBtn(this);
                                    }));

                                    console.log(deleteVehicleTypeBtns);

                                    editVehicleTypeBtns = document.querySelectorAll('.edit-vehicle-type-btn');

                                    editVehicleTypeBtns.forEach(edtFuelBtn => edtFuelBtn.addEventListener('click', function () {
                                        editVehicleTypeBtn(this);
                                    }));

                                    console.log(editVehicleTypeBtns);

                                }, 1000);

                            }, 2000);

                        } else if (serverResponse.vehicle_type_edit_status == "success") {

                            setTimeout(() => {

                                vehicleTypeFormSubmitBtn.innerHTML = "¡Tipo de Vehículo Editado!";
                                vehicleTypeFormSubmitBtn.style.opacity = ".6";

                                const currentCard = document.getElementById(cardId);

                                console.log(currentCard, " ", cardId);

                                if (formFields[2].selectedIndex == 1) {
                                    currentCard.querySelector('.card-top-status').classList.remove('not-available');
                                    currentCard.querySelector('.card-top-status').classList.add('available');
                                } else if (formFields[2].selectedIndex == 2) {
                                    currentCard.querySelector('.card-top-status').classList.add('not-available');
                                    currentCard.querySelector('.card-top-status').classList.remove('available');
                                }

                                currentCard.querySelector('.card-top-status span').textContent = formFields[2].selectedIndex == 1 ? "Disponible" : "No disponible";
                                currentCard.querySelector('.card-content-title').textContent = selfForm.querySelector('input').value;
                                currentCard.querySelector('.card-content-description').textContent = selfForm.querySelector('textarea').value;

                                setTimeout(() => {

                                    overlay.classList.remove('active');
                                    vehicleTypeFormSubmitBtn.innerHTML = "Añadir Combustible";
                                    vehicleTypeFormSubmitBtn.style.opacity = "1";
                                    vehicleTypeForm.reset();

                                    formAction = "create";

                                    deleteVehicleTypeBtns = document.querySelectorAll('.delete-vehicle-type-btn');

                                    deleteVehicleTypeBtns.forEach(delFuelBtn => delFuelBtn.addEventListener('click', function () {
                                        deleteVehicleTypeBtn(this);
                                    }));

                                }, 1000);

                            }, 2000);

                        }

                    } catch (e) {

                        setTimeout(() => {

                            vehicleTypeFormMessage.classList.add('active');
                            vehicleTypeFormMessageText.textContent = data;

                            if (formAction == "create")
                                vehicleTypeFormSubmitBtn.innerHTML = "Añadir Tipo de Vehículo";
                            else if (formAction == "edit")
                                vehicleTypeFormSubmitBtn.innerHTML = "Editar Tipo de Vehículo";

                        }, 2000);

                    }

                }

            }

        }

        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send("vehicle_type_name=" + selfForm.querySelector('input.vehicle-type-name').value + "&vehicle_type_desc=" + selfForm.querySelector('textarea.vehicle-type-description').value + "&vehicle_type_state=" + formSelectedOption + "&vehicle_type_card_id=" + cardId + "&vehicle_type_action=" + formActionReceived);

    } else {

        vehicleTypeFormMessage.classList.add('active');
        vehicleTypeFormMessageText.textContent = 'Existen campos en blanco';

    }

}

vehicleTypeForm.onsubmit = function (e) {
    e.preventDefault();
    if (formAction != "create") return;
    submitVehicleTypeForm(this, formAction, "");
}