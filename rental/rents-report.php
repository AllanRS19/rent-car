<?php

session_start();

if (!isset($_SESSION['user_ident']) && $_SESSION['user_ident'] == "") {

    header("location: ../auth.php");
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js"></script>
    <script src="https://html2canvas.hertzen.com/dist/html2canvas.js"></script>
    <link rel="stylesheet" href="../assets/styles/global.css">
    <link rel="stylesheet" href="../assets/styles/rents-report.css">
    <title>Car Rental - Reporte de Rentas</title>
</head>

<body>

    <div class="overlay">
        <div class="form-container">
            <div class="form-container-top">
                <h3>Añadir Cliente</h3>
                <i class='bx bx-x close-overlay-icon'></i>
            </div>
            <div class="form-message-container">
                <p class="form-alert-message"></p>
            </div>
            <form action="" method="post" class="form-container-body clients-form">
                <div class="input-container-wrapper">
                    <div class="input-container">
                        <label>Nombre Cliente</label>
                        <input type="text" name="client-name" class="client-name">
                    </div>
                    <div class="input-container">
                        <label>Cédula</label>
                        <input type="text" name="client-personal-id" class="client-personal-id" maxlength="11">
                    </div>
                </div>
                <div class="input-container-wrapper">
                    <div class="input-container">
                        <label>No. Tarjeta CR</label>
                        <input type="text" name="client-cc-number" class="client-cc-number" maxlength="16">
                    </div>
                    <div class="input-container">
                        <label>Límite de Crédito</label>
                        <input type="text" name="client-credit-limit" class="client-credit-limit">
                    </div>
                </div>
                <div class="input-container-wrapper">
                    <div class="input-container">
                        <label>Tipo Persona</label>
                        <select name="client-type" class="client-type">
                            <option value="">Selecciona una opción</option>
                            <option value="">Física</option>
                            <option value="">Jurídica</option>
                        </select>
                    </div>
                    <div class="input-container">
                        <label>Estado Cliente</label>
                        <select name="client-state" class="client-state">
                            <option value="">Selecciona una opción</option>
                            <option value="">Activo</option>
                            <option value="">Inactivo</option>
                        </select>
                    </div>
                </div>
                <div class="input-container-wrapper client-image-url-wrapper">
                    <div class="input-container">
                        <label>Imagen Cliente (URL)</label>
                        <input type="text" name="client-image-url" class="client-image-url">
                    </div>
                </div>
                <button>
                    Añadir Cliente
                </button>
            </form>
        </div>
    </div>

    <?php include "./nav-template.php"; ?>

    <div class="title-wrapper">

        <div class="title-left">
            <h1 class="title">Reporte de Rentas</h1>
            <ul class="breadcrumbs">
                <li><a href="#">Inicio</a></li>
                <li class="divider">/</li>
                <li><a href="#" class="active">Rentas</a></li>
            </ul>
        </div>

    </div>

    <hr>

    <div class="data">
        <div class="content-data clients-content-data">
            <div class="head-prev-table">
                <h3>Reporte de Rentas</h3>
                <div class="prev-table-filter-search">
                    <div class="quit-filter-container">
                        <i class='bx bx-x added-x'></i>
                        <i class='bx bx-filter unfilter-icon'></i>
                    </div>
                    <div class="filter-generator-container">
                        <i class='bx bx-filter filter-icon'></i>
                        <div class="filter-generator-content">
                            <form action="" method="post" id="filter-form">
                                <h3>Filtrar Reporte de Rentas</h3>
                                <div class="messages-container">
                                    <p></p>
                                </div>
                                <div class="filter-input-wrapper">
                                    <div class="filter-input-container">
                                        <label>Filtrar desde</label>
                                        <input type="date" name="from-date" class="from-date">
                                    </div>
                                    <div class="filter-input-container">
                                        <label>Filtrar hasta</label>
                                        <input type="date" name="to-date" class="to-date">
                                    </div>
                                </div>
                                <div class="filter-input-wrapper">
                                    <div class="filter-input-container">
                                        <label>Cliente</label>
                                        <select name="client-filter">
                                            <option value="">Seleccione una opción...</option>
                                            <?php

                                            $get_clients = mysqli_query($connection, "SELECT client_name FROM clientes");

                                            if (mysqli_num_rows($get_clients) > 0) {
                                                while ($fetch_clients_names = mysqli_fetch_array($get_clients)) {


                                            ?>
                                                    <option value="<?php echo $fetch_clients_names['client_name']; ?>"><?php echo $fetch_clients_names['client_name']; ?></option>
                                            <?php

                                                }
                                            }

                                            ?>
                                        </select>
                                    </div>
                                    <div class="filter-input-container">
                                        <label>Empleado</label>
                                        <select name="employee-filter">
                                            <option value="">Seleccione una opción...</option>
                                            <?php

                                            $get_employees = mysqli_query($connection, "SELECT employee_name FROM empleados");

                                            if (mysqli_num_rows($get_employees) > 0) {
                                                while ($fetch_employees_names = mysqli_fetch_array($get_employees)) {


                                            ?>
                                                    <option value="<?php echo $fetch_employees_names['employee_name']; ?>"><?php echo $fetch_employees_names['employee_name']; ?></option>
                                            <?php

                                                }
                                            }

                                            ?>
                                        </select>
                                    </div>
                                </div>
                                <div class="filter-input-wrapper">
                                    <div class="filter-input-container">
                                        <label>Vehículo</label>
                                        <select name="vehicle-filter">
                                            <option value="">Seleccione una opción...</option>
                                            <?php

                                            $get_vehicles = mysqli_query($connection, "SELECT vehicle_brand, vehicle_model, vehicle_year FROM vehiculos");

                                            if (mysqli_num_rows($get_vehicles) > 0) {
                                                while ($fetch_vehicles_names = mysqli_fetch_array($get_vehicles)) {


                                            ?>
                                                    <option value="<?php echo $fetch_vehicles_names['vehicle_brand'] . " " . $fetch_vehicles_names['vehicle_model'] . " " . $fetch_vehicles_names['vehicle_year']; ?>"><?php echo $fetch_vehicles_names['vehicle_brand'] . " " . $fetch_vehicles_names['vehicle_model'] . " " . $fetch_vehicles_names['vehicle_year']; ?></option>
                                            <?php

                                                }
                                            }

                                            ?>
                                        </select>
                                    </div>
                                    <div class="filter-input-container">
                                        <label>Estado</label>
                                        <select name="state-filter">
                                            <option value="">Seleccione una opción...</option>
                                            <option value="Activo">Activo</option>
                                            <option value="Inactivo">Inactivo</option>
                                        </select>
                                    </div>
                                </div>
                                <button id="filter-form-button">Filtrar Rentas</button>
                            </form>
                            <hr>
                            <div class="generate-report-options">
                                <div class="generate-pdf-option">
                                    <i class='bx bxs-file-pdf'></i>
                                    <span>Generar PDF</span>
                                </div>
                                <div class="generate-excel-option">
                                    <i class='bx bxs-file'></i>
                                    <span>Generar Excel</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="search-input-container">
                        <input type="text" placeholder="Buscar..." id="search-input">
                        <div class="search-icon-container">
                            <i class='bx bx-search'></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="overflow-controller">
                <table class="maintable">
                    <thead>
                        <tr>
                            <th>No. Renta</th>
                            <th>Vehículo</th>
                            <th>Cliente</th>
                            <th>Empleado</th>
                            <th>Fecha Renta</th>
                            <th>Fecha Devol.</th>
                            <th>Cant. Días</th>
                            <th>Precio Final</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="table-body-content">
                        <?php

                        $get_rents = mysqli_query($connection, "SELECT * FROM rentas");

                        if (mysqli_num_rows($get_rents) > 0) {

                            while ($fetch_rents_details = mysqli_fetch_array($get_rents)) {

                        ?>

                                <tr id="<?php echo $fetch_rents_details['rent_unique_id']; ?>">
                                    <td class="rental-customer-img"><?php echo $fetch_rents_details['rent_unique_id']; ?></td>
                                    <td class="client-id-data"><?php echo $fetch_rents_details['rent_vehicle_name']; ?></td>
                                    <td class="client-cc-data"><?php echo $fetch_rents_details['rent_client']; ?></td>
                                    <td class="client-cl-data"><?php echo $fetch_rents_details['rent_employee']; ?></td>
                                    <td class="client-type-data"><?php echo $fetch_rents_details['rent_date']; ?></td>
                                    <td class="client-state-data"><?php echo $fetch_rents_details['rent_return_date']; ?><!-- <p class="status</p> --></td>
                                    <td class="client-state-data"><?php echo $fetch_rents_details['rent_days']; ?></td>
                                    <td class="client-state-data"><?php echo ($fetch_rents_details['rent_days'] * $fetch_rents_details['rent_price']); ?></td>
                                    <td class="client-state-data"><?php echo $fetch_rents_details['rent_state']; ?></td>
                                    <td>
                                        <div class="user-actions">
                                            <button class="delete-btn action-btn">
                                                <i class='bx bx-trash'></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>

                        <?php

                            }
                        }

                        ?>

                    </tbody>
                </table>
            </div>
        </div>
    </div>
    </main>
    <!-- MAIN -->
    </section>
    <!-- NAVBAR -->

    <script src="../assets/scripts/dashboard.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.0/xlsx.full.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.debug.js" integrity="sha512-cLuyDTDg9CSseBSFWNd4wkEaZ0TBEpclX0zD3D6HjI19pO39M58AgJ1SjHp6c7ZOp0/OCRcC2BCvvySU9KJaGw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.3.2/html2canvas.js" integrity="sha512-sk0cNQsixYVuaLJRG0a/KRJo9KBkwTDqr+/V94YrifZ6qi8+OO3iJEoHi0LvcTVv1HaBbbIvpx+MCjOuLVnwKg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.2/html2pdf.bundle.min.js"></script>
    <!-- <script src="../assets/scripts/html2pdf.bundle.js"></script> -->
    <!-- <script src="../assets/scripts/table2excel.js"></script> -->
    <script src="../assets/scripts/rents-report.js"></script>
</body>

</html>