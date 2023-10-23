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
const generatePDFButton = document.querySelector('.generate-pdf-option');
const generateExcelButton = document.querySelector('.generate-excel-option');

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

generateExcelButton.onclick = () => generateExcelReport();

generatePDFButton.onclick = () => generatePDFReport();

filterFormButton.onclick = () => {
    filterRentsReport();
}

function randomHash(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }

    return code;
}

function generateExcelReport() {
    const ws = XLSX.utils.table_to_sheet(mainTable);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Tabla');
    const filename = `reporte.${randomHash(8)}.xlsx`;
    XLSX.writeFile(wb, filename);
}

function generatePDFReport() {

    html2canvas(mainTable).then(canvas => {
        const imgData = canvas.toDataURL("image/jpeg", .7);
        const pdf = new jsPDF("p", "mm", "a4");
        pdf.addImage(imgData, "JPEG", 10, 10, 210, 50); // Tamaño A4: 210x297 mm
        pdf.save(`reporte.${randomHash(8)}.pdf`);
    });

    // var opt = {
    //     margin: 1,
    //     filename: 'myfile.pdf',
    //     image: {tpye: 'jpeg', quality: 0.98},
    //     html2canvas: { scale: 1 },
    //     jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
    // };

    // html2pdf(mainTable, opt);

    // const pdf = new html2pdf();

    // // Renderizar la tabla HTML en el objeto html2pdf
    // pdf.fromHTML(mainTable);

    // // Guardar el archivo PDF
    // pdf.save('my-table.pdf');
    // html2pdf()
    //     .from(mainTable)
    //     .set({
    //         margin: 10,
    //         filename: "mi-tabla.pdf",
    //         image: { type: "jpeg", quality: 0.98 },
    //         html2canvas: { scale: 2 },
    //         jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    //     })
    //     .outputPdf(function (pdf) {
    //         const blob = pdf.output("blob");
    //         const url = URL.createObjectURL(blob);
    //         const a = document.createElement("a");
    //         a.href = url;
    //         a.download = "mi-tabla.pdf";
    //         a.click();
    //     });
    // var doc = new jsPDF();

    // // Convertir la tabla a un archivo PDF
    // doc.autoTable({ html: mainTable });

    // // Guardar el archivo PDF con un nombre deseado
    // doc.save(`reporte.${randomHash(8)}.pdf`);
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

    if (new Date(fromDate.value) > new Date(toDate.value)) {
        messagesContainer.classList.add('active');
        messagesContainerText.textContent = "La fecha inicial no puede ser mayor a la fecha límite";
        return;
    }

    if (new Date(toDate.value) < new Date(fromDate.value)) {
        messagesContainer.classList.add('active');
        messagesContainerText.textContent = "La límite no puede ser menor a la fecha inicial";
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