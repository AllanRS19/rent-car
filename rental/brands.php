<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
    <link rel="stylesheet" href="../assets/styles/global.css">
    <link rel="stylesheet" href="../assets/styles/brands.css">
    <title>Rental Car - Marcas</title>
</head>

<body>



    <div class="overlay active">
        <div class="close-overlay-icon">
            <i class='bx bx-x'></i>
        </div>
        <div class="form-container">
            <div class="form-container-top">
                <h3>Añadir Marca de Vehículo</h3>
            </div>
            <form action="#" method="post" enctype="multipart/form-data" class="form-container-body">
                <div class="brand-form-left-side">
                    <input type="file" accept="image/*" id="img-file" hidden>
                    <div class="preview-img-area" data-img="hello.png">
                        <i class='bx bx-cloud-upload'></i>
                        <h3>Subir imagen</h3>
                        <p>El tamaño de la imagen deber ser menor a <span>2MB</span></p>
                        <!-- <img src="../assets/imgs/rent-car-wallpaper.jpg" alt=""> -->
                    </div>
                    <button type="button" class="select-preview-img">Seleccionar imagen</button>
                </div>
                <div class="brand-form-right-side"></div>
            </form>
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
                    <button class="add-feature-btn brands-btn">
                        <span class="add-feature-btn-icon">
                            <i class='bx bx-plus'></i>
                        </span>
                        <span class="add-feature-btn-text">Añadir marca</span>
                    </button>
                </div>

            </div>

            <hr>

            <div class="info-data brands">

                <div class="card brands">
                    <div class="card-content">
                        <h4 class="card-content-title">Toyota</h4>
                        <p class="card-content-description">Es una mezcla de hidrocarburos obtenida de la destilación fraccionada del petróleo kdklj aque losd mde aklsnfkl aopqmfmw</p>
                        <div class="card-action-btns">
                            <button class="edit-brand">Editar</button>
                            <button class="delete-brand">Eliminar</button>
                        </div>
                    </div>
                </div>
                
            </div>

        </main>
        <!-- MAIN -->
    </section>
    <!-- NAVBAR -->

    <script src="../assets/scripts/dashboard.js"></script>
    <script src="../assets/scripts/brands.js"></script>
</body>

</html>