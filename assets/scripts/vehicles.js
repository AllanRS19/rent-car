const overlay = document.querySelector('.overlay');
const closeOverlayIcon = document.querySelector('.close-overlay-icon');
const formMessageContainer = document.querySelector('.form-message-container');
const formMessageText = document.querySelector('.form-alert-message');
const selectPreviewImage = document.querySelector('.select-preview-img');
const imageInputFile = document.getElementById('img-file');
const previewImageArea = document.querySelector('.preview-img-area');
const vehicleForm = document.querySelector('.vehicles-form');
const brandSelect = document.querySelector('.vehicle-brand');
const submitFormBtn = document.querySelector('.submit-vehicle-btn');
const addVehicleBtn = document.getElementById('add-vehicle-btn');
const infoDataContainer = document.querySelector('.info-data');
const slidePage = document.querySelector('.slide-page');
const firstNextBtn = document.querySelector('.next-btn');
const prevBtnSec = document.querySelector('.prev');
const rentFormSubmit = document.querySelector('.submit');
const progressText = document.querySelectorAll('.step p');
const progressCheck = document.querySelectorAll('.step .check');
const progressBullet = document.querySelectorAll('.step .bullet');
const rentFormOverlay = document.querySelector('.rent-form-overlay');
const closeRentFormOverlay = document.querySelector('.close-rent-overlay-btn');
const rentForm = document.querySelector('.rent-form');
const rentDate = rentForm.querySelector('.rent-date');
const rentReturnDate = rentForm.querySelector('.rent-return-date');
const rentFormMessageContainer = document.querySelector('.rent-form-message-container');
const rentFormMessageContainerText = document.querySelector('.rent-form-message-container p');

let maxSlide = 2;
let currentSlide = 1;

let selectedImage = "";
let formCompleted = false;
let imageFileSelected = false;
let formAction = "create";
let editVehicleBtn;
let deleteVehicleBtn;
let optionsDisplay;
let cardSelectedId = "";
let rentCarBtn;
let rentDateComparison = false;

if (document.querySelector('.card.vehicle-card-container')) {

    document.querySelectorAll('.delete-vehicle-btn').forEach(delBtn => delBtn.addEventListener('click', function () {
        deleteVehicle(this);
    }));

    document.querySelectorAll('.edit-vehicle-btn').forEach(editBtn => editBtn.addEventListener('click', function () {
        editVehicle(this);
    }));

    document.querySelectorAll('.options-icon').forEach(vehCardOpt => vehCardOpt.addEventListener('click', function () {
        displayVehicleOptions(this);
    }));

    document.querySelectorAll('.rent-car-btn').forEach(rentBtn => rentBtn.addEventListener('click', function () {
        handleCarRequest(this);
    }));

};

brandSelect.addEventListener('change', function () {

    console.log("Cambio");

    if (this.selectedIndex != 0) {

        const selectedBrand = this.options[this.selectedIndex].text;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", "../server/procedures.php", true);
        xhr.onload = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    const data = xhr.response;
                    document.querySelector('.vehicle-model').innerHTML = data;
                }
            }
        }
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send("vehicleFormAction=filter" + "&brand_to_filter=" + selectedBrand);
    } else {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "../server/procedures.php", true);
        xhr.onload = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    const data = xhr.response;
                    document.querySelector('.vehicle-model').innerHTML = data;
                }
            }
        }
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send("vehicleFormAction=fetchAll");
    }

});

addVehicleBtn.onclick = () => {
    formAction = "create";
    overlay.classList.add('active');
    document.querySelectorAll('.options-icon').forEach(vehCardOpt => vehCardOpt.parentElement.querySelector('.options-display').classList.remove('active'));
};

