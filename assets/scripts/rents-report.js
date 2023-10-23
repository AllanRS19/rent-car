const searchInput = document.getElementById('search-input');
const tableContent = document.querySelector('.table-body-content');
const mainTable = document.querySelector('.maintable');
const filterIcon = document.querySelector('.filter-icon');
const unFilterIcon = document.querySelector('.unfilter-icon');
const filterGeneratorContent = document.querySelector('.filter-generator-content');
const filterForm = document.getElementById('filter-form');
const filterFormButton = document.getElementById('filter-form-button');
const messagesContainer = document.querySelector('.messages-container');
const messagesContainerText = document.querySelector('.messages-container p');

let deleteActionBtn;

if (document.querySelector('.user-actions')) {
    deleteActionBtn = document.querySelectorAll('.delete-btn').forEach(delBtn => delBtn.addEventListener('click', function () {
        deleteRentRegistry(this);
    }));
}

function deleteRentRegistry(selectedBtn) {
    const rowToBeDeleted = selectedBtn.parentElement.parentElement.parentElement;
    const rowToBeDeletedId = rowToBeDeleted.id;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "../server/procedures.php", true);
    xhr.onload = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const serverResponse = xhr.response;
                if (serverResponse == "rent_deleted") rowToBeDeleted.remove();
                else console.log("There was an error: " + serverResponse);
            }
        }
    }
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send("rentReportAction=delete" + "&rent_id_to_delete=" + rowToBeDeletedId);
}

searchInput.addEventListener('input', function () {

    const searchValue = this.value;
    let action = searchValue == "" ? "retreiveAll" : "filterText";

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "../server/procedures.php", true);
    xhr.onload = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const serverResponse = xhr.response;
                tableContent.innerHTML = serverResponse;
                deleteActionBtn = document.querySelectorAll('.delete-btn').forEach(delBtn => delBtn.addEventListener('click', function () {
                    deleteRentRegistry(this);
                }));
            }
        }
    }
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send("rentReportAction=" + action + "&rentSearchTerm=" + searchValue);

});

filterIcon.onclick = () => {
    filterGeneratorContent.classList.toggle('active');
}

unFilterIcon.onclick = () => {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "../server/procedures.php", true);
    xhr.onload = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const serverResponse = xhr.response;
                tableContent.innerHTML = serverResponse;
                deleteActionBtn = document.querySelectorAll('.delete-btn').forEach(delBtn => delBtn.addEventListener('click', function () {
                    deleteRentRegistry(this);
                }));
            }
        }
    }
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send("rentReportAction=retreiveAll");
}

filterFormButton.onclick = () => {
    filterRentsReport();
}

function filterRentsReport() {

    const fromDate = document.querySelector('.from-date');
    const toDate = document.querySelector('.to-date');

    if (fromDate.value != "" && toDate.value == "") {
        messagesContainer.classList.add('active');
        messagesContainerText.textContent = "Debe escoger dos rangos de fecha válidos";
        return;
    }

    if (fromDate.value == "" && toDate.value != "") {
        messagesContainer.classList.add('active');
        messagesContainerText.textContent = "Debe escoger dos rangos de fecha válidos";
        return;
    }

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "../server/procedures.php", true);
    xhr.onload = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const serverResponse = xhr.response;
                if (serverResponse == "no_match") {
                    messagesContainer.classList.add('active');
                    messagesContainerText.textContent = "No existen registros que coincidan con los criterios";
                } else {
                    messagesContainer.classList.remove('active');
                    messagesContainerText.textContent = "";
                    tableContent.innerHTML = serverResponse;
                    deleteActionBtn = document.querySelectorAll('.delete-btn').forEach(delBtn => delBtn.addEventListener('click', function () {
                        deleteRentRegistry(this);
                    }));
                    filterGeneratorContent.classList.remove('active');
                }
                filterForm.reset();
            }
        }
    }
    let formData = new FormData(filterForm);
    formData.append("rentReportAction", "filterManual");
    xhr.send(formData);

}

filterForm.onsubmit = e => {
    e.preventDefault();
}

// function generatePDF() {
//     html2pdf().from(document.body).save();
//     var doc = new jsPDF('p', 'pt', 'letter');
//     var margin = 40;
//     var scale = (doc.internal.pageSize.width - margin * - 4) / document.body.clientWidth;
//     var scaleMobile = (doc.internal.pageSize.width - margin * 2) / document.body.getBoundingClientRect();

//     doc.html(mainTable, {
//         x: margin,
//         y: margin,
//         html2canvas: {
//             scale: scale,
//         },
//         callback: function(doc) {
//             doc.output('dataurlnewwindow', {filename: 'reporte.pdf'});
//         }
//     });
// }

// filterOptions.onclick = function () {
//     this.classList.remove('active');
//     generatePDF();
// }