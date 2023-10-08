<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
    <link rel="stylesheet" href="../assets/styles/global.css">
    <link rel="stylesheet" href="../assets/styles/clients.css">
    <title>AdminSite - Dashboard</title>
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
            <h1 class="title">Clientes</h1>
            <ul class="breadcrumbs">
                <li><a href="#">Inicio</a></li>
                <li class="divider">/</li>
                <li><a href="#" class="active">Clientes</a></li>
            </ul>
        </div>

        <div class="title-right">
            <button class="add-feature-btn clients-btn" id="add-client-btn">
                <span class="add-feature-btn-icon">
                    <i class='bx bx-plus'></i>
                </span>
                <span class="add-feature-btn-text">Añadir cliente</span>
            </button>
        </div>

    </div>

    <hr>

    <div class="data">
        <div class="content-data">
            <div class="head-prev-table">
                <h3>Clientes Actuales</h3>
                <div class="prev-table-filter-search">
                    <i class='bx bx-filter'></i>
                    <i class='bx bx-search'></i>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Nombre Cliente</th>
                        <th>Cédula</th>
                        <th>No. Tarjeta de Crédito</th>
                        <th>Límite de Crédito</th>
                        <th>Tipo Persona</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody class="table-body-content">
                    <?php 
                    
                        $get_clients = mysqli_query($connection, "SELECT * FROM clientes ORDER BY client_state ASC");

                        if (mysqli_num_rows($get_clients) > 0) {

                            while ($fetch_clients_details = mysqli_fetch_array($get_clients)) {
                    
                    ?>

                    <tr id="<?php echo $fetch_clients_details['client_unique_id']; ?>">
                        <td class="rental-customer-img">
                            <img src="<?php echo $fetch_clients_details['client_image_url']; ?>" alt="">
                            <?php echo $fetch_clients_details['client_name']; ?>
                        </td>
                        <td><?php echo substr($fetch_clients_details['client_personal_id'], 0, 3) . "-" . substr($fetch_clients_details['client_personal_id'], 3, 7) . "-" . substr($fetch_clients_details['client_personal_id'], -1); ?></td>
                        <td><?php

                            $groups = str_split($fetch_clients_details['client_cc_number'], 4);
                            $formattedNumber = implode(' ', $groups);

                            echo $formattedNumber;
                        
                        ?></td>
                        <td><?php 

                            $number = (float) $fetch_clients_details['client_credit_limit'];

                            $formattedNumber = number_format($number, 0, ',', ',');

                            echo "DOP " .  $formattedNumber;

                        ?></td>
                        <td><?php echo $fetch_clients_details['client_type']; ?></td>
                        <td>
                            <p class="status <?php if ($fetch_clients_details['client_state'] == "Activo") { echo "status-active"; } else { echo "status-inactive"; } ?>">
                                <?php echo $fetch_clients_details['client_state']; ?>
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
    <script src="../assets/scripts/clients.js"></script>
</body>

</html>