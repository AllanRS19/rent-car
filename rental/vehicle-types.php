<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
    <link rel="stylesheet" href="../assets/styles/global.css">
    <link rel="stylesheet" href="../assets/styles/fuel-types.css">
    <title>Car Rental - Tipos de Vehículos</title>
</head>

<body>

    <div class="overlay">
        <div class="close-overlay-icon">
            <i class='bx bx-x'></i>
        </div>
        <div class="add-vehicle-type-form-container">

            <div class="add-vehicle-type-form-container-top">
                <h2>Añadir Tipo de Vehículo</h2>
            </div>

            <form action="" method="post">

                <div class="form-message">
                    <p>Este tipo de vehículo ya está registrado</p>
                </div>

                <div class="input-container">
                    <label for="">Nombre Tipo de Vehículo</label>
                    <input type="text" class="vehicle-type-name">
                </div>

                <div class="input-container">
                    <label for="">Descripción Tipo de Vehículo</label>
                    <textarea name="" id="" cols="30" rows="5" class="vehicle-type-description"></textarea>
                </div>

                <div class="input-container">
                    <label for="">Estado de Tipo de Vehículo</label>
                    <select name="" id="" class="vehicle-type-status">
                        <option value="None">Escoge una opción</option>
                        <option value="Disponible">Disponible</option>
                        <option value="Disponible">No Disponible</option>
                    </select>
                </div>

                <button class="add-vehicle-type-btn">
                    Añadir Tipo de Vehículo
                </button>

            </form>
        </div>
    </div>

        <?php include "./nav-template.php"; ?>

            <div class="title-wrapper">

                <div class="title-left">
                    <h1 class="title">Tipos de Vehículos</h1>
                    <ul class="breadcrumbs">
                        <li><a href="#">Inicio</a></li>
                        <li class="divider">/</li>
                        <li><a href="#" class="active">Tipos de Vehículos</a></li>
                    </ul>
                </div>

                <div class="title-right">
                    <button class="add-feature-btn vehicle-types-btn">
                        <span class="add-feature-btn-icon">
                            <i class='bx bx-plus'></i>
                        </span>
                        <span class="add-feature-btn-text">Añadir Tipo de Vehículo</span>
                    </button>
                </div>

            </div>

            <hr>

            <div class="info-data vehicle-types">

                <?php 
                
                    $get_vehicles_types = mysqli_query($connection, "SELECT * FROM tipos_vehiculos ORDER BY vehicle_type_state ASC, vehicle_type_name ASC");

                    if (mysqli_num_rows($get_vehicles_types) > 0) {

                        while ($fetch_vehicles_types_info = mysqli_fetch_array($get_vehicles_types)) {

                
                ?>

                <div class="card vehicle-type" id="<?php echo $fetch_vehicles_types_info['vehicle_type_unique_id']; ?>">
                    <div class="card-options-overlay">
                        <button class="edit-vehicle-type-btn">Editar</button>
                        <button class="delete-vehicle-type-btn">Eliminar</button>
                    </div>
                    <div class="card-background-img vehicle-types-background-img"></div>
                    <div class="card-top">
                        <div class="card-top-status 
                            <?php 
                            
                                if ($fetch_vehicles_types_info['vehicle_type_state'] == "Disponible") echo "available";
                                else if ($fetch_vehicles_types_info['vehicle_type_state'] == "No disponible") echo "not-available";
                            
                            ?>
                        ">
                            <span><?php echo $fetch_vehicles_types_info['vehicle_type_state']; ?></span>
                        </div>
                    </div>
                    <div class="card-content">
                        <div class="icon-box">
                            <i class='bx bx-car'></i>
                        </div>
                        <h4 class="card-content-title"><?php echo $fetch_vehicles_types_info['vehicle_type_name']; ?></h4>
                        <p class="card-content-description"><?php echo $fetch_vehicles_types_info['vehicle_type_description']; ?></p>
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
    <script src="../assets/scripts/vehicle-types.js"></script>
</body>

</html>