closeOverlayIcon.addEventListener('click', () => {
    if (previewImageArea.querySelector('img'))
        previewImageArea.querySelector('img').remove();

    formMessageContainer.classList.remove('active');
    formMessageText.textContent = "";
    vehicleForm.reset();
    imageFileSelected = false;
    imageInputFile.value = '';
    selectedImage = "";
    previewImageArea.classList.remove('active');
    if (previewImageArea.querySelector('img')) previewImageArea.querySelector('img');
    document.querySelector('.form-container-top h3').textContent = "Añadir Vehículo";
    submitFormBtn.textContent = "Añadir Vehículo";
    overlay.classList.remove('active');
});

closeRentFormOverlay.addEventListener('click', () => {
    rentForm.reset();
    rentForm.querySelector('.vehicle-identifier').value = "";
    rentFormMessageContainer.classList.remove('active');
    rentFormMessageContainerText.textContent = "";
    rentFormOverlay.classList.remove('active');
    rentFormSubmit.textContent = "Rentar vehículo";
    rentFormSubmit.setAttribute('rentformaction', "rent");
    prevBtnSec.click();
});

selectPreviewImage.addEventListener('click', function () {
    imageInputFile.click();
});

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

rentForm.onsubmit = e => {
    e.preventDefault();
    rentFormAction();
};

rentDate.addEventListener('change', function () {
    console.log('Cambio');
    const selectedDate = new Date(this.value);
    console.log(selectedDate);
    const actualDate = new Date();
    console.log(actualDate);
    if (selectedDate >= actualDate) {
        rentFormMessageContainer.classList.remove('active');
        rentFormMessageContainerText.textContent = '';
        if (rentReturnDate.value != "") {
            if (selectedDate >= new Date(rentReturnDate.value)) {
                rentFormMessageContainer.classList.add('active');
                rentFormMessageContainerText.textContent = 'La fecha de renta no puede ser mayor que la devolución';
                rentDateComparison = false;
            } else {
                rentFormMessageContainer.classList.remove('active');
                rentFormMessageContainerText.textContent = '';
                rentDateComparison = true;
                rentForm.querySelector('.rent-days').value = (new Date(rentReturnDate.value).getDate() - new Date(rentDate.value).getDate());
            }
        }
    } else {
        rentDateComparison = false;
        rentFormMessageContainer.classList.add('active');
        rentFormMessageContainerText.textContent = 'No puede seleccionar una fecha pasada';
    };
});

rentReturnDate.addEventListener('change', function () {
    console.log('Cambio');
    const selectedDate = new Date(this.value);
    console.log(selectedDate);
    const actualDate = new Date();
    console.log(actualDate);
    if (selectedDate >= actualDate) {
        rentFormMessageContainer.classList.remove('active');
        rentFormMessageContainerText.textContent = '';
        if (rentDate.value != "") {
            if (selectedDate <= new Date(rentDate.value)) {
                rentFormMessageContainer.classList.add('active');
                rentFormMessageContainerText.textContent = 'La fecha de devolución no puede ser mayor que la renta';
                rentDateComparison = false;
            } else {
                rentFormMessageContainer.classList.remove('active');
                rentFormMessageContainerText.textContent = '';
                rentDateComparison = true;
                rentForm.querySelector('.rent-days').value = (new Date(rentDate.value).getDate() - new Date(rentReturnDate.value).getDate());
            }
        }
    } else {
        rentDateComparison = false;
        rentFormMessageContainer.classList.add('active');
        rentFormMessageContainerText.textContent = 'No puede seleccionar una fecha pasada';
    };
});

function displayVehicleOptions(currentVehicleCardOptions) {
    currentVehicleCardOptions.parentElement.querySelector('.options-display').classList.toggle('active');
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
};

