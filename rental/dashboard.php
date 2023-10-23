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
    <link rel="stylesheet" href="../assets/styles/dashboard.css">
    <title>Car Rental - Tablero</title>
</head>

<body>

        <?php include "./nav-template.php"; ?>
    
        <?php
        
            $get_clients = mysqli_query($connection, "SELECT * FROM clientes");
            $get_employees = mysqli_query($connection, "SELECT * FROM empleados");
            $get_vehicles = mysqli_query($connection, "SELECT * FROM vehiculos");
            $get_total_income = mysqli_query($connection, "SELECT SUM(rent_price * rent_days) as total_income FROM rentas");
        
        ?>

            <h1 class="title">Tablero</h1>
            <ul class="breadcrumbs">
                <li><a href="#">Inicio</a></li>
                <li class="divider">/</li>
                <li><a href="#" class="active">Tablero</a></li>
            </ul>
            <div class="info-data">
                <div class="card">
                    <i class="bx bxs-car car-icon"></i>
                    <div class="card-info">
                        <span class="card-title">Vehículos en existencia</span>
                        <p class="card-data">
                        <?php 
                            
                            if (mysqli_num_rows($get_vehicles) > 0) {
                                if (mysqli_num_rows($get_vehicles) == 1) {
                                    echo mysqli_num_rows($get_vehicles) . " vehículo";
                                } else {
                                    echo mysqli_num_rows($get_vehicles) . " vehículos";
                                }
                            } else {
                                echo "No tiene clientes";
                            }
                        
                        ?>
                        </p>
                    </div>
                </div>
                <div class="card">
                    <i class="bx bxs-user user-icon"></i>
                    <div class="card-info">
                        <span class="card-title">Clientes actuales</span>
                        <p class="card-data">
                            <?php 
                            
                                if (mysqli_num_rows($get_clients) > 0) {
                                    if (mysqli_num_rows($get_clients) == 1) {
                                        echo mysqli_num_rows($get_clients) . " cliente";
                                    } else {
                                        echo mysqli_num_rows($get_clients) . " clientes";
                                    }
                                } else {
                                    echo "No tiene clientes";
                                }
                            
                            ?>
                        </p>
                    </div>
                </div>
                <div class="card">
                    <i class='bx bxs-user-badge employees-icon'></i>
                    <div class="card-info">
                        <span class="card-title">Cantidad de empleados</span>
                        <p class="card-data">
                            <?php
                                if (mysqli_num_rows($get_employees) > 0) {
                                    if (mysqli_num_rows($get_employees) == 1) {
                                        echo mysqli_num_rows($get_employees) . " empleado";
                                    } else {
                                        echo mysqli_num_rows($get_employees) . " empleados";
                                    }
                                } else {
                                    echo "No tiene empleados";
                                }
                            ?>
                        </p>
                    </div>
                </div>
                <div class="card">
                    <i class='bx bx-money money-icon'></i>
                    <div class="card-info">
                        <span class="card-title">Ganancias generadas</span>
                        <p class="card-data">
                            DOP <?php
                            
                                if (mysqli_num_rows($get_total_income) > 0) {
                                    $fetch_total_income = mysqli_fetch_array($get_total_income);
                                    $number = (float) $fetch_total_income['total_income'];
                                    $formattedNumber = number_format($number, 0, ',', ',');
                                    echo $formattedNumber;
                                }
                            
                            ?>
                        </p>
                    </div>
                </div>
            </div>
            <div class="data">
                <div class="content-data left-side">
                    <div class="head-prev-table">
                        <h3>Rentas de Clientes</h3>
                        <div class="prev-table-filter-search">
                            <i class='bx bx-filter'></i>
                            <i class='bx bx-search'></i>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Cliente</th>
                                <th>Vehículo</th>
                                <th>Fecha Renta</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="rental-customer-img">
                                    <img src="https://images.unsplash.com/photo-1619895862022-09114b41f16f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                                        alt="">
                                    Miladys Solís
                                </td>
                                <td>Toyota 4Runner 2023</td>
                                <td>19/09/2023</td>
                                <td>
                                    <p class="status status-active">
                                        Activa
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td class="rental-customer-img">
                                    <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80"
                                        alt="">
                                    Juan C. Romero
                                </td>
                                <td>Honda CR-V 2022</td>
                                <td>22/09/2023</td>
                                <td>
                                    <p class="status status-process">
                                        En proceso
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td class="rental-customer-img">
                                    <img src="https://images.unsplash.com/photo-1619895862022-09114b41f16f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                                        alt="">
                                    Leslie Romero Solís
                                </td>
                                <td>Kia Sportage Touring 2017</td>
                                <td>19/09/2023</td>
                                <td>
                                    <p class="status status-complete">
                                        Completada
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="content-data right-side">
                    <h3>Empleados destacados</h3>
                    <div class="employees-container">
                    <?php 

                        $get_outstanding_employees = mysqli_query($connection, "SELECT * FROM empleados LEFT JOIN rentas ON rentas.rent_employee = empleados.employee_name GROUP BY employee_name");

                        if (mysqli_num_rows($get_outstanding_employees) > 0) {

                            while ($fetch_outstanding_employees = mysqli_fetch_array($get_outstanding_employees)) {
                    
                    ?>
                        <div class="employee">
                            <div class="employee-name-image">
                                <img src="<?php echo $fetch_outstanding_employees['employee_image_url']; ?>" alt="">
                                <div class="employee-info">
                                    <h4><?php echo $fetch_outstanding_employees['employee_name']; ?></h4>
                                    <span>Antigüedad: <?php echo $fetch_outstanding_employees['employee_join_date']; ?></span>
                                </div>
                            </div>
                            <div class="employee-rent-count">
                                <span>
                                    <?php 
                                        $get_specific_employee = mysqli_query($connection, "SELECT * FROM rentas WHERE rent_employee = '". $fetch_outstanding_employees['employee_name'] ."'");
                                        echo mysqli_num_rows($get_specific_employee);
                                    ?>
                                </span>
                            </div>
                        </div>
                    <?php
                    
                            }

                        }
                    
                    ?>
                    </div>
                </div>
            </div>
        </main>
        <!-- MAIN -->
    </section>
    <!-- NAVBAR -->

    <script src="../assets/scripts/dashboard.js"></script>
</body>

</html>