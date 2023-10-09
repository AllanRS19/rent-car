const overlay = document.querySelector('.overlay');
const addEmployeeBtn = document.getElementById('add-employee-btn');
const closeOverlayIcon = document.querySelector('.close-overlay-icon');
const employeesForm = document.querySelector('.employees-form');
const formContainerTopText = document.querySelector('.form-container-top h3');
const formMessageContainer = document.querySelector('.form-message-container');
const formMessageContainerText = document.querySelector('.form-alert-message');
const submitFormBtn = employeesForm.querySelector('button');
const tableBodyContent = document.querySelector('.table-body-content');

let formAction = "create";
let formCompleted = false;
let editActionBtn;
let deleteActionBtn;
let rowSelectedId;

addEmployeeBtn.onclick = () => overlay.classList.add('active');

closeOverlayIcon.onclick = () => {
    formAction = "create";
    formMessageContainer.classList.remove('active');
    formMessageContainerText.textContent = "";
    overlay.classList.remove('active');
    employeesForm.reset();
    formContainerTopText.textContent = "Añadir Empleado";
    submitFormBtn.textContent = "Añadir Empleado";
};

if (document.querySelector('.user-actions')) {

    deleteActionBtn = document.querySelectorAll('.delete-btn').forEach(delBtn => delBtn.addEventListener('click', function () {
        deleteEmployee(this);
    }));

    editActionBtn = document.querySelectorAll('.edit-btn').forEach(editBtn => editBtn.addEventListener('click', function () {
        editEmployee(this);
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
    submitEmployeesForm();
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

function changeDateFormat(dateToFormat) {
    const fecha = new Date(dateToFormat);

    // Obtiene el día, mes y año de la fecha
    const dia = fecha.getDate() + 1;
    const mes = fecha.getMonth() + 1; // Nota: getMonth() devuelve un valor de 0 a 11, por lo que sumamos 1.
    const anio = fecha.getFullYear();

    // Formatea los componentes de la fecha como cadenas con ceros a la izquierda si es necesario
    const diaFormateado = dia < 10 ? '0' + dia : dia;
    const mesFormateado = mes < 10 ? '0' + mes : mes;

    // Construye la fecha en el formato deseado "día-mes-año"
    const fechaEnFormatoDiaMesAnio = diaFormateado + '/' + mesFormateado + '/' + anio;

    return fechaEnFormatoDiaMesAnio;
}

function reverseDateFormat(dateToFormat) {
    // Dividir la fecha en día, mes y año
    const partesFecha = dateToFormat.split("/");
    const dia = partesFecha[0];
    const mes = partesFecha[1];
    const año = partesFecha[2];

    // Crear la nueva fecha en formato año-mes-día
    const fechaOutput = año + "-" + mes + "-" + dia;

    return fechaOutput;
}

function extractNumber(stringToExtract) {
    const numeros = stringToExtract.match(/\d+/);

    if (numeros !== null) {
        const numeroExtraido = parseInt(numeros[0]);
        return numeroExtraido
    } else {
        console.log("No se encontraron números en la cadena.");
    }
}

function editEmployee(selectedBtn) {

    formAction = "edit";

    const rowToBeEdited = selectedBtn.parentElement.parentElement.parentElement;
    console.log(rowToBeEdited);
    const rowToBeEditedId = rowToBeEdited.id;
    console.log(rowToBeEditedId);
    const employeeImage = rowToBeEdited.querySelector('.rental-employee-img img').src;
    const employeeName = rowToBeEdited.querySelector('.rental-employee-img span').textContent;
    const employeePersonalId = rowToBeEdited.querySelector('.employee-id-data').textContent;
    const unformattedClientPersonalId = employeePersonalId.replace(/-/g, '');
    const employeeShift = rowToBeEdited.querySelector('.employee-shift-data').textContent;
    const employeeCommission = rowToBeEdited.querySelector('.employee-commission-data').textContent;
    const newEmployeeCommission = extractNumber(employeeCommission);
    const employeeJoinDate = rowToBeEdited.querySelector('.employee-join-date-data').textContent;
    const newEmployeeJoinDate = reverseDateFormat(employeeJoinDate);
    const employeeState = rowToBeEdited.querySelector('.employee-state-data p').textContent.trim();

    const employeeShiftSelectInput = employeesForm.querySelector('select.employee-shift');
    const employeeStateSelectInput = employeesForm.querySelector('select.employee-state');

    employeesForm.querySelector('.employee-name').value = employeeName;
    employeesForm.querySelector('.employee-personal-id').value = unformattedClientPersonalId;
    employeesForm.querySelector('.employee-commission').value = newEmployeeCommission;
    employeesForm.querySelector('.employee-join-date').value = newEmployeeJoinDate;
    employeesForm.querySelector('.employee-image-url').value = employeeImage;

    for (let cont = 0; cont < employeeShiftSelectInput.options.length; cont++) {
        if (employeeShiftSelectInput.options[cont].text == employeeShift) {
            employeeShiftSelectInput.options[cont].selected = true;
            break;
        }
    }

    for (let cont = 0; cont < employeeStateSelectInput.options.length; cont++) {
        if (employeeStateSelectInput.options[cont].text == employeeState) {
            employeeStateSelectInput.options[cont].selected = true;
            break;
        }
    }

    formContainerTopText.textContent = "Editar Cliente";
    submitFormBtn.textContent = "Editar Cliente";

    overlay.classList.add('active');

    rowSelectedId = rowToBeEditedId;

    // clientsForm.onsubmit = e => {
    //     e.preventDefault();
    // }

};

function deleteEmployee(selectedBtn) {
    const rowToBeDeleted = selectedBtn.parentElement.parentElement.parentElement;
    const rowToBeDeletedId = rowToBeDeleted.id;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "../server/procedures.php", true);
    xhr.onload = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const serverResponse = xhr.response;
                if (serverResponse == "employee_deleted") rowToBeDeleted.remove();
                else console.log("There was an error: " + serverResponse);
            }
        }
    }
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send("employeesFormAction=delete" + "&employee_id_to_delete=" + rowToBeDeletedId);
};

