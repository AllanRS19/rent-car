<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
    <link rel="stylesheet" href="../assets/styles/global.css">
    <link rel="stylesheet" href="../assets/styles/employees.css">
    <title>Car Rental - Employees</title>
</head>

<body>

    <div class="overlay">
        <div class="form-container">
            <div class="form-container-top">
                <h3>Añadir Empleado</h3>
                <i class='bx bx-x close-overlay-icon'></i>
            </div>
            <div class="form-message-container">
                <p class="form-alert-message"></p>
            </div>
            <form action="" method="post" class="form-container-body employees-form">
                <div class="input-container-wrapper">
                    <div class="input-container">
                        <label>Nombre Empleado</label>
                        <input type="text" name="employee-name" class="employee-name">
                    </div>
                    <div class="input-container">
                        <label>Cédula Empleado</label>
                        <input type="text" name="employee-personal-id" class="employee-personal-id" maxlength="11">
                    </div>
                </div>
                <div class="input-container-wrapper">
                    <div class="input-container">
                        <label>Porciento Comisión</label>
                        <input type="text" name="employee-commission" class="employee-commission" maxlength="3">
                    </div>
                    <div class="input-container">
                        <label>Tanda Laboral</label>
                        <select name="employee-shift" class="employee-shift">
                            <option value="">Selecciona una opción</option>
                            <option value="">Matutina</option>
                            <option value="">Vespertina</option>
                            <option value="">Nocturna</option>
                        </select>
                    </div>
                </div>
                <div class="input-container-wrapper">
                    <div class="input-container">
                        <label>Fecha Ingreso</label>
                        <input type="date" name="employee-join-date" class="employee-join-date">
                    </div>
                    <div class="input-container">
                        <label>Estado Empleado</label>
                        <select name="employee-state" class="employee-state">
                            <option value="">Selecciona una opción</option>
                            <option value="">Activo</option>
                            <option value="">Inactivo</option>
                        </select>
                    </div>
                </div>
                <div class="input-container-wrapper employee-image-url-wrapper">
                    <div class="input-container">
                        <label>Imagen Empleado (URL)</label>
                        <input type="text" name="employee-image-url" class="employee-image-url">
                    </div>
                </div>
                <button>
                    Añadir Empleado
                </button>
            </form>
        </div>
    </div>

    <?php include "./nav-template.php"; ?>

    <div class="title-wrapper">

        <div class="title-left">
            <h1 class="title">Empleados</h1>
            <ul class="breadcrumbs">
                <li><a href="#">Inicio</a></li>
                <li class="divider">/</li>
                <li><a href="#" class="active">Empleados</a></li>
            </ul>
        </div>

        <div class="title-right">
            <button class="add-feature-btn employees-btn" id="add-employee-btn">
                <span class="add-feature-btn-icon">
                    <i class='bx bx-plus'></i>
                </span>
                <span class="add-feature-btn-text">Añadir empleado</span>
            </button>
        </div>

    </div>

    <hr>

    <div class="data">
        <div class="content-data employees-content-data">
            <div class="head-prev-table">
                <h3>Empleados Actuales</h3>
                <div class="prev-table-filter-search">
                    <i class='bx bx-filter'></i>
                    <i class='bx bx-search'></i>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Nombre Empleado</th>
                        <th>Cédula</th>
                        <th>Tanda Laboral</th>
                        <th>Porciento Comisión</th>
                        <th>Fecha Ingreso</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody class="table-body-content">
                    <?php 
                    
                        $get_employees = mysqli_query($connection, "SELECT * FROM empleados ORDER BY employee_state ASC");

                        if (mysqli_num_rows($get_employees) > 0) {

                            while ($fetch_employee_details = mysqli_fetch_array($get_employees)) {
                    
                    ?>

                    <tr id="<?php echo $fetch_employee_details['employee_unique_id']; ?>">
                        <td class="rental-employee-img">
                            <img src="<?php echo $fetch_employee_details['employee_image_url']; ?>" alt="">
                            <span><?php echo $fetch_employee_details['employee_name']; ?></span>
                        </td>
                        <td class="employee-id-data"><?php echo substr($fetch_employee_details['employee_personal_id'], 0, 3) . "-" . substr($fetch_employee_details['employee_personal_id'], 3, 7) . "-" . substr($fetch_employee_details['employee_personal_id'], -1); ?></td>
                        <td class="employee-shift-data"><?php echo $fetch_employee_details['employee_shift']; ?></td>
                        <td class="employee-commission-data"><?php echo $fetch_employee_details['employee_commission'] . "% comisión por renta"; ?></td>
                        <td class="employee-join-date-data"><?php echo $fetch_employee_details['employee_join_date']; ?></td>
                        <td class="employee-state-data">
                            <p class="status <?php if ($fetch_employee_details['employee_state'] == "Activo") { echo "status-active"; } else { echo "status-inactive"; } ?>">
                                <?php echo $fetch_employee_details['employee_state']; ?>
                            </p>
                        </td>
                        <td>
                            <div class="user-actions">
                                <button class="edit-btn action-btn">
                                    <i class='bx bx-edit-alt'></i>
                                </button>
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
    </main>
    <!-- MAIN -->
    </section>
    <!-- NAVBAR -->

    <script src="../assets/scripts/dashboard.js"></script>
    <script src="../assets/scripts/employees.js"></script>
</body>

</html>