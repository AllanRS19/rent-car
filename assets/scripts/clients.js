const overlay = document.querySelector('.overlay');
const addClientBtn = document.getElementById('add-client-btn');
const closeOverlayIcon = document.querySelector('.close-overlay-icon');
const clientsForm = document.querySelector('.clients-form');
const formContainerTopText = document.querySelector('.form-container-top h3');
const formMessageContainer = document.querySelector('.form-message-container');
const formMessageContainerText = document.querySelector('.form-alert-message');
const submitFormBtn = clientsForm.querySelector('button');
const tableBodyContent = document.querySelector('.table-body-content');

let formAction = "create";
let formCompleted = false;
let editActionBtn;
let deleteActionBtn;
let rowSelectedId;

addClientBtn.onclick = () => overlay.classList.add('active');

closeOverlayIcon.onclick = () => {
    formAction = "create";
    formMessageContainer.classList.remove('active');
    formMessageContainerText.textContent = "";
    overlay.classList.remove('active');
    clientsForm.reset();
    formContainerTopText.textContent = "Añadir Cliente";
    submitFormBtn.textContent = "Añadir Cliente";
};

if (document.querySelector('.user-actions')) {

    deleteActionBtn = document.querySelectorAll('.delete-btn').forEach(delBtn => delBtn.addEventListener('click', function () {
        deleteClient(this);
    }));

    editActionBtn = document.querySelectorAll('.edit-btn').forEach(editBtn => editBtn.addEventListener('click', function () {
        editClient(this);
    }));

    document.querySelectorAll('.edit-btn').forEach(editBtn => editBtn.addEventListener('mouseover', function () {
        this.innerHTML = `<i class='bx bxs-edit-alt'></i>`;
    }));

    document.querySelectorAll('.edit-btn').forEach(editBtn => editBtn.addEventListener('mouseout', function () {
        this.innerHTML = `<i class='bx bx-edit-alt'></i>`;
    }));

    document.querySelectorAll('.delete-btn').forEach(editBtn => editBtn.addEventListener('mouseover', function () {
        this.innerHTML = `<i class='bx bxs-trash'></i>`;
    }));

    document.querySelectorAll('.delete-btn').forEach(editBtn => editBtn.addEventListener('mouseout', function () {
        this.innerHTML = `<i class='bx bx-trash'></i>`;
    }));

};

submitFormBtn.onclick = () => {
    submitClientsForm();
};

function formatNumberComas(number) {
    // Convierte el número a una cadena
    const numeroCadena = number.toString();

    // Calcula la longitud de la cadena
    const longitud = numeroCadena.length;

    // Determina cuántos grupos de tres dígitos habrá
    const grupos = Math.ceil(longitud / 3);

    // Inicializa una cadena de resultado vacía
    let resultado = '';

    // Itera a través de los grupos
    for (let i = 0; i < grupos; i++) {
        // Obtiene el grupo actual de tres dígitos
        let inicio = Math.max(longitud - (i + 1) * 3, 0);
        let fin = longitud - i * 3;
        let grupo = numeroCadena.slice(inicio, fin);

        // Agrega una coma si no es el último grupo
        if (i > 0) {
            resultado = ',' + resultado;
        }

        // Agrega el grupo al resultado
        resultado = grupo + resultado;
    }

    return resultado;
}