function editVehicle(selectedEditBtn) {

    formAction = "edit";

    const cardElement = selectedEditBtn.parentElement.parentElement.parentElement.parentElement.parentElement;
    const cardElementId = cardElement.id;

    cardElement.querySelector('.options-display').classList.remove('active');

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "../server/procedures.php", true);
    xhr.onload = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const serverResponse = xhr.response;
                const parsedData = JSON.parse(serverResponse);

                let newVehicleState = "";

                if (parsedData.vehicle_state == "No disponible") newVehicleState = "No Disponible";

                for (let cont = 0; cont < brandSelect.options.length; cont++) {
                    if (brandSelect.options[cont].text == parsedData.vehicle_brand) {
                        brandSelect.options[cont].selected = true;
                        break;
                    }
                }

                for (let cont = 0; cont < vehicleForm.querySelector('select.vehicle-model').options.length; cont++) {
                    if (vehicleForm.querySelector('select.vehicle-model').options[cont].text == parsedData.vehicle_model) {
                        vehicleForm.querySelector('select.vehicle-model').options[cont].selected = true;
                        break;
                    }
                }

                for (let cont = 0; cont < vehicleForm.querySelector('select.vehicle-fuel').options.length; cont++) {
                    if (vehicleForm.querySelector('select.vehicle-fuel').options[cont].text == parsedData.vehicle_fuel) {
                        vehicleForm.querySelector('select.vehicle-fuel').options[cont].selected = true;
                        break;
                    }
                }

                for (let cont = 0; cont < vehicleForm.querySelector('select.vehicle-type').options.length; cont++) {
                    if (vehicleForm.querySelector('select.vehicle-type').options[cont].text == parsedData.vehicle_type) {
                        vehicleForm.querySelector('select.vehicle-type').options[cont].selected = true;
                        break;
                    }
                }

                for (let cont = 0; cont < vehicleForm.querySelector('select.vehicle-state').options.length; cont++) {
                    if (vehicleForm.querySelector('select.vehicle-state').options[cont].text == parsedData.vehicle_state) {
                        vehicleForm.querySelector('select.vehicle-state').options[cont].selected = true;
                        break;
                    } else if (vehicleForm.querySelector('select.vehicle-state').options[cont].text == newVehicleState) {
                        vehicleForm.querySelector('select.vehicle-state').options[cont].selected = true;
                        break;
                    }
                }

                vehicleForm.querySelector('input.vehicle-year').value = parsedData.vehicle_year;
                vehicleForm.querySelector('input.vehicle-plate').value = parsedData.vehicle_plate;
                vehicleForm.querySelector('input.vehicle-motor-num').value = parsedData.vehicle_motor;
                vehicleForm.querySelector('input.vehicle-chasis-num').value = parsedData.vehicle_chasis;
                vehicleForm.querySelector('input.vehicle-passengers-count').value = parsedData.vehicle_passengers;
                vehicleForm.querySelector('input.vehicle-price').value = parsedData.vehicle_price;
                vehicleForm.querySelector('input.vehicle-description').value = parsedData.vehicle_description;

            }
        }
    }
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send("vehicleFormAction=search" + "&vehicle_id_to_search=" + cardElementId);

    document.querySelector('.form-container-top h3').textContent = "Editar Vehículo";
    submitFormBtn.textContent = "Editar Modelo";

    overlay.classList.add('active');

    cardSelectedId = cardElementId;

    console.log(cardSelectedId);

    vehicleForm.onsubmit = function (e) {
        submitBrandForm();
    }

};

function deleteVehicle(selectedDeleteBtn) {

    const selectedCardElement = selectedDeleteBtn.parentElement.parentElement.parentElement.parentElement.parentElement;
    const selectedCardElementId = selectedCardElement.id;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "../server/procedures.php", true);
    xhr.onload = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const serverResponse = xhr.response;
                if (serverResponse == "vehicle_deleted") selectedCardElement.remove();
                else console.log("Hubo un error al procesar la solicitud: ", serverResponse);
            }
        }
    }
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send("vehicleFormAction=delete" + "&vehicle_id_to_delete=" + selectedCardElementId);

};