function submitEmployeesForm() {

    console.log(formAction);

    if (formAction == "create") rowSelectedId = "";

    let formFields = employeesForm.querySelectorAll('input, textarea, select');

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

        const employeePersonalIdNumber = employeesForm.querySelector('input.employee-personal-id');

        if (employeePersonalIdNumber.value.length == 11) {

            const employeeJoinDate = employeesForm.querySelector('input.employee-join-date');

            const selectedDate = new Date(employeeJoinDate.value);
            const actualDate = new Date();

            if (selectedDate <= actualDate) {

                formMessageContainer.classList.remove('active');
                formMessageContainerText.textContent = "";

                submitFormBtn.innerHTML = `<div class="loader"></div>`;

                const formattedDate = changeDateFormat(selectedDate);

                const employeeName = employeesForm.querySelector('input.employee-name');
                const employeeComission = employeesForm.querySelector('input.employee-commission');
                const employeeShift = formFields[3].options[formFields[3].selectedIndex].text;
                const employeeState = formFields[5].options[formFields[5].selectedIndex].text;
                const employeeImageURL = employeesForm.querySelector('input.employee-image-url');

                // console.log(employeePersonalIdNumber.value);
                // console.log(formattedDate);
                // console.log(employeeName.value);
                // console.log(employeeComission.value);
                // console.log(employeeShift);
                // console.log(employeeState);
                // console.log(employeeImageURL.value);

                let xhr = new XMLHttpRequest();

                xhr.open("POST", "../server/procedures.php", true);

                xhr.onload = () => {

                    if (xhr.readyState === XMLHttpRequest.DONE) {

                        if (xhr.status === 200) {

                            const data = xhr.response;

                            try {

                                const serverResponse = JSON.parse(data);

                                if (serverResponse.employee_add_status == "success") {

                                    const newEmployeePersonalId = employeePersonalIdNumber.value.toString().slice(0, 3) + "-" + employeePersonalIdNumber.value.toString().slice(3, 10) + "-" + employeePersonalIdNumber.value.toString().slice(10);

                                    let employeeRowTemplate =
                                        `
                                    <tr id=${serverResponse.employee_unique_id}>
                                        <td class="rental-employee-img">
                                            <img src="${employeeImageURL.value}" alt="">
                                            <span>${employeeName.value}</span>
                                        </td>
                                        <td class="employee-id-data">${newEmployeePersonalId}</td>
                                        <td class="employee-shift-data">${employeeShift}</td>
                                        <td class="employee-commission-data">${employeeComission.value + "% comisión por renta"}</td>
                                        <td class="employee-join-date-data">${formattedDate}</td>
                                        <td class="employee-state-data">
                                            <p class="status ${employeeState == "Activo" ? "status-active" : "status-inactive"}">
                                                ${employeeState}
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

                                        submitFormBtn.innerHTML = "¡Empleado Añadido!";
                                        submitFormBtn.style.opacity = ".6";

                                        if (employeeState == "Activo") {
                                            tableBodyContent.innerHTML = employeeRowTemplate;
                                            tableBodyContent.innerHTML += tmpInfoDataContent;
                                        }
                                        else
                                            tableBodyContent.innerHTML += employeeRowTemplate;

                                        setTimeout(() => {

                                            closeOverlayIcon.click();

                                            submitFormBtn.innerHTML = "Añadir Empleado";
                                            submitFormBtn.style.opacity = "1";

                                            deleteActionBtn = document.querySelectorAll('.delete-btn').forEach(delBtn => delBtn.addEventListener('click', function () {
                                                deleteEmployee(this);
                                            }));

                                            editActionBtn = document.querySelectorAll('.edit-btn').forEach(editBtn => editBtn.addEventListener('click', function () {
                                                editEmployee(this);
                                            }));

                                        }, 1000);

                                    }, 2000);

                                } else if (serverResponse.employee_update_status == "success") {

                                    setTimeout(() => {

                                        const currentEditedRow = document.getElementById(rowSelectedId);

                                        console.log(currentEditedRow, " ", rowSelectedId);

                                        const newClientPersonalId = employeePersonalIdNumber.value.toString().slice(0, 3) + "-" + employeePersonalIdNumber.value.toString().slice(3, 10) + "-" + employeePersonalIdNumber.value.toString().slice(10);

                                        currentEditedRow.querySelector('.rental-employee-img img').src = employeeImageURL.value;

                                        currentEditedRow.querySelector('.rental-employee-img span').textContent = employeeName.value;

                                        currentEditedRow.querySelector('.employee-id-data').textContent = newClientPersonalId;

                                        currentEditedRow.querySelector('.employee-shift-data').textContent = employeeShift;
                                        
                                        currentEditedRow.querySelector('.employee-commission-data').textContent = employeeComission.value + "% comisión por renta";

                                        currentEditedRow.querySelector('.employee-join-date-data').textContent = formattedDate;

                                        if (employeeState == "Activo") {
                                            if (currentEditedRow.querySelector('.employee-state-data p').classList.contains('status-inactive')) {
                                                currentEditedRow.querySelector('.employee-state-data p').classList.remove('status-inactive');
                                                currentEditedRow.querySelector('.employee-state-data p').classList.add('status-active');
                                            }
                                        } else if (employeeState == "Inactivo") {
                                            if (currentEditedRow.querySelector('.employee-state-data p').classList.contains('status-active')) {
                                                currentEditedRow.querySelector('.employee-state-data p').classList.remove('status-active');
                                                currentEditedRow.querySelector('.employee-state-data p').classList.add('status-inactive');
                                            }
                                        }

                                        currentEditedRow.querySelector('.employee-state-data p').textContent = employeeState;

                                        submitFormBtn.textContent = "¡Empleado Editado!";
                                        submitFormBtn.style.opacity = ".6";

                                        setTimeout(() => {

                                            submitFormBtn.style.opacity = "1";
                                            formAction = "create";

                                            editActionBtn = document.querySelectorAll('.edit-btn')

                                            editActionBtn.forEach(editBtn => editBtn.addEventListener('click', function () {
                                                editEmployee(this);
                                            }));

                                            deleteActionBtn = document.querySelectorAll('.delete-btn');

                                            deleteActionBtn.forEach(delFuelBtn => delFuelBtn.addEventListener('click', function () {
                                                deleteEmployee(this);
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
                                        submitFormBtn.innerHTML = "Añadir Empleado";
                                    else if (formAction == "edit")
                                        submitFormBtn.innerHTML = "Editar Empleado";

                                }, 2000);

                            }
                        }
                    }
                }

                let formData = new FormData(employeesForm);
                formData.append("employeesFormAction", formAction);
                formData.append("employeeShift", employeeShift);
                formData.append("employeeState", employeeState);
                formData.append("employeeJoinDate", formattedDate);

                if (formAction == "edit") formData.append('employee_id', rowSelectedId);

                xhr.send(formData);

            } else {

                formMessageContainer.classList.add('active');
                formMessageContainerText.textContent = "No se puede seleccionar una fecha posterior";

            }

        } else {

            formMessageContainer.classList.add('active');
            formMessageContainerText.textContent = "El número de cédula debe tener 11 dígitos";

        }

    } else {

        formMessageContainer.classList.add('active');

        formMessageContainerText.textContent = "Existen campos en blanco";

    }

};

employeesForm.onsubmit = e => e.preventDefault();