function editClient(selectedBtn) {

    formAction = "edit";

    const rowToBeEdited = selectedBtn.parentElement.parentElement.parentElement;
    console.log(rowToBeEdited);
    const rowToBeEditedId = rowToBeEdited.id;
    console.log(rowToBeEditedId);
    const clientImage = rowToBeEdited.querySelector('.rental-customer-img img').src;
    // console.log(clientImage);
    const clientName = rowToBeEdited.querySelector('.rental-customer-img span').textContent;
    // console.log(clientName);
    const clientPersonalId = rowToBeEdited.querySelector('.client-id-data').textContent;
    const unformattedClientPersonalId = clientPersonalId.replace(/-/g, '');
    // console.log(clientFormattedPersonalId);
    const clientCCNumber = rowToBeEdited.querySelector('.client-cc-data').textContent;
    const unformattedClientCCNumber = clientCCNumber.replace(/\s/g, '');
    // console.log(formattedClientCCNumber);
    const clientCL = rowToBeEdited.querySelector('.client-cl-data').textContent;
    const unformattedClientCL = clientCL.replace('DOP', '').replace(' ', '').replace(',', '');
    // console.log(formattedClientCL);
    const clientType = rowToBeEdited.querySelector('.client-type-data').textContent;
    // console.log(clientType);
    const clientState = rowToBeEdited.querySelector('.client-state-data p').textContent.trim();
    // console.log(clientState);

    const clientTypeSelectInput = clientsForm.querySelector('select.client-type');
    const clientStateSelectInput = clientsForm.querySelector('select.client-state');

    clientsForm.querySelector('.client-name').value = clientName;
    clientsForm.querySelector('.client-personal-id').value = unformattedClientPersonalId;
    clientsForm.querySelector('.client-cc-number').value = unformattedClientCCNumber;
    clientsForm.querySelector('.client-credit-limit').value = unformattedClientCL;
    clientsForm.querySelector('.client-image-url').value = clientImage;

    for (let cont = 0; cont < clientTypeSelectInput.options.length; cont++) {
        if (clientTypeSelectInput.options[cont].text == clientType) {
            clientTypeSelectInput.options[cont].selected = true;
            break;
        }
    }

    for (let cont = 0; cont < clientStateSelectInput.options.length; cont++) {
        if (clientStateSelectInput.options[cont].text == clientState) {
            clientStateSelectInput.options[cont].selected = true;
            break;
        }
    }

    formContainerTopText.textContent = "Editar Cliente";
    submitFormBtn.textContent = "Editar Cliente";

    overlay.classList.add('active');

    rowSelectedId = rowToBeEditedId;

    console.log(rowSelectedId);

    clientsForm.onsubmit = e => {
        e.preventDefault();
    }

}

function deleteClient(selectedBtn) {
    const rowToBeDeleted = selectedBtn.parentElement.parentElement.parentElement;
    const rowToBeDeletedId = rowToBeDeleted.id;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "../server/procedures.php", true);
    xhr.onload = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const serverResponse = xhr.response;
                if (serverResponse == "client_deleted") rowToBeDeleted.remove();
                else console.log("There was an error: " + serverResponse);
            }
        }
    }
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send("clientsFormAction=delete" + "&client_id_to_delete=" + rowToBeDeletedId);
}