function submitVehModelForm() {

    console.log(formAction);

    if (formAction == "create") cardSelectedId = "";

    if (formAction == "edit") imageFileSelected = true;

    console.log(cardSelectedId);

    let formFields = vehicleForm.querySelectorAll('input, select');

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

        const vehicleBrand = formFields[0].options[formFields[0].selectedIndex].text;
        console.log(vehicleBrand);
        const vehicleModel = formFields[1].options[formFields[1].selectedIndex].text;
        console.log(vehicleModel);
        const vehicleYear = vehicleForm.querySelector('input.vehicle-year');
        console.log(vehicleYear.value);
        const vehicleType = formFields[3].options[formFields[3].selectedIndex].text;
        console.log(vehicleType);
        const vehicleFuel = formFields[4].options[formFields[4].selectedIndex].text;
        console.log(vehicleFuel);
        const vehiclePlate = document.querySelector('input.vehicle-plate');
        console.log(vehiclePlate.value);
        const vehiclePrice = document.querySelector('input.vehicle-price');
        console.log(vehiclePrice.value);
        const vehiclePassengers = document.querySelector('input.vehicle-passengers-count');
        console.log(vehiclePassengers.value);
        const vehicleState = formFields[11].selectedIndex == 1 ? "Disponible" : "No disponible";
        console.log(vehicleState);

        let xhr = new XMLHttpRequest();
        xhr.open("POST", "../server/procedures.php", true);
        xhr.onload = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {

                    const data = xhr.response;

                    console.log(data);

                    try {

                        const serverResponse = JSON.parse(data);

                        if (serverResponse.vehicle_add_status == "success") {

                            let cardTemplate =
                                `
                                <div class="card vehicle-card-container" id="${serverResponse.vehicle_unique_id}">
                                    <div class="vehicle-card-container-top">
                                        <div class="vehicle-card-top-left">
                                            <h2>${vehicleBrand} ${vehicleModel} <span>${vehicleYear.value}</span></h2>
                                            <span class="price-per-day">DOP ${formatNumberComas(vehiclePrice.value)} / Día</span>
                                        </div>
                                        <div class="vehicle-card-top-right ${vehicleState == "Disponible" ? "vehicle-status-available" : "vehicle-status-not-available"}">
                                            <p>${vehicleState}</p>
                                        </div>
                                    </div>
                                    <div class="vehicle-card-container-img">
                                        <img src="../assets/imgs/uploads/vehicles/${serverResponse.vehicle_image_path}" alt="">
                                    </div>
                                    <div class="vehicle-card-container-content">
                                        <div class="vehicle-card-container-content-info">
                                            <div class="vehicle-info-data seats">
                                                <i class='bx bxs-user'></i>
                                                <span>${vehiclePassengers.value} personas</span>
                                            </div>
                                            <div class="vehicle-info-data fuel">
                                                <i class='bx bxs-gas-pump'></i>
                                                <span>${vehicleFuel}</span>
                                            </div>
                                            <div class="vehicle-info-data vehicle-type">
                                                <i class='bx bxs-car'></i>
                                                <span>${vehicleType}</span>
                                            </div>
                                            <div class="vehicle-info-data plate">
                                                <i class='bx bxs-notepad'></i>
                                                <span>${vehiclePlate.value}</span>
                                            </div>
                                        </div>
                                        <hr class="rental-divider">
                                        <div class="btn-actions-wrapper">
                                            <div class="vehicle-card-options">
                                                <i class='bx bx-dots-horizontal-rounded options-icon'></i>
                                                <div class="options-display">
                                                    <button class="edit-vehicle-btn">Editar</button>
                                                    <button class="delete-vehicle-btn">Eliminar</button>
                                                </div>
                                            </div>
                                            <button class="rent-car-btn ${vehicleState == "No disponible" ? "disabled" : ""}" ${vehicleState == "No disponible" ? "disabled" : ""} btnaction="rent-car">Rentar</button>
                                        </div>
                                    </div>
                                </div>
                            `;

                            setTimeout(() => {

                                let infoDataModelContainer;

                                infoDataModelContainer = document.querySelector('.info-data.vehicles');

                                console.log(infoDataModelContainer);

                                let tmpInfoDataContent = infoDataModelContainer.innerHTML;

                                submitFormBtn.innerHTML = "Vehículo Añadido!";
                                submitFormBtn.style.opacity = ".6";

                                if (vehicleState == "Disponible") {
                                    infoDataModelContainer.innerHTML = cardTemplate;
                                    infoDataModelContainer.innerHTML += tmpInfoDataContent;
                                }
                                else
                                    infoDataModelContainer.innerHTML += cardTemplate;

                                setTimeout(() => {

                                    submitFormBtn.innerHTML = "Añadir Vehículo";
                                    submitFormBtn.style.opacity = "1";

                                    deleteVehicleBtn = document.querySelectorAll('.delete-vehicle-btn');

                                    deleteVehicleBtn.forEach(delFuelBtn => delFuelBtn.addEventListener('click', function () {
                                        deleteVehicle(this);
                                    }));

                                    editVehicleBtn = document.querySelectorAll('.edit-vehicle-btn');

                                    editVehicleBtn.forEach(editBtn => editBtn.addEventListener('click', function () {
                                        editVehicle(this);
                                    }));

                                    optionsDisplay = document.querySelectorAll('.vehicle-card-options .options-icon');

                                    optionsDisplay.forEach(vehCardOpt => vehCardOpt.addEventListener('click', function () {
                                        displayVehicleOptions(this);
                                    }));

                                    rentCarBtn = document.querySelectorAll('.rent-car-btn');

                                    rentCarBtn.forEach(rentBtn => rentBtn.addEventListener('click', function () {
                                        handleCarRequest(this);
                                    }));

                                    closeOverlayIcon.click();

                                }, 1000);

                            }, 2000);

                        } else if (serverResponse.vehicle_update_status == "success") {

                            setTimeout(() => {

                                const currentEditedCard = document.getElementById(cardSelectedId);

                                console.log(currentEditedCard, " ", cardSelectedId);

                                if (serverResponse.vehicle_image_path) {
                                    currentEditedCard.querySelector('.vehicle-card-container-img img').src = "../assets/imgs/uploads/vehicles/" + serverResponse.vehicle_image_path;
                                }

                                if (vehicleState == "Disponible") {
                                    currentEditedCard.querySelector('.vehicle-card-top-right').classList.remove('vehicle-status-not-available');
                                    currentEditedCard.querySelector('.vehicle-card-top-right').classList.add('vehicle-status-available');
                                    currentEditedCard.querySelector('.rent-car-btn').classList.remove('disabled');
                                    currentEditedCard.querySelector('.rent-car-btn').removeAttribute("disabled");
                                } else if (vehicleState == "No disponible") {
                                    currentEditedCard.querySelector('.vehicle-card-top-right').classList.add('vehicle-status-not-available');
                                    currentEditedCard.querySelector('.vehicle-card-top-right').classList.remove('vehicle-status-available');
                                    currentEditedCard.querySelector('.rent-car-btn').classList.add('disabled');
                                    currentEditedCard.querySelector('.rent-car-btn').setAttribute("disabled", "true");
                                }

                                currentEditedCard.querySelector('.vehicle-card-top-right p').textContent = vehicleState;

                                currentEditedCard.querySelector('.vehicle-card-top-left h2').textContent = serverResponse.vehicle_brand + " " + serverResponse.vehicle_model + " " + vehicleYear.value;
                                console.log(currentEditedCard.querySelector('.vehicle-card-top-left .vehicle-year-span'));
                                currentEditedCard.querySelector('.vehicle-card-top-left .price-per-day').textContent = "DOP " + formatNumberComas(vehiclePrice.value) + " / Día";
                                currentEditedCard.querySelector('.seats span').textContent = vehiclePassengers.value + "pasajeros";
                                currentEditedCard.querySelector('.fuel span').textContent = vehicleFuel;
                                currentEditedCard.querySelector('.vehicle-type span').textContent = vehicleType;
                                currentEditedCard.querySelector('.plate span').textContent = vehiclePlate.value;

                                let infoDataModelContainer;

                                infoDataModelContainer = document.querySelector('.info-data.vehicles');

                                let tmpInfoDataContent = infoDataModelContainer.innerHTML;

                                submitFormBtn.innerHTML = "Vehículo Editado!";
                                submitFormBtn.style.opacity = ".6";

                                setTimeout(() => {

                                    submitFormBtn.style.opacity = "1";
                                    formAction = "create";

                                    closeOverlayIcon.click();

                                }, 1000);

                            }, 2000);

                        }

                    } catch (e) {

                        setTimeout(() => {

                            formMessageContainer.classList.add('active');
                            formMessageText.textContent = data;

                            if (formAction == "create")
                                submitFormBtn.innerHTML = "Añadir Vehículo";
                            else if (formAction == "edit")
                                submitFormBtn.innerHTML = "Editar Vehículo";

                        }, 2000);

                    }

                }
            }
        }

        let formData = new FormData(vehicleForm);
        formData.append("vehicleFormAction", formAction);
        formData.append("vehicleImageFile", selectedImage);
        formData.append("vehicle_model", vehicleModel);
        formData.append("vehicle_type", vehicleType);
        formData.append("vehicle_fuel", vehicleFuel);
        formData.append("vehicle_state", vehicleState);
        formData.append("vehicle_brand", vehicleBrand);

        if (formAction == "edit") formData.append("vehicle_id", cardSelectedId);

        xhr.send(formData);

    } else {

        formMessageContainer.classList.add('active');
        formMessageText.textContent = "Debes seleccionar un archivo y/o completar los campos";

    }

};

