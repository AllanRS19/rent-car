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
    <link rel="stylesheet" href="../assets/styles/global.css">
    <link rel="stylesheet" href="../assets/styles/vehicles.css">
    <title>Car Rental - Vehículos</title>
</head>

<body>

    <?php include "../server/db_connection.php"; ?>

    <div class="overlay">
        <div class="form-container">
            <div class="form-container-top">
                <h3>Añadir Vehículo</h3>
                <i class='bx bx-x close-overlay-icon'></i>
            </div>
            <div class="form-message-container">
                <p class="form-alert-message"></p>
            </div>
            <div class="form-container-body">
                <div class="vehicles-form-left-side">
                    <input type="file" accept="image/*" id="img-file" hidden>
                    <div class="preview-img-area" data-img="hello.png">
                        <i class='bx bx-cloud-upload'></i>
                        <h3>Subir imagen</h3>
                        <p>El tamaño de la imagen deber ser menor a <span>2MB</span></p>
                    </div>
                    <button type="button" class="select-preview-img">Seleccionar imagen</button>
                </div>
                <form action="" method="post" enctype="multipart/form-data" class="vehicles-form-right-side vehicles-form">
                    <div class="vehicle-input-wrapper">
                        <div class="input-container">
                            <label>Marca Vehículo</label>
                            <select name="vehicle-brand" class="vehicle-brand">
                                <option value="">Seleccione una marca</option>
                                <?php
                                
                                    $get_brands = mysqli_query($connection, "SELECT * FROM marcas WHERE brand_state = 'Disponible'");

                                    if (mysqli_num_rows($get_brands) > 0) {

                                        while ($fetch_brand_names = mysqli_fetch_array($get_brands)) {
                                
                                ?>

                                <option value=""><?php echo $fetch_brand_names['brand_name']; ?></option>

                                <?php 
                                
                                        }

                                    }
                                
                                ?>
                            </select>
                        </div>
                        <div class="input-container">
                            <label>Modelo Vehículo</label>
                            <select name="vehicle-model" class="vehicle-model">
                                <option value="">Seleccione un modelo</option>
                                <?php
                                
                                    $get_model = mysqli_query($connection, "SELECT * FROM modelo_vehiculos WHERE veh_model_state = 'Disponible'");

                                    if (mysqli_num_rows($get_model) > 0) {

                                        while ($fetch_model_names = mysqli_fetch_array($get_model)) {
                                
                                ?>

                                <option value=""><?php echo $fetch_model_names['veh_model_name']; ?></option>

                                <?php 
                                
                                        }

                                    }
                                
                                ?>
                            </select>
                        </div>
                        <div class="input-container">
                            <label>Año Vehículo</label>
                            <input type="text" name="vehicle-year" class="vehicle-year">
                        </div>
                    </div>
                    <div class="vehicle-input-wrapper">
                        <div class="input-container">
                            <label>Tipo de Vehículo</label>
                            <select name="vehicle-type" class="vehicle-type">
                                <option value="">Seleccione un tipo de vehículo</option>
                                <?php
                                
                                    $get_vehicle_types = mysqli_query($connection, "SELECT * FROM tipos_vehiculos WHERE vehicle_type_state = 'Disponible'");

                                    if (mysqli_num_rows($get_vehicle_types) > 0) {

                                        while ($fetch_vehicle_type_name = mysqli_fetch_array($get_vehicle_types)) {
                                
                                ?>

                                <option value=""><?php echo $fetch_vehicle_type_name['vehicle_type_name']; ?></option>

                                <?php 
                                
                                        }

                                    }
                                
                                ?>
                            </select>
                        </div>
                        <div class="input-container">
                            <label>Tipo de Combustible</label>
                            <select name="vehicle-fuel" class="vehicle-fuel">
                                <option value="">Seleccione un combustible</option>
                                <?php
                                
                                    $get_fuel_types = mysqli_query($connection, "SELECT * FROM tipos_combustible WHERE fuel_state = 'Disponible'");

                                    if (mysqli_num_rows($get_fuel_types) > 0) {

                                        while ($fetch_fuel_type_name = mysqli_fetch_array($get_fuel_types)) {
                                
                                ?>

                                <option value=""><?php echo $fetch_fuel_type_name['fuel_name']; ?></option>

                                <?php 
                                
                                        }

                                    }
                                
                                ?>
                            </select>
                        </div>
                        <div class="input-container">
                            <label>No. de Placa</label>
                            <input type="text" name="vehicle-plate" class="vehicle-plate">
                        </div>
                    </div>
                    <div class="vehicle-input-wrapper">
                        <div class="input-container">
                            <label>No. de Motor</label>
                            <input type="text" name="vehicle-motor-num" class="vehicle-motor-num">
                        </div>
                        <div class="input-container">
                            <label>No. de Chasis</label>
                            <input type="text" name="vehicle-chasis-num" class="vehicle-chasis-num">
                        </div>
                        <div class="input-container">
                            <label>Cantidad de Pasajeros</label>
                            <input type="text" name="vehicle-passengers-count" class="vehicle-passengers-count">
                        </div>
                    </div>
                    <div class="vehicle-input-wrapper">
                        <div class="input-container">
                            <label>Precio Renta</label>
                            <input type="text" name="vehicle-price" class="vehicle-price">
                        </div>
                        <div class="input-container">
                            <label>Description</label>
                            <input type="text" name="vehicle-description" class="vehicle-description">
                        </div>
                        <div class="input-container">
                            <label>Estado vehículo</label>
                            <select name="vehicle-state" class="vehicle-state">
                                <option value="">Seleccione un estado</option>
                                <option value="">Disponible</option>
                                <option value="">No Disponible</option>
                            </select>
                        </div>
                    </div>
                    <button type="button" class="submit-vehicle-btn">
                        Añadir Vehículo
                    </button>
                </form>
            </div>
        </div>
    </div>

    <div class="rent-form-overlay">
        <div class="close-rent-overlay-btn">
            <i class='bx bx-x'></i>
        </div>
        <div class="rent-form-container">
            <header>
                Formulario de Renta
                <div class="rent-form-message-container">
                    <p></p>
                </div>
            </header>
            <div class="progress-bar">
                <div class="step">
                    <p>Inspección</p>
                    <div class="bullet">
                        <span>1</span>
                    </div>
                    <div class="check bx bx-check"></div>
                </div>
                <div class="step">
                    <p>Renta</p>
                    <div class="bullet">
                        <span>2</span>
                    </div>
                    <div class="check bx bx-check"></div>
                </div>
            </div>
            <div class="form-outer">
                <form action="#" method="post" class="rent-form">

                    <div class="page slide-page">
                        <!-- <div class="title">Inspección vehículo</div> -->
                        <div class="vehicle-info">
                            <img src="" alt="">
                            <!-- <h3>Honda Accord 2023</h3> -->
                        </div>
                        <div class="fields-wrapper">
                            <div class="field inspect">
                                <div class="label">Ralladuras</div>
                                <input type="checkbox" name="ralladuras" class="ralladuras">
                            </div>
                            <div class="field inspect">
                                <div class="label">Roturas cristal</div>
                                <input type="checkbox" name="rotura-cristal" class="rotura-cristal">
                            </div>
                            <div class="field inspect">
                                <div class="label">Goma repuesto</div>
                                <input type="checkbox" name="goma-respuesto" class="goma-repuesto">
                            </div>
                            <div class="field inspect">
                                <div class="label">Gato Hidraúlico</div>
                                <input type="checkbox" name="gato-hidraulico" class="gato-hidraulico">
                            </div>
                        </div>
                        <div class="fields-wrapper twice">
                            <input type="hidden" name="vehicle-identifier" class="vehicle-identifier">
                            <div class="field inspect">
                                <div class="label">Nivel Combustible</div>
                                <select name="nivel-combustible" class="nivel-combustible">
                                    <option value="">Lleno</option>
                                    <option value="">1/4</option>
                                    <option value="">1/2</option>
                                </select>
                            </div>
                            <div class="field inspect">
                                <div class="label">Estado Gomas</div>
                                <input type="text" name="estado-gomas" class="estado-gomas">
                            </div>
                        </div>
                        <div class="field next-btn">
                            <button type="button">Siguiente</button>
                        </div>
                    </div>

                    <div class="page rent-side">
                        <!-- <div class="title">Renta vehículo</div> -->
                        <div class="fields-wrapper triple">
                            <div class="field">
                                <div class="label">Identificador</div>
                                <input type="text" name="rent-identificator" class="field-disabled rent-identificator">
                            </div>
                            <div class="field">
                                <div class="label">Vehículo</div>
                                <input type="text" name="rent-vehicle" id="" class="field-disabled rent-vehicle">
                            </div>
                            <div class="field">
                                <div class="label">Precio x Día</div>
                                <input type="text" name="rent-price" id="" class="field-disabled rent-price">
                            </div>
                        </div>
                        <div class="fields-wrapper triple">
                            <div class="field">
                                <div class="label">Fecha renta</div>
                                <input type="date" name="rent-date" class="rent-date">
                            </div>
                            <div class="field">
                                <div class="label">Fecha devolución</div>
                                <input type="date" name="rent-return-date" class="rent-return-date">
                            </div>
                            <div class="field">
                                <div class="label">Días</div>
                                <input type="text" name="rent-days" class="field-disabled rent-days">
                            </div>
                        </div>
                        <div class="fields-wrapper twice select-fields">
                            <div class="field">
                                <div class="label">Cliente</div>
                                <select name="rent-client" class="rent-client">
                                    <?php 
                                        
                                        $get_clients = mysqli_query($connection, "SELECT client_name FROM clientes WHERE client_state = 'Activo'");

                                        if (mysqli_num_rows($get_clients) > 0) {

                                            while ($fetch_client_name = mysqli_fetch_array($get_clients)) {
                                    
                                    ?>

                                    <option value=""><?php echo $fetch_client_name['client_name']; ?></option>

                                    <?php
                                    
                                            }

                                        }
                                    
                                    ?>
                                </select>
                            </div>
                            <div class="field">
                                <div class="label">Empleado</div>
                                <select name="rent-employee" class="rent-employee">
                                    <?php 
                                    
                                        $get_employees = mysqli_query($connection, "SELECT employee_name FROM empleados WHERE employee_state = 'Activo'");

                                        if (mysqli_num_rows($get_employees) > 0) {

                                            while ($fetch_employee_name = mysqli_fetch_array($get_employees)) {
                                    
                                    ?>

                                    <option value=""><?php echo $fetch_employee_name['employee_name']; ?></option>

                                    <?php
                                    
                                            }

                                        }
                                    
                                    ?>
                                </select>
                            </div>
                        </div>
                        <div class="field single-input">
                                <div class="label">Comentario</div>
                                <input type="text" name="rent-comment" class="rent-comment">
                            </div>
                        <div class="field btns">
                            <button class="prev" type="button">Anterior</button>
                            <button type="submit" class="submit" rentformaction="rent">Rentar vehículo</button>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    </div>

    <?php include "./nav-template.php"; ?>

    <div class="title-wrapper">

        <div class="title-left">
            <h1 class="title">Vehículos</h1>
            <ul class="breadcrumbs">
                <li><a href="#">Inicio</a></li>
                <li class="divider">/</li>
                <li><a href="#" class="active">Vehículos</a></li>
            </ul>
        </div>

        <div class="title-right">
            <button class="add-feature-btn vehicles-btn" id="add-vehicle-btn">
                <span class="add-feature-btn-icon">
                    <i class='bx bx-plus'></i>
                </span>
                <span class="add-feature-btn-text">Añadir Vehículo</span>
            </button>
        </div>

    </div>

    <hr>

    <div class="info-data vehicles">
        <?php 
        
                $get_vehicles = mysqli_query($connection, "SELECT * FROM vehiculos ORDER BY vehicle_state ASC");

                if (mysqli_num_rows($get_vehicles)) {

                    while ($fetch_vehicles_details = mysqli_fetch_array($get_vehicles)) {
                                    
        ?>
        <div class="card vehicle-card-container" id="<?php echo $fetch_vehicles_details['vehicle_unique_id']; ?>">
            <div class="vehicle-card-container-top">
                <div class="vehicle-card-top-left">
                    <h2><?php echo $fetch_vehicles_details['vehicle_brand']; ?> <?php echo $fetch_vehicles_details['vehicle_model']; ?> <span class="vehicle-year-span"><?php echo $fetch_vehicles_details['vehicle_year']; ?></span></h2>
                    <span class="price-per-day">
                        DOP <?php $number = (float) $fetch_vehicles_details['vehicle_rent_price'];

                                    $formattedNumber = number_format($number, 0, ',', ',');

                                    echo $formattedNumber; ?> / Día
                    </span>
                </div>
                <div class="vehicle-card-top-right <?php if ($fetch_vehicles_details['vehicle_state'] == "Disponible") {echo "vehicle-status-available";} else if ($fetch_vehicles_details['vehicle_state'] == "No disponible") {echo "vehicle-status-not-available";} else if ($fetch_vehicles_details['vehicle_state'] == "Rentado") {echo "vehicle-status-rent-active";} ?>">
                    <p><?php echo $fetch_vehicles_details['vehicle_state']; ?></p>
                </div>
            </div>
            <div class="vehicle-card-container-img">
                <img src="../assets/imgs/uploads/vehicles/<?php echo $fetch_vehicles_details['vehicle_image_path']; ?>" alt="">
            </div>
            <div class="vehicle-card-container-content">
                <div class="vehicle-card-container-content-info">
                    <div class="vehicle-info-data seats">
                        <i class='bx bxs-user'></i>
                        <span><?php echo $fetch_vehicles_details['vehicle_passengers']; ?> personas</span>
                    </div>
                    <div class="vehicle-info-data fuel">
                        <i class='bx bxs-gas-pump'></i>
                        <span><?php echo $fetch_vehicles_details['vehicle_fuel']; ?></span>
                    </div>
                    <div class="vehicle-info-data vehicle-type">
                        <i class='bx bxs-car'></i>
                        <span><?php echo $fetch_vehicles_details['vehicle_type']; ?></span>
                    </div>
                    <div class="vehicle-info-data plate">
                        <i class='bx bxs-notepad'></i>
                        <span><?php echo $fetch_vehicles_details['vehicle_plate']; ?></span>
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
                    <button class="rent-car-btn <?php if ($fetch_vehicles_details['vehicle_state'] == "No disponible") echo "disabled"; ?>" <?php if ($fetch_vehicles_details['vehicle_state'] == "No disponible") echo "disableb"; ?> btnaction="<?php if ($fetch_vehicles_details['vehicle_state'] == "Disponible") { echo "rent-car"; } else if ($fetch_vehicles_details['vehicle_state'] == "Rentado") { echo "return-car"; }; ?>"><?php if ($fetch_vehicles_details['vehicle_state'] == "Disponible" || $fetch_vehicles_details['vehicle_state'] == "No disponible") {echo "Rentar";} else if ($fetch_vehicles_details['vehicle_state'] == "Rentado") {echo "Devolver vehículo";} ?></button>
                </div>
            </div>
        </div>

        <?php 
    
                }

            }

        ?>

    </div>

    </main>
    <!-- MAIN -->
    </section>
    <!-- NAVBAR -->

    <script src="../assets/scripts/dashboard.js"></script>
    <script src="../assets/scripts/vehicles.js"></script>
</body>

</html>