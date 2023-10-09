<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
    <link rel="stylesheet" href="../assets/styles/global.css">
    <link rel="stylesheet" href="../assets/styles/fuel-types.css">
    <title>Car Rental - Combustibles</title>
</head>

<body>

    <div class="overlay">
        <div class="close-overlay-icon">
            <i class='bx bx-x'></i>
        </div>
        <div class="add-fuel-form-container">

            <div class="add-fuel-form-container-top">
                <h2>Añadir Tipo de Combustible</h2>
            </div>

            <form action="" method="post">

                <div class="form-message">
                    <p>Este tipo de combustible ya está registrado</p>
                </div>

                <div class="input-container">
                    <label for="">Nombre de Combustible</label>
                    <input type="text" class="fuel-name">
                </div>

                <div class="input-container">
                    <label for="">Descripción de Combustible</label>
                    <textarea name="" id="" cols="30" rows="5" class="fuel-description"></textarea>
                </div>

                <div class="input-container">
                    <label for="">Estado de Combustible</label>
                    <select name="" id="" class="fuel-status">
                        <option value="None">Escoge una opción</option>
                        <option value="Disponible">Disponible</option>
                        <option value="Disponible">No Disponible</option>
                    </select>
                </div>

                <button class="add-fuel-btn">
                    Añadir Combustible
                </button>

            </form>
        </div>
    </div>

        <?php include "./nav-template.php"; ?>

            <div class="title-wrapper">

                <div class="title-left">
                    <h1 class="title">Combustibles</h1>
                    <ul class="breadcrumbs">
                        <li><a href="#">Inicio</a></li>
                        <li class="divider">/</li>
                        <li><a href="#" class="active">Combustibles</a></li>
                    </ul>
                </div>

                <div class="title-right">
                    <button class="add-feature-btn fuels-btn">
                        <span class="add-feature-btn-icon">
                            <i class='bx bx-plus'></i>
                        </span>
                        <span class="add-feature-btn-text">Añadir combustible</span>
                    </button>
                </div>

            </div>

            <hr>

            <div class="info-data fuels">

                <?php 
                
                    $get_fuels = mysqli_query($connection, "SELECT * FROM tipos_combustible ORDER BY fuel_state ASC, fuel_name ASC");

                    if (mysqli_num_rows($get_fuels) > 0) {

                        while ($fetch_fuels_info = mysqli_fetch_array($get_fuels)) {

                
                ?>

                <div class="card fuel-type" id="<?php echo $fetch_fuels_info['fuel_unique_id']; ?>">
                    <div class="card-options-overlay">
                        <button class="edit-fuel-btn">Editar</button>
                        <button class="delete-fuel-btn">Eliminar</button>
                    </div>
                    <div class="card-background-img"></div>
                    <div class="card-top">
                        <div class="card-top-status 
                            <?php 
                            
                                if ($fetch_fuels_info['fuel_state'] == "Disponible") echo "available";
                                else if ($fetch_fuels_info['fuel_state'] == "No disponible") echo "not-available";
                            
                            ?>
                        ">
                            <span><?php echo $fetch_fuels_info['fuel_state']; ?></span>
                        </div>
                    </div>
                    <div class="card-content">
                        <div class="icon-box">
                            <i class='bx bx-gas-pump'></i>
                        </div>
                        <h4 class="card-content-title"><?php echo $fetch_fuels_info['fuel_name']; ?></h4>
                        <p class="card-content-description"><?php echo $fetch_fuels_info['fuel_description']; ?></p>
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
    <script src="../assets/scripts/fuel-types.js"></script>
</body>

</html>