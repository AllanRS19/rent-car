const overlay = document.querySelector('.overlay'),
    closeOverlayBtn = document.querySelector('.close-overlay-icon'),
    fuelForm = document.querySelector('.overlay form'),
    fuelFormMessage = document.querySelector('.overlay form .form-message'),
    fuelFormMessageText = document.querySelector('.overlay form .form-message p'),
    addFuelContainerTop = document.querySelector('.add-fuel-form-container-top h2'),
    fuelFormSubmitBtn = document.querySelector('.overlay form button'),
    addFeatureBtn = document.querySelector('.add-feature-btn'),
    infoDataContainer = document.querySelector('.info-data');

let deleteFuelBtns, editFuelBtns, formAction = "create";

if (infoDataContainer.querySelector('.card.fuel-type')) {

    deleteFuelBtns = document.querySelectorAll('.delete-fuel-btn');

    deleteFuelBtns.forEach(delFuelBtn => delFuelBtn.addEventListener('click', function () {
        deleteFuelBtn(this);
    }));

    editFuelBtns = document.querySelectorAll('.edit-fuel-btn');

    editFuelBtns.forEach(edtFuelBtn => edtFuelBtn.addEventListener('click', function () {
        editFuelBtn(this);
    }));

}

function deleteFuelBtn(selfBtn) {

    const cardId = selfBtn.parentElement.parentElement.id;

    let xhr = new XMLHttpRequest();

    xhr.open("POST", "../server/procedures.php", true);

    xhr.onload = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const serverResponse = xhr.response;
                if (serverResponse == "fuel_deleted") selfBtn.parentElement.parentElement.remove();
                else console.log('No se pudo eliminar: ', serverResponse);
            }
        }
    }
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send("fuel_action=delete" + "&fuel_id_to_delete=" + cardId);
}

function editFuelBtn(selfBtn) {

    console.log(selfBtn);

    formAction = "edit";

    const parentElement = selfBtn.parentElement.parentElement;

    const fuelName = parentElement.querySelector('.card-content-title').textContent;
    const fuelDescription = parentElement.querySelector('.card-content-description').textContent;
    const fuelState = parentElement.querySelector('.card-top-status span').textContent;
    console.log(addFuelContainerTop);
    addFuelContainerTop.textContent = "Editar Tipo de Combustible";
    fuelFormSubmitBtn.textContent = "Editar Combustible";

    fuelForm.querySelector('input').value = fuelName;
    fuelForm.querySelector('textarea').value = fuelDescription.trim();

    if (fuelState == "Disponible") fuelForm.querySelector('select').selectedIndex = 1;
    else if (fuelState == "No disponible") fuelForm.querySelector('select').selectedIndex = 2;

    overlay.classList.add('active');

    console.log(parentElement);
    console.log(parentElement.id);

    if (formAction == "edit") {
        fuelForm.onsubmit = function (e) {
            e.preventDefault();
            submitFuelForm(fuelForm, formAction, parentElement.id);
        }
    }
    else return;

}

addFeatureBtn.onclick = () => overlay.classList.add('active');

closeOverlayBtn.onclick = () => {
    overlay.classList.remove('active');
    fuelFormMessage.classList.remove('active');
    fuelForm.reset();
    addFuelContainerTop.textContent = "Añadir Tipo de Combustible";
    fuelFormSubmitBtn.textContent = "Añadir Combustible";
    formAction = "create";
};