function generateRentID() {
    const rentId = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
    return rentId;
};

function handleCarRequest(rentBtn) {

    rentFormOverlay.classList.add('active');

    const btnAction = rentBtn.getAttribute("btnaction");
    const btnCar = rentBtn.parentElement.parentElement.parentElement;
    const carName = btnCar.querySelector('.vehicle-card-top-left h2').textContent;
    const carPrice = btnCar.querySelector('.price-per-day').textContent.replace(',', '').replace('DOP', '').replace(' ', '').replace('/', '').replace('Día', '');
    const carImage = btnCar.querySelector('.vehicle-card-container-img img').src;

    if (btnAction == "rent-car") {

        rentForm.querySelector('.rent-identificator').value = generateRentID();
        rentForm.querySelector('.rent-vehicle').value = carName;
        rentForm.querySelector('.rent-price').value = carPrice.trim();
        rentForm.querySelector('.vehicle-info img').src = carImage;
        rentForm.querySelector('.vehicle-identifier').value = btnCar.id;

    } else if (btnAction == "return-car") {

        const returnedCarId = btnCar.id;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", "../server/procedures.php", true);
        xhr.onload = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    const serverResponse = xhr.response;

                    try {

                        const parsedResponse = JSON.parse(serverResponse);

                        rentForm.querySelector('.rent-identificator').value = parsedResponse.inspect_rent_id;
                        rentForm.querySelector('.estado-gomas').value = parsedResponse.inspect_estado_gomas;
                        rentForm.querySelector('.rent-vehicle').value = parsedResponse.rent_vehicle_name;
                        rentForm.querySelector('.rent-price').value = parsedResponse.rent_price;
                        rentForm.querySelector('.vehicle-info img').src = carImage;
                        rentForm.querySelector('.vehicle-identifier').value = btnCar.id;
                        rentForm.querySelector('.rent-date').value = parsedResponse.rent_date;
                        rentForm.querySelector('.rent-return-date').value = parsedResponse.rent_return_date;
                        rentForm.querySelector('.rent-days').value = parsedResponse.rent_days;
                        rentForm.querySelector('.rent-comment').value = parsedResponse.rent_comment;

                        if (parsedResponse.inspect_ralladura == "1")
                            rentForm.querySelector('.ralladuras').checked;

                        if (parsedResponse.inspect_roturas_cristal == "1")
                            rentForm.querySelector('.rotura-cristal').checked = true;

                        if (parsedResponse.inspect_ralladura == "1")
                            rentForm.querySelector('.ralladuras').checked = true;

                        if (parsedResponse.inspect_goma_repuesto == "1")
                            rentForm.querySelector('.goma-repuesto').checked = true;

                        if (parsedResponse.inspect_gato_hidraulico == "1")
                            rentForm.querySelector('.gato-hidraulico').checked = true;

                        for (let cont = 0; cont < rentForm.querySelector('select.nivel-combustible').options.length; cont++) {
                            if (rentForm.querySelector('select.nivel-combustible').options[cont].text == parsedResponse.inspect_nivel_combustible) {
                                rentForm.querySelector('select.nivel-combustible').options[cont].selected = true;
                                break;
                            }
                        }

                        for (let cont = 0; cont < rentForm.querySelector('select.rent-client').options.length; cont++) {
                            if (rentForm.querySelector('select.rent-client').options[cont].text == parsedResponse.rent_client) {
                                rentForm.querySelector('select.rent-client').options[cont].selected = true;
                                break;
                            }
                        }

                        for (let cont = 0; cont < rentForm.querySelector('select.rent-employee').options.length; cont++) {
                            if (rentForm.querySelector('select.rent-employee').options[cont].text == parsedResponse.rent_employee) {
                                rentForm.querySelector('select.rent-employee').options[cont].selected = true;
                                break;
                            }
                        }

                        rentForm.querySelector('.submit').setAttribute('rentformaction', "return");
                        rentForm.querySelector('.submit').textContent = "Devolver vehículo";

                    } catch (e) {
                        console.log(e);
                    }

                }
            }
        }
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send("rentVehicleAction=getCar" + "&returnedCarId=" + returnedCarId);

    }

};