function submitClientsForm() {

    console.log(formAction);

    if (formAction == "create") rowSelectedId = "";

    let formFields = clientsForm.querySelectorAll('input, textarea, select');

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

    if (formCompleted) {

        formMessageContainer.classList.remove('active');
        formMessageContainerText.textContent = "";

        submitFormBtn.innerHTML = `<div class="loader"></div>`;

        const clientName = clientsForm.querySelector('input.client-name');
        const clientPersonalIdNumber = clientsForm.querySelector('input.client-personal-id');
        const clientCCNumber = clientsForm.querySelector('input.client-cc-number');
        const clientCreditLimit = clientsForm.querySelector('input.client-credit-limit');
        const clientType = formFields[4].options[formFields[4].selectedIndex].text;
        const clientState = formFields[5].options[formFields[5].selectedIndex].text;
        const clientImageURL = clientsForm.querySelector('input.client-image-url');

        let xhr = new XMLHttpRequest();
        xhr.open("POST", "../server/procedures.php", true);
        xhr.onload = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {

                    const data = xhr.response;

                    try {

                        const serverResponse = JSON.parse(data);

                        if (serverResponse.client_add_status == "success") {

                            const newClientPersonalId = clientPersonalIdNumber.value.toString().slice(0, 3) + "-" + clientPersonalIdNumber.value.toString().slice(3, 10) + "-" + clientPersonalIdNumber.value.toString().slice(10);

                            const clientCCNumberFormatted = clientCCNumber.value.match(/.{1,4}/g).join(' ');

                            const clientCreditLimitFormatted = "DOP " + formatNumberComas(clientCreditLimit.value);

                            let clientRowTemplate =
                                `
                            <tr id=${serverResponse.client_unique_id}>
                                <td class="rental-customer-img">
                                    <img src="${clientImageURL.value}" alt="">
                                    <span>${clientName.value}</span>
                                </td>
                                <td class="client-id-data">${newClientPersonalId}</td>
                                <td class="client-cc-data">${clientCCNumberFormatted}</td>
                                <td class="client-cl-data">${clientCreditLimitFormatted}</td>
                                <td class="client-type-data">${clientType}</td>
                                <td class="client-state-data">
                                    <p class="status ${clientState == "Activo" ? "status-active" : "status-inactive"}">
                                        ${clientState}
                                    </p>
                                </td>
                                <td>
                                    <div class="user-actions">
                                        <div class="edit-btn action-btn">
                                            <i class='bx bx-edit-alt'></i>
                                        </div>
                                        <div class="delete-btn action-btn">
                                            <i class='bx bx-trash'></i>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            `;

                            setTimeout(() => {

                                let tmpInfoDataContent = tableBodyContent.innerHTML;

                                submitFormBtn.innerHTML = "!Cliente Añadido!";
                                submitFormBtn.style.opacity = ".6";

                                if (clientState == "Activo") {
                                    tableBodyContent.innerHTML = clientRowTemplate;
                                    tableBodyContent.innerHTML += tmpInfoDataContent;
                                }
                                else
                                    tableBodyContent.innerHTML += clientRowTemplate;

                                setTimeout(() => {

                                    closeOverlayIcon.click();

                                    submitFormBtn.innerHTML = "Añadir Cliente";
                                    submitFormBtn.style.opacity = "1";

                                    deleteActionBtn = document.querySelectorAll('.delete-btn').forEach(delBtn => delBtn.addEventListener('click', function () {
                                        deleteClient(this);
                                    }));

                                    editActionBtn = document.querySelectorAll('.edit-btn').forEach(editBtn => editBtn.addEventListener('click', function () {
                                        editClient(this);
                                    }));

                                }, 1000);

                            }, 2000);

                        } else if (serverResponse.client_update_status == "success") {

                            setTimeout(() => {

                                const currentEditedRow = document.getElementById(rowSelectedId);

                                console.log(currentEditedRow, " ", rowSelectedId);

                                const newClientPersonalId = clientPersonalIdNumber.value.toString().slice(0, 3) + "-" + clientPersonalIdNumber.value.toString().slice(3, 10) + "-" + clientPersonalIdNumber.value.toString().slice(10);

                                const clientCCNumberFormatted = clientCCNumber.value.match(/.{1,4}/g).join(' ');

                                const clientCreditLimitFormatted = "DOP " + formatNumberComas(clientCreditLimit.value);

                                currentEditedRow.querySelector('.rental-customer-img img').src = clientImageURL.value;

                                currentEditedRow.querySelector('.rental-customer-img span').textContent = clientName.value;

                                currentEditedRow.querySelector('.client-id-data').textContent = newClientPersonalId;

                                currentEditedRow.querySelector('.client-cc-data').textContent = clientCCNumberFormatted;

                                currentEditedRow.querySelector('.client-cl-data').textContent = clientCreditLimitFormatted;

                                currentEditedRow.querySelector('.client-type-data').textContent = clientType;

                                if (clientState == "Activo") {
                                    if (currentEditedRow.querySelector('.client-state-data p').classList.contains('status-inactive')) {
                                        currentEditedRow.querySelector('.client-state-data p').classList.remove('status-inactive');
                                        currentEditedRow.querySelector('.client-state-data p').classList.add('status-active');
                                    }
                                } else if (clientState == "Inactivo") {
                                    if (currentEditedRow.querySelector('.client-state-data p').classList.contains('status-active')) {
                                        currentEditedRow.querySelector('.client-state-data p').classList.remove('status-active');
                                        currentEditedRow.querySelector('.client-state-data p').classList.add('status-inactive');
                                    }
                                }

                                currentEditedRow.querySelector('.client-state-data p').textContent = clientState;

                                submitFormBtn.textContent = "¡Cliente Editado!";
                                submitFormBtn.style.opacity = ".6";

                                setTimeout(() => {

                                    submitFormBtn.style.opacity = "1";
                                    formAction = "create";

                                    editActionBtn = document.querySelectorAll('.edit-veh-model')

                                    editActionBtn.forEach(editBtn => editBtn.addEventListener('click', function () {
                                        editClient(this);
                                    }));

                                    deleteActionBtn = document.querySelectorAll('.delete-veh-btn');

                                    deleteActionBtn.forEach(delFuelBtn => delFuelBtn.addEventListener('click', function () {
                                        deleteClient(this);
                                    }));

                                    closeOverlayIcon.click();

                                }, 1000);

                            }, 2000);

                        }

                    } catch (e) {

                        console.log(e);

                        setTimeout(() => {

                            formMessageContainer.classList.add('active');
                            formMessageContainerText.textContent = data;

                            if (formAction == "create")
                                submitFormBtn.innerHTML = "Añadir Cliente";
                            else if (formAction == "edit")
                                submitFormBtn.innerHTML = "Editar Cliente";

                        }, 2000);

                    }

                }
            }
        }

        let formData = new FormData(clientsForm);
        formData.append("clientsFormAction", formAction);
        formData.append("clientType", clientType);
        formData.append("clientState", clientState);

        if (formAction == "edit") formData.append('client_id', rowSelectedId);

        xhr.send(formData);

    } else {

        formMessageContainer.classList.add('active');

        formMessageContainerText.textContent = "Existen campos en blanco";

    }

};

clientsForm.onsubmit = e => e.preventDefault();