function submitFuelForm(selfForm, formActionReceived, cardId) {

    if (formActionReceived == "create") cardId = "none";

    // console.log('Se envió el formulario con la accion: ', formActionReceived, " ", selfForm, " y el Id: ", cardId);

    let formComplete = false;

    let formFields = selfForm.querySelectorAll('input, textarea, select');

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
                formComplete = false;
                cont = formFields.length;
            } else {
                formComplete = true;
            }
        }
    }

    if (formComplete) {

        fuelFormMessage.classList.remove('active');

        let formSelectedOption = formFields[2].selectedIndex == 1 ? "Disponible" : "No disponible"

        fuelFormSubmitBtn.innerHTML = `<div class="loader"></div>`;

        let xhr = new XMLHttpRequest();

        xhr.open("POST", "../server/procedures.php", true);

        xhr.onload = () => {

            if (xhr.readyState === XMLHttpRequest.DONE) {

                if (xhr.status === 200) {

                    const data = xhr.response;

                    try {

                        const serverResponse = JSON.parse(data);

                        if (serverResponse.fuel_add_status == "success") {

                            let cardTemplate =
                                `
                                <div class="card fuel-type" id="${serverResponse.fuel_unique_id}">
                                    <div class="card-options-overlay">
                                        <button class="edit-fuel-btn">Editar</button>
                                        <button class="delete-fuel-btn">Eliminar</button>
                                    </div>
                                    <div class="card-background-img"></div>
                                    <div class="card-top">
                                        <div class="card-top-status ${formFields[2].selectedIndex == 1 ? "available" : "not-available"}">
                                            <span>${formSelectedOption}</span>
                                        </div>
                                    </div>
                                    <div class="card-content">
                                        <div class="icon-box">
                                            <i class='bx bx-gas-pump'></i>
                                        </div>
                                        <h4 class="card-content-title">${selfForm.querySelector('input.fuel-name').value}</h4>
                                        <p class="card-content-description">${selfForm.querySelector('textarea.fuel-description').value}</p>
                                    </div>
                                </div>
                            `;

                            setTimeout(() => {

                                let tmpInfoDataContent = infoDataContainer.innerHTML;

                                fuelFormSubmitBtn.innerHTML = "¡Combustible Añadido!";
                                fuelFormSubmitBtn.style.opacity = ".6";

                                if (formSelectedOption == "Disponible") {
                                    infoDataContainer.innerHTML = cardTemplate;
                                    infoDataContainer.innerHTML += tmpInfoDataContent;
                                }
                                else
                                    infoDataContainer.innerHTML += cardTemplate;

                                setTimeout(() => {

                                    overlay.classList.remove('active');
                                    fuelFormSubmitBtn.innerHTML = "Añadir Combustible";
                                    fuelFormSubmitBtn.style.opacity = "1";
                                    fuelForm.reset();

                                    deleteFuelBtns = document.querySelectorAll('.delete-fuel-btn');

                                    deleteFuelBtns.forEach(delFuelBtn => delFuelBtn.addEventListener('click', function () {
                                        deleteFuelBtn(this);
                                    }));

                                    console.log(deleteFuelBtns);

                                    editFuelBtns = document.querySelectorAll('.edit-fuel-btn');

                                    editFuelBtns.forEach(edtFuelBtn => edtFuelBtn.addEventListener('click', function () {
                                        editFuelBtn(this);
                                    }));

                                }, 1000);

                            }, 2000);

                        } else if (serverResponse.fuel_edit_status == "success") {

                            setTimeout(() => {

                                fuelFormSubmitBtn.innerHTML = "¡Combustible Editado!";
                                fuelFormSubmitBtn.style.opacity = ".6";

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
                                    fuelFormSubmitBtn.innerHTML = "Añadir Combustible";
                                    fuelFormSubmitBtn.style.opacity = "1";
                                    fuelForm.reset();

                                    formAction = "create";

                                    deleteFuelBtns = document.querySelectorAll('.delete-fuel-btn');

                                    deleteFuelBtns.forEach(delFuelBtn => delFuelBtn.addEventListener('click', function () {
                                        deleteFuelBtn(this);
                                    }));

                                }, 1000);

                            }, 2000);

                        }

                    } catch (e) {

                        setTimeout(() => {

                            fuelFormMessage.classList.add('active');
                            fuelFormMessageText.textContent = data;

                            if (formAction == "create")
                                fuelFormSubmitBtn.innerHTML = "Añadir Combustible";
                            else if (formAction == "edit")
                                fuelFormSubmitBtn.innerHTML = "Editar Combustible";

                        }, 2000);

                    }

                }

            }

        }

        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send("fuel_name=" + selfForm.querySelector('input.fuel-name').value + "&fuel_desc=" + selfForm.querySelector('textarea.fuel-description').value + "&fuel_state=" + formSelectedOption + "&fuel_card_id=" + cardId + "&fuel_action=" + formActionReceived);

    } else {

        fuelFormMessage.classList.add('active');
        fuelFormMessageText.textContent = 'Existen campos en blanco';

    }

}

fuelForm.onsubmit = function (e) {
    e.preventDefault();
    if (formAction != "create") return;
    submitFuelForm(this, formAction, "");
}