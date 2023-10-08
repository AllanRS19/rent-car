const overlay = document.querySelector('.overlay');
const addClientBtn = document.getElementById('add-client-btn');
const closeOverlayIcon = document.querySelector('.close-overlay-icon');
const clientsForm = document.querySelector('.clients-form');
const formMessageContainer = document.querySelector('.form-message-container');
const formMessageContainerText = document.querySelector('.form-alert-message');
const submitFormBtn = clientsForm.querySelector('button');
const tableBodyContent = document.querySelector('.table-body-content');

let formAction = "create";
let formCompleted = false;
let editActionBtn;
let deleteActionBtn;

addClientBtn.onclick = () => overlay.classList.add('active');

closeOverlayIcon.onclick = () => {
    formMessageContainer.classList.remove('active');
    formMessageContainerText.textContent = "";
    overlay.classList.remove('active');
    clientsForm.reset();
};

if (document.querySelector('.user-actions')) {

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

function submitClientsForm() {

    console.log(formAction);

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
                                    ${clientName.value}
                                </td>
                                <td>${newClientPersonalId}</td>
                                <td>${clientCCNumberFormatted}</td>
                                <td>${clientCreditLimitFormatted}</td>
                                <td>Física</td>
                                <td>
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

                                submitFormBtn.innerHTML = "Cliente Añadido!";
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

                                    // deleteActionBtn = document.querySelectorAll('.delete-btn');

                                    // deleteActionBtn.forEach(delFuelBtn => delFuelBtn.addEventListener('click', function () {
                                    //     delet(this);
                                    // }));

                                    // editActionBtn = document.querySelectorAll('.edit-btn')

                                    // editActionBtn.forEach(editBtn => editBtn.addEventListener('click', function() {
                                    //     editBrand(this);
                                    // }));

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
        xhr.send(formData);

    } else {

        formMessageContainer.classList.add('active');

        formMessageContainerText.textContent = "Existen campos en blanco";

    }

};

clientsForm.onsubmit = e => e.preventDefault();