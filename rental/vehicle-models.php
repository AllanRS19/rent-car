<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
    <link rel="stylesheet" href="../assets/styles/global.css">
    <link rel="stylesheet" href="../assets/styles/vehicle-models.css">
    <title>Rental Car - Marcas</title>
</head>

<body>

    <div class="overlay">
        <div class="form-container">
            <div class="form-container-top">
                <h3>Añadir Modelo de Vehículo</h3>
                <i class='bx bx-x close-overlay-icon'></i>
            </div>
            <div class="form-message-container">
                <p class="form-alert-message"></p>
            </div>
            <div class="form-container-body">
                <div class="veh-model-form-left-side">
                    <input type="file" accept="image/*" id="img-file" hidden>
                    <div class="preview-img-area" data-img="hello.png">
                        <i class='bx bx-cloud-upload'></i>
                        <h3>Subir imagen</h3>
                        <p>El tamaño de la imagen deber ser menor a <span>2MB</span></p>
                    </div>
                    <button type="button" class="select-preview-img">Seleccionar imagen</button>
                </div>
                <form action="" method="post" enctype="multipart/form-data" class="veh-model-form-right-side veh-model-form">
                    <div class="veh-model-description-container">
                        <div class="input-container">
                            <label for="veh-model-name">Nombre modelo</label>
                            <input type="text" name="veh-model-name" class="veh-model-name">
                        </div>
                        <div class="input-container">
                            <label for="veh-model-description">Descripción modelo</label>
                            <textarea name="veh-model-description" class="veh-model-description" cols="30" rows="3"></textarea>
                        </div>
                        <div class="input-container">
                            <label for="veh-model-brand">Marca del modelo</label>
                            <select name="veh-model-brand" class="veh-model-brand">
                                <option value="">Seleccione una marca para el modelo</option>
                                <option value="">Toyota</option>
                                <option value="">Honda</option>
                                <option value="">Mercedes Benz</option>
                                <option value="">BMW</option>
                            </select>
                        </div>
                        <div class="input-container">
                            <label for="veh-model-state">Estado modelo</label>
                            <select name="veh-model-state" class="veh-model-state">
                                <option value="">Seleccione un estado</option>
                                <option value="">Disponible</option>
                                <option value="">No Disponible</option>
                            </select>
                        </div>
                        <button type="button" class="submit-veh-model-btn">
                            Añadir Modelo
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <?php include "./nav-template.php"; ?>

    <div class="title-wrapper">

        <div class="title-left">
            <h1 class="title">Modelos</h1>
            <ul class="breadcrumbs">
                <li><a href="#">Inicio</a></li>
                <li class="divider">/</li>
                <li><a href="#" class="active">Modelos</a></li>
            </ul>
        </div>

        <div class="title-right">
            <button class="add-feature-btn veh-models-btn" id="add-veh-model-btn">
                <span class="add-feature-btn-icon">
                    <i class='bx bx-plus'></i>
                </span>
                <span class="add-feature-btn-text">Añadir modelo</span>
            </button>
        </div>

    </div>

    <hr>

    <?php 
    
        $get_brands = mysqli_query($connection, "SELECT * FROM marcas WHERE brand_state = 'Disponible' ORDER BY brand_name ASC");

        if (mysqli_num_rows($get_brands) > 0) {

            while ($fetch_brands_info = mysqli_fetch_array($get_brands)) {

    ?>

            <h2 class="brand-title"><?php echo $fetch_brands_info['brand_name']; ?></h2>

            <div class="info-data veh-models <?php echo $fetch_brands_info['brand_name']; ?>">

    <?php 
    
            $get_brand_models = mysqli_query($connection, "SELECT * FROM modelo_vehiculos WHERE veh_brand_identifier = '". $fetch_brands_info['brand_name']."' ORDER BY veh_model_state ASC, veh_model_name ASC");

            if (mysqli_num_rows($get_brand_models) > 0) {

                while ($fetch_brands_models_info = mysqli_fetch_array($get_brand_models)) {                  
    
    ?>

                <div class="card veh-model-card" style="background: url('../assets/imgs/uploads/vehicle-models/<?php echo $fetch_brands_models_info['veh_model_image_path']; ?>') no-repeat center center/cover;" id="<?php echo $fetch_brands_models_info['veh_model_unique_id']; ?>">
                    <div class="card-content">
                        <div class="card-status <?php echo $fetch_brands_models_info['veh_model_state'] == "Disponible" ? "available" : "not-available"; ?>">
                            <span><?php echo $fetch_brands_models_info['veh_model_state']; ?></span>
                        </div>
                        <h4 class="card-content-title"><?php echo $fetch_brands_models_info['veh_model_name']; ?></h4>
                        <p class="card-content-description"><?php echo $fetch_brands_models_info['veh_model_description']; ?></p>
                        <div class="card-action-btns">
                            <button class="edit-veh-model">Editar</button>
                            <button class="delete-veh-model">Eliminar</button>
                        </div>
                    </div>
                </div>

    <?php 
    
                }

            }
    
    ?>

        </div>

    <?php 
    
                }

            }

    ?>

    </main>
    <!-- MAIN -->
    </section>
    <!-- NAVBAR -->

    <script src="../assets/scripts/dashboard.js"></script>
    <script src="../assets/scripts/vehicle-models.js"></script>
</body>

</html>