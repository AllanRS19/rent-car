<?php 

    session_start();

    if (!isset($_SESSION['user_ident']) && $_SESSION['user_ident'] == "") {

        header("location: ../auth.php");
        
    }

    $currentPath = pathinfo($_SERVER['REQUEST_URI']);
    $currentPage = basename($currentPath['filename']);

    include "../server/db_connection.php";

?>

<section id="sidebar">
    <a href="#" class="brand"><i class='bx bxs-car icon'></i> Rental Car</a>
    <ul class="side-menu">
        <li><a href="<?php if ($currentPage == "dashboard") { echo "#"; } else { echo "./dashboard.php"; }; ?>"<?php if ($currentPage == "dashboard") echo "class='active'"; ?>><i class='bx bxs-dashboard icon'></i> Tablero</a></li>
        <li class="divider" data-text="Principal">Principal</li>
        <li>
            <a href="<?php if ($currentPage == "fuel-types") { echo "#"; } else { echo "./fuel-types.php"; }; ?>" <?php if ($currentPage == "fuel-types") echo "class='active'"; ?>><i class='bx bxs-gas-pump icon'></i> Combustible</a>
        </li>
        <li>
            <a href="<?php if ($currentPage == "vehicle-types") { echo "#"; } else { echo "./vehicle-types.php"; }; ?> " <?php if ($currentPage == "vehicle-types") echo "class='active'"; ?>><i class='bx bxs-chart icon'></i> Tipos de vehículos</a>
        </li>
        <li>
            <a href="<?php if ($currentPage == "brands") { echo "#"; } else { echo "./brands.php"; }; ?>" <?php if ($currentPage == "brands") echo "class='active'"; ?>><i class='bx bxs-widget icon'></i> Marcas</a>
        </li>
        <li>
            <a href="<?php if ($currentPage == "vehicle-models") { echo "#"; } else { echo "./vehicle-models.php"; }; ?>" <?php if ($currentPage == "vehicle-models") echo "class='active'"; ?>><i class='bx bx-table icon'></i> Modelos</a>
        </li>
        <li>
            <a href="#"><i class='bx bxs-notepad icon'></i> Vehículos</a>
        </li>
        <li>
            <a href="#"><i class='bx bxs-notepad icon'></i> Clientes</a>
        </li>
        <li>
            <a href="#"><i class='bx bxs-notepad icon'></i> Empleados</a>
        </li>
        <li>
            <a href="#"><i class='bx bxs-notepad icon'></i> Rentas</a>
        </li>
    </ul>
    <!-- <div class="ads">
            <div class="wrapper">
                <a href="#" class="btn-upgrade">Upgrade</a>
                <p>Become a <span>PRO</span> member and enjoy <span>All Features</span></p>
            </div>
        </div> -->
</section>
<!-- SIDEBAR -->

<?php 

    $get_user_details = mysqli_query($connection, "SELECT * FROM usuarios WHERE user_unique_id = '". $_SESSION['user_ident'] ."'");

    if (mysqli_num_rows($get_user_details) > 0) {

        $user_details = mysqli_fetch_array($get_user_details);

    }
    
    // $currentPage = basename(pathinfo($_SERVER['REQUEST_URI']));

?>

<!-- NAVBAR -->
<section id="content">
    <!-- NAVBAR -->
    <nav>
        <i class='bx bx-menu toggle-sidebar'></i>
        <form action="#">
            <div class="form-group">
                <input type="text" placeholder="Buscar..." value="">
                <i class='bx bx-search icon'></i>
            </div>
        </form>
        <a href="#" class="nav-link">
            <i class='bx bxs-bell icon'></i>
            <span class="badge">5</span>
        </a>
        <a href="#" class="nav-link">
            <i class='bx bxs-message-square-dots icon'></i>
            <span class="badge">8</span>
        </a>
        <span class="divider"></span>
        <div class="profile">
            <div class="profile-info">
                <h4><?php echo $user_details['user_name'] ;?></h4>
                <img src="<?php echo $user_details['user_image']; ?>" alt="">
            </div>
            <ul class="profile-link">
                <li><a href="#"><i class='bx bxs-user-circle icon'></i> Perfil</a></li>
                <li><a href="#"><i class='bx bxs-cog'></i> Configuración</a></li>
                <li><a href="../server/log_session_out.php"><i class='bx bxs-log-out-circle'></i> Cerrar sesión</a></li>
            </ul>
        </div>
    </nav>
    <!-- NAVBAR -->

    <!-- MAIN -->
    <main>
        