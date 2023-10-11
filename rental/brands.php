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
    <link rel="stylesheet" href="../assets/styles/brands.css">
    <title>Car Rental - Marcas</title>
</head>

<body>



    <div class="overlay">
        <div class="form-container">
            <div class="form-container-top">
                <h3>Añadir Marca de Vehículo</h3>
                <i class='bx bx-x close-overlay-icon'></i>
            </div>
            <div class="form-message-container">
                <p class="form-alert-message"></p>
            </div>
            <div class="form-container-body">
                <div class="brand-form-left-side">
                    <input type="file" accept="image/*" id="img-file" hidden>
                    <div class="preview-img-area" data-img="hello.png">
                        <i class='bx bx-cloud-upload'></i>
                        <h3>Subir imagen</h3>
                        <p>El tamaño de la imagen deber ser menor a <span>2MB</span></p>
                    </div>
                    <button type="button" class="select-preview-img">Seleccionar imagen</button>
                </div>
                <form action="" method="post" enctype="multipart/form-data" class="brand-form-right-side brand-form">
                    <div class="brand-description-container">
                        <div class="input-container">
                            <label for="brand-name">Nombre marca</label>
                            <input type="text" name="brand-name" class="brand-name">
                        </div>
                        <div class="input-container">
                            <label for="brand-description">Descripción marca</label>
                            <textarea name="brand-description" class="brand-description" cols="30" rows="3"></textarea>
                        </div>
                        <div class="input-container">
                            <label for="brand-state">Estado marca</label>
                            <select name="brand-state" class="brand-state">
                                <option value="">Seleccione un estado</option>
                                <option value="">Disponible</option>
                                <option value="">No Disponible</option>
                            </select>
                        </div>
                        <button type="button" class="submit-brand-btn">
                            Añadir marca
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <?php include "./nav-template.php"; ?>

    <div class="title-wrapper">

        <div class="title-left">
            <h1 class="title">Marcas</h1>
            <ul class="breadcrumbs">
                <li><a href="#">Inicio</a></li>
                <li class="divider">/</li>
                <li><a href="#" class="active">Marcas</a></li>
            </ul>
        </div>

        <div class="title-right">
            <button class="add-feature-btn brands-btn" id="add-brand-btn">
                <span class="add-feature-btn-icon">
                    <i class='bx bx-plus'></i>
                </span>
                <span class="add-feature-btn-text">Añadir marca</span>
            </button>
        </div>

    </div>

    <hr>

    <div class="info-data brands">

        <?php 
        
            $get_brands = mysqli_query($connection, "SELECT * FROM marcas ORDER BY brand_state ASC, brand_name ASC");

            if (mysqli_num_rows($get_brands) > 0) {

                while ($fetch_brands_info = mysqli_fetch_array($get_brands)) {

        
        ?>

            <div class="card brand-card" style="background: url('../assets/imgs/uploads/brands/<?php echo $fetch_brands_info['brand_image_path']; ?>') no-repeat center center/cover;" id="<?php echo $fetch_brands_info['brand_unique_id']; ?>">
                <div class="card-content">
                    <div class="card-status <?php echo $fetch_brands_info['brand_state'] == "Disponible" ? "available" : "not-available"; ?>">
                        <span><?php echo $fetch_brands_info['brand_state']; ?></span>
                    </div>
                    <h4 class="card-content-title"><?php echo $fetch_brands_info['brand_name'] ?></h4>
                    <p class="card-content-description"><?php echo $fetch_brands_info['brand_description']; ?></p>
                    <div class="card-action-btns">
                        <button class="edit-brand">Editar</button>
                        <button class="delete-brand">Eliminar</button>
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
    <script src="../assets/scripts/brands.js"></script>
</body>

</html>