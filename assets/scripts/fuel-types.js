const overlay = document.querySelector('.overlay'),
    closeOverlayBtn = document.querySelector('.close-overlay-icon'),
    fuelForm = document.querySelector('.overlay form'),
    fuelFormMessage = document.querySelector('.overlay form .form-message'),
    fuelFormMessageText = document.querySelector('.overlay form .form-message p'),
    fuelFormSubmitBtn = document.querySelector('.overlay form button'),
    addFeatureBtn = document.querySelector('.add-feature-btn'),
    infoDataContainer = document.querySelector('.info-data');

addFeatureBtn.onclick = () => overlay.classList.add('active');

closeOverlayBtn.onclick = () => overlay.classList.remove('active');

fuelForm.onsubmit = function (e) {
    e.preventDefault();

    let formComplete = false;

    let formFields = this.querySelectorAll('input, textarea, select');

    // console.log(formFields[2].options[formFields[2].selectedIndex].textContent);

    for (cont = 0; cont < formFields.length; cont++) {
        // console.log(formFields[cont].tagName);
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
                                        <h4 class="card-content-title">${this.querySelector('input.fuel-name').value}</h4>
                                        <p class="card-content-description">${this.querySelector('textarea.fuel-description').value}</p>
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
                                }, 1000);

                            }, 2000);

                        }

                    } catch (e) {

                        setTimeout(() => {

                            fuelFormMessage.classList.add('active');
                            fuelFormMessageText.textContent = data;

                            fuelFormSubmitBtn.innerHTML = "Añadir Combustible";

                        }, 2000);

                    }

                }

            }

        }

        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send("fuel_name=" + this.querySelector('input.fuel-name').value + "&fuel_desc=" + this.querySelector('textarea.fuel-description').value + "&fuel_state=" + formSelectedOption);

    } else {

        fuelFormMessage.classList.add('active');
        fuelFormMessageText.textContent = 'Existen campos en blanco';

    }

}