function rentFormAction() {

    const formFields = rentForm.querySelectorAll('input[type=date], input[type=text]');

    for (let cont = 0; cont < formFields.length; cont++) {
        if (formFields[cont].value == "") {
            formCompleted = false;
            cont = formFields.length;
        } else {
            formCompleted = true;
        }
    }

    const rentFormAction = rentFormSubmit.getAttribute('rentformaction');

    if (rentFormAction == "rent") {

        if (formCompleted && rentDateComparison) {

            rentFormMessageContainer.classList.remove('active');
            rentFormMessageContainerText.textContent = "";

            const ralladurasCheck = rentForm.querySelector('input[type=checkbox].ralladuras');
            const ralladurasCheckValue = ralladurasCheck.checked ? "1" : "0";

            // console.log("Ralladuras:", ralladurasCheckValue);

            const roturaCristalCheck = rentForm.querySelector('input[type=checkbox].rotura-cristal');
            const roturaCristalCheckValue = roturaCristalCheck.checked ? "1" : "0";

            // console.log("Roturas:", roturaCristalCheckValue);

            const gomaRepuestoCheck = rentForm.querySelector('input[type=checkbox].goma-repuesto');
            const gomaRepuestoCheckValue = gomaRepuestoCheck.checked ? "1" : "0";

            // console.log("Goma Repuesto:", gomaRepuestoCheckValue);

            const gatoHidraulicoCheck = rentForm.querySelector('input[type=checkbox].gato-hidraulico');
            const gatoHidraulicoCheckValue = gatoHidraulicoCheck.checked ? "1" : "0";

            // console.log("Gato Hidraulico:", gatoHidraulicoCheckValue);

            const nivelCombustible = rentForm.querySelector('select.nivel-combustible');
            const nivelCombustibleValue = nivelCombustible.options[nivelCombustible.selectedIndex].text;

            // console.log("nivel combustible:", nivelCombustibleValue);

            const rentClient = document.querySelector('select.rent-client');
            const rentClientValue = rentClient.options[rentClient.selectedIndex].text;

            // console.log(rentClientValue);

            const rentEmployee = document.querySelector('select.rent-employee');
            const rentEmployeeValue = rentEmployee.options[rentEmployee.selectedIndex].text;

            // console.log(rentEmployeeValue);

            let xhr = new XMLHttpRequest();
            xhr.open("POST", "../server/procedures.php", true);
            xhr.onload = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        const serverResponse = xhr.response;
                        if (serverResponse == "rent_success") {
                            const selectedVehicleId = rentForm.querySelector('.vehicle-identifier').value;
                            const currentVehicle = document.getElementById(selectedVehicleId);
                            currentVehicle.querySelector('.rent-car-btn').setAttribute('btnaction', "return-car");
                            currentVehicle.querySelector('.rent-car-btn').textContent = "Devolver vehículo";
                            currentVehicle.querySelector('.vehicle-card-top-right').classList.remove('vehicle-status-available');
                            currentVehicle.querySelector('.vehicle-card-top-right').classList.add('vehicle-status-rent-active');
                            currentVehicle.querySelector('.vehicle-card-top-right p').textContent = "Rentado";
                            // prevBtnSec.click();
                            closeRentFormOverlay.click();
                        } else {
                            rentFormMessageContainer.classList.add('active');
                            rentFormMessageContainerText.textContent = serverResponse;
                        }
                    }
                }
            }
            let formData = new FormData(rentForm);
            formData.append("ralladuras", ralladurasCheckValue);
            formData.append("roturaCristal", roturaCristalCheckValue);
            formData.append("gomaRepuesto", gomaRepuestoCheckValue);
            formData.append("gatoHidraulico", gatoHidraulicoCheckValue);
            formData.append("nivelCombustible", nivelCombustibleValue);
            formData.append("rentClient", rentClientValue);
            formData.append("rentEmployee", rentEmployeeValue);
            formData.append("rentVehicleAction", "create");
            xhr.send(formData);

        } else {
            rentFormMessageContainer.classList.add('active');
            rentFormMessageContainerText.textContent = "Existen campos en blanco y/o con errores";
        }

    } else if (rentFormAction == "return") {
        
        const rentId = rentForm.querySelector('.rent-identificator');
        const rentCarId = rentForm.querySelector('.vehicle-identifier');

        let xhr = new XMLHttpRequest();
        xhr.open("POST", "../server/procedures.php", true);
        xhr.onload = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    const serverResponse = xhr.response;
                    if (serverResponse == "return_success") {
                        const currentVehicle = document.getElementById(rentCarId.value);
                        currentVehicle.querySelector('.rent-car-btn').setAttribute('btnaction', "rent-car");
                        currentVehicle.querySelector('.rent-car-btn').textContent = "Rentar vehículo";
                        currentVehicle.querySelector('.vehicle-card-top-right').classList.remove('vehicle-status-rent-active');
                        currentVehicle.querySelector('.vehicle-card-top-right').classList.add('vehicle-status-available');
                        currentVehicle.querySelector('.vehicle-card-top-right p').textContent = "Disponible";
                        // prevBtnSec.click();
                        closeRentFormOverlay.click();
                    } else {
                        rentFormMessageContainer.classList.add('active');
                        rentFormMessageContainerText.textContent = serverResponse;
                    }
                }
            }
        }
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send("rentVehicleAction=returncar" + "&vehicleToReturnId=" + rentCarId.value + "&rentIdentifier=" + rentId.value);

    }

};

firstNextBtn.addEventListener("click", function () {
    const tiresStateInput = rentForm.querySelector('.estado-gomas');
    if (tiresStateInput.value != "") {
        rentFormMessageContainer.classList.remove('active');
        rentFormMessageContainerText.textContent = "";
        slidePage.style.marginLeft = "-25%";
        progressBullet[currentSlide - 1].classList.add('active');
        progressText[currentSlide - 1].classList.add('active');
        progressCheck[currentSlide - 1].classList.add('active');
        currentSlide += 1;
    } else {
        rentFormMessageContainer.classList.add('active');
        rentFormMessageContainerText.textContent = "Debe completar los campos faltantes";
    }
});

prevBtnSec.addEventListener("click", function () {
    slidePage.style.marginLeft = "0%";
    progressBullet[currentSlide - 2].classList.remove('active');
    progressText[currentSlide - 2].classList.remove('active');
    progressCheck[currentSlide - 2].classList.remove('active');
    currentSlide -= 